const axios = require("axios");
const FormData = require("form-data");
const connection = require("../database");
const LogModel = require("../models/logModel");
const AddressModel = require("../models/addressModels");
const CartModel = require("../models/cartModels");
const PackageModel = require("../models/packageModel");
const SettingModel = require("../models/settingModels");
const UserModel = require("../models/userModel");
const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const writeLog = async (user, action, pk_id, session) => {
  try {
    const result = await LogModel.insertMany(
      [
        {
          user: user,
          action: action,
          package: pk_id,
        },
      ],
      { session: session, rawResult: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const generalHandle = async (action, res) => {
  const session = await connection.startSession();
  try {
    session.startTransaction();
    const successResponseText = await action(session);
    await session.commitTransaction();
    res.status(200).json({ msg: successResponseText });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({
      msg: "Failed. Server error!",
    });
  }
  session.endSession();
};

const generalHandleWithoutTransaction = async (action, res, errorMeg) => {
  try {
    await action();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMeg });
  }
};

const trackParcel = async (pk_id, returnContent) => {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append("source_sn[0]", pk_id);
    bodyFormData.append("token", "9f842a5d8c6bb6a4922a25ec24cd82b54330");
    const response = await axios({
      method: "post",
      url: "https://poldata.cdnchina360.com/open_api/get_order/track",
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
    });
    if (response.data.msg !== "success") {
      throw response.data.msg;
    } else {
      return parseParcelResponse(response.data, returnContent);
    }
  } catch (error) {
    throw error;
  }
};

const parseParcelResponse = (data, returnContent) => {
  try {
    if (returnContent === "sendTime") {
      return data.data[0].tklist[0].time;
    } else if (returnContent === "sendTimeAndTrack") {
      const trackInfo = data.data[0].tklist.map((item) => ({
        time: item.time,
        message: item.record,
      }));
      const domesticCourier = data.data[0].trans_cpy;
      const domesticParcelID = data.data[0].trans_num;
      const status = data.data[0].status_ex;
      return { trackInfo, domesticCourier, domesticParcelID, status };
    }
  } catch (error) {
    throw error;
  }
};

const updateNote = async (req, res) => {
  const { newNote, type, _id } = req.body;

  // Make sure the item exists in the database.
  try {
    const originalRecord = await typeToModel(type).findById(_id);
    if (originalRecord === null) {
      return res.status(400).json({
        msg: "Failed to update the note. Can not find the record in the database.",
      });
    }

    // Update the note.
    await typeToModel(type).findByIdAndUpdate(_id, { $set: { note: newNote } });
    res.status(200).json({ msg: "Note has been updated successfully." });
  } catch (error) {
    console.log("Failed to update the note. Server error.");
    throw error;
  }
};

const typeToModel = (type) => {
  const modelsMap = {
    sold: SoldItemsModel,
    stock: StockItemsModel,
    employee: EmployeeItemsModel,
    exception: ExceptionItemModel,
    address: AddressModel,
    cart: CartModel,
    log: LogModel,
    package: PackageModel,
    setting: SettingModel,
    user: UserModel,
  };
  return modelsMap[type];
};

const getOrderModels = () => {
  return [
    SoldItemsModel,
    StockItemsModel,
    EmployeeItemsModel,
    ExceptionItemModel,
  ];
};

const getSettingValues = async () => {
  try {
    const [normalPostageResult, babyFormulaPostageResult, exchangeRateResult] =
      await typeToModel("setting").find();
    return {
      normalPostage: normalPostageResult.value,
      babyFormulaPostage: babyFormulaPostageResult.value,
      exchangeRate: exchangeRateResult.value,
    };
  } catch (error) {
    throw error;
  }
};

const calculatePostageInRMB = async (type, weightEach, qty) => {
  try {
    const { normalPostage, babyFormulaPostage, exchangeRate } =
      await getSettingValues();
    if (type === "非奶粉") {
      return (
        floatMultiply100ToInt(
          (floatMultiply100ToInt(normalPostage) *
            floatMultiply100ToInt(weightEach) *
            floatMultiply100ToInt(exchangeRate) *
            qty) /
            1000000
        ) / 100
      );
    } else if (type === "奶粉") {
      // The return value is not rounded.
      return (
        floatMultiply100ToInt(
          (floatMultiply100ToInt(
            floatMultiply100ToInt(babyFormulaPostage) / 3
          ) *
            floatMultiply100ToInt(exchangeRate) *
            qty) /
            1000000
        ) / 100
      );
    }
  } catch (error) {
    throw error;
  }
};

const calculateItemCostInRMB = async (pharmacyPriceEach, qty) => {
  try {
    const { exchangeRate } = await getSettingValues();
    return (
      floatMultiply100ToInt(
        (floatMultiply100ToInt(pharmacyPriceEach) *
          qty *
          floatMultiply100ToInt(exchangeRate)) /
          10000
      ) / 100
    );
  } catch (error) {
    throw error;
  }
};

const calculateCost = async (pharmacyPriceEach, type, weightEach, qty) => {
  try {
    const postage = await calculatePostageInRMB(type, weightEach, qty);

    const itemCost = await calculateItemCostInRMB(pharmacyPriceEach, qty);
    const cost =
      floatMultiply100ToInt(
        (floatMultiply100ToInt(postage) + floatMultiply100ToInt(itemCost)) / 100
      ) / 100;
    return cost;
  } catch (error) {
    throw error;
  }
};

const calculateProfits = (payAmountFromCustomer, cost) => {
  const profits =
    floatMultiply100ToInt(
      (floatMultiply100ToInt(payAmountFromCustomer) -
        floatMultiply100ToInt(cost)) /
        100
    ) / 100;
  return profits;
};

const floatMultiply100ToInt = (float) => {
  return Number((float * 100).toFixed(0));
};

const validateAndGetSourceRecord = async (sourceType, item_id, transferQty) => {
  try {
    // Make sure the item exists in the database.
    const model = typeToModel(sourceType);
    const sourceRecord = await model.findById(item_id);
    if (sourceRecord === null) {
      return {
        ok: 0,
        msg: `Failed. Can not find the item in the ${sourceType} collection. `,
      };
    }

    // Make sure the item has enough quantity to transfer.
    if (sourceRecord.qty - sourceRecord.qty_in_cart < transferQty) {
      return {
        ok: 0,
        msg: `Failed. The item has only ${sourceRecord.qty_available} quantity available.`,
      };
    }

    return { ok: 1, sourceRecord };
  } catch (error) {
    throw error;
  }
};

const test = async () => {
  //console.log(await calculatePostageInRMB("normal", 1.5, 2));
  // console.log(await calculateItemCostInRMB(1.1, 2));
  //console.log(await calculateCost(29.99, "babyFormula", 1.3, 3));
  // console.log(1.8*100*2*485/10000);
  // console.log(4.85*100);
  //console.log(Number(((20 * 100) / 3).toFixed(2)) * 100);
  //console.log(floatMultiply100ToInt(4.85));
  //  console.log(
  //   floatMultiply100ToInt(floatMultiply100ToInt(20) / 3)
  //  );
  // console.log(calculateProfits(260,60));
};

//test();

// const firstLetterToUpperCase = (word) => {
//   return word.charAt(0).toUpperCase() + word.slice(1);
// };

module.exports = {
  writeLog,
  generalHandle,
  trackParcel,
  updateNote,
  typeToModel,
  getOrderModels,
  generalHandleWithoutTransaction,
  validateAndGetSourceRecord,
  getSettingValues,
  calculateCost,
  calculateProfits,
  floatMultiply100ToInt,
};
