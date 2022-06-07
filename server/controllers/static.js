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
const TransactionModel = require("../models/transactionModel");

const writeLog = async (user, action, id, session) => {
  try {
    const result = await LogModel.insertMany(
      [
        {
          user: user,
          action: action,
          id: id,
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

const generalHandleWithoutTransaction = async (action, res, errorMsg) => {
  try {
    await action();
  } catch (error) {
    console.log(error);
    if (error.message === "jwt expired") {
      return res
        .status(401)
        .json({ msg: "Token expires. Please login again." });
    }
    res.status(500).json({ msg: errorMsg });
  }
};

const trackParcel = async (pk_id, returnContent) => {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append("source_sn[0]", pk_id);
    bodyFormData.append("token", process.env.POLAR_TRACK_PARCEL_TOKEN);
    const response = await axios({
      method: "post",
      url: process.env.PLOAR_TRACK_PARCEL_URL,
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
    transaction: TransactionModel,
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

const getSettingValuesOfOnePackage = async (pk_id) => {
  try {
    const result = await typeToModel("package").findOne({ pk_id, pk_id });
    return {
      exchangeRate: result.exchangeRate,
      normalPostage: result.normalPostage,
      babyFormulaPostage: result.babyFormulaPostage,
    };
  } catch (error) {
    throw error;
  }
};

const calculatePostageInRMB = async (type, weightEach, qty, settingValues) => {
  try {
    const { normalPostage, babyFormulaPostage, exchangeRate } = settingValues;
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

const calculateItemCostInRMB = async (pharmacyPriceEach, qty, exchangeRate) => {
  try {
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

const calculateCost = async (
  pharmacyPriceEach,
  type,
  weightEach,
  qty,
  settingValues
) => {
  try {
    const { exchangeRate } = settingValues;
    const postage = await calculatePostageInRMB(
      type,
      weightEach,
      qty,
      settingValues
    );

    const itemCost = await calculateItemCostInRMB(
      pharmacyPriceEach,
      qty,
      exchangeRate
    );
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

const addItemToCollection = async (
  collectionType,
  item,
  addQty,
  subtotal,
  session
) => {
  try {
    // Create a new record or update the record in the target collection depending on whether there is a same item saved in the target collection. Same items have the same pk_id, item, cost and price (and payAmountEach in exception collection).
    const model = typeToModel(collectionType);

    var payAmountEach;

    if (collectionType === "exception") {
      payAmountEach = Number(((subtotal * 100) / addQty / 100).toFixed(2));
    }

    const filter =
      collectionType === "exception"
        ? {
            pk_id: item.pk_id,
            item: item.item,
            cost: item.cost,
            price: item.price,
            payAmountEach: payAmountEach,
          }
        : {
            pk_id: item.pk_id,
            item: item.item,
            cost: item.cost,
            price: item.price,
          };

    const update =
      collectionType === "exception"
        ? {
            $set: {
              original_id: item._id,
              weight: item.weight,
              note: item.note,
              exchangeRate: item.exchangeRate,
              type: collectionType,
              originalType: item.type,
              payAmountEach: payAmountEach,
              price: item.price,
              subtotal: subtotal,
              approved: false,
              receiver: item.receiver,
              sendTimeISO: item.sendTimeISO,
              updatedAt: new Date(),
            },
            $inc: { qty: addQty, qty_in_cart: 0, payAmount: subtotal },
          }
        : {
            $set: {
              weight: item.weight,
              note: item.note,
              exchangeRate: item.exchangeRate,
              receiver: item.receiver,
              sendTimeISO: item.sendTimeISO,
              type: collectionType,
              updatedAt: new Date(),
            },
            $inc: { qty: addQty, qty_in_cart: 0 },
          };

    const result = await model.findOneAndUpdate(filter, update, {
      upsert: true,
      rawResult: true,
      timestamps: true,
      session: session,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const removeItemFromCollection = async (
  collectionType,
  originalRecord,
  removeQty,
  removeQtyInCart,
  session
) => {
  try {
    const model = typeToModel(collectionType);

    // If the new qty does not becomes 0, update the qty.
    if (originalRecord.qty - removeQty !== 0) {
      const result = await model.findByIdAndUpdate(
        originalRecord._id,
        {
          $inc: { qty: -removeQty, qty_in_cart: -removeQtyInCart },
        },
        { rawResult: true, session: session }
      );
      return result;
    }
    // If the qty in the original collection becomes 0 after updating, delete the record in the original collection.
    else {
      const result = await model.findByIdAndDelete(originalRecord._id, {
        rawResult: true,
        session: session,
      });
      return result;
    }
  } catch (error) {
    throw error;
  }
};

const login = async () => {
  try {
    console.log("Login...");
    var bodyFormData = new FormData();
    bodyFormData.append("username", process.env.EMAIL);
    bodyFormData.append("password", process.env.PASSWORD);

    const response = await axios({
      method: "post",
      url: process.env.POLAR_LOGIN_URL,
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
    });
    mtoken = response.data.data.mtoken;
    return mtoken;
  } catch (error) {
    throw error;
  }
};

const test = async () => {
  try {
    console.log(await getSettingValuesOfOnePackage("PE6598587AD"));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//test();

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
  getSettingValuesOfOnePackage,
  addItemToCollection,
  removeItemFromCollection,
  login,
};
