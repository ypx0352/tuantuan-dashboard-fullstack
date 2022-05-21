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
// const {
//   getLatestPackagesAction,
// } = require("../../client/src/pages/dashboard-pages/package-page/store/actionCreators");

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
      msg: "Server error!",
    });
  }
  session.endSession();
};

const generalHandleWithoutTransaction = (action, res, errorMeg) => {
  try {
    action();
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

const calculatePostageInRMB = async (type, weight) => {
  try {
    const { normalPostage, babyFormulaPostage, exchangeRate } =
      await getSettingValues();

    if (type == "babyFormula") {
      // The return value is not rounded.
      return (((babyFormulaPostage * 100) / 3) * weight * exchangeRate) / 100;
    } else if (type == "normal") {
      // The return value is not rounded.
      return (normalPostage * 100 * weight * exchangeRate) / 100;
    }
  } catch (error) {
    throw error;
  }
};

const test = async () => {
  console.log(await calculateItemCostInRMB(3.3, 2));
};

const calculateItemCostInRMB = async (pharmacyPriceEach, qty) => {
  try {
    const { exchangeRate } = await getSettingValues();
    return (pharmacyPriceEach * 100 * qty * exchangeRate) / 100;
  } catch (error) {
    throw error;
  }
};

test();

//calculatePostageInRMB("normal",2.1)
//calculatePostageInRMB("formula", 1);

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
};
