const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");
const {
  getOrderModels,
  typeToModel,
  generalHandle,
  validateAndGetSourceRecord,
  getSettingValues,
  generalHandleWithoutTransaction,
} = require("./static");
const CartModel = require("../models/cartModels");

const user_id = "tuantuan";

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

const calculatePayAmountToSender = (cost, profits) => {
  return (
    (floatMultiply100ToInt(cost) +
      floatMultiply100ToInt(floatMultiply100ToInt(profits) / 2) / 100) /
    100
  );
};

const floatMultiply100ToInt = (float) => {
  return Number((float * 100).toFixed(0));
};

const getPackageType = async (pk_id) => {
  try {
    const result = await typeToModel("package").findOne({ pk_id: pk_id });
    if (result === null) {
      throw new Error("Failed to get the package type.");
    } else {
      return result.type;
    }
  } catch (error) {
    throw error;
  }
};

const addToCart = (req, res) => {
  const user_id = "tuantuan";
  generalHandle(async (session) => {
    const { addToCart, _id, type } = req.body;
    // Make sure the item exists in database and has sufficient qty. Get the record in database.
    const sourceRecordResult = await validateAndGetSourceRecord(
      type,
      _id,
      addToCart
    );
    if (sourceRecordResult.ok !== 1) {
      throw new Error(sourceRecordResult.msg);
    }

    const { price, weight, pk_id, note, item, receiver } =
      sourceRecordResult.sourceRecord;

    // Get the package type.
    const packageType = await getPackageType(pk_id);

    // Calculate the cost.
    const cost = await calculateCost(price, packageType, weight, addToCart);

    //Calculate the profits and payAmountToSender, except for employee items.
    if (type !== "employee") {
      var { subtotal } = req.body;
      if (type === "exception") {
        subtotal = sourceRecordResult.sourceRecord.subtotal;
      }
      const profits = calculateProfits(subtotal, cost);
      const payAmountToSender = calculatePayAmountToSender(cost, profits);
      await typeToModel("cart").findOneAndUpdate(
        { user_id: user_id },
        {
          $push: {
            items: [
              {
                item,
                original_id: _id,
                cost,
                qty: addToCart,
                profits,
                payAmountFromCustomer: subtotal,
                payAmountToSender,
                originalType: type,
                receiver,
                pk_id,
                note,
              },
            ],
          },
        },
        { session: session }
      );
    } else {
      await typeToModel("cart").findOneAndUpdate(
        { user_id: user_id },
        {
          $push: {
            items: [
              {
                item,
                original_id: _id,
                cost,
                qty: addToCart,
                payAmountToSender: cost,
                originalType: type,
                receiver,
                pk_id,
                note,
              },
            ],
          },
        },
        { session: session }
      );
    }

    // Add the qty_in_cart of the item in the original collection
    await typeToModel(type).findByIdAndUpdate(_id, {
      $inc: { qty_in_cart: addToCart },
    });
    return `${addToCart} ${item} has been added to the cart successfully.`;
  }, res);
};

const setReturnAllProfitsItem = (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      //const {_id} = req.body
      const _id = "628ba8a18b4537666ff79a00";
      const result = await typeToModel("cart").findOne({
        user_id: user_id,
      });
      const targetItem = result.items.filter((item) => item._id == _id)[0];
      if (targetItem === undefined) {
        throw new Error("Failed to find the item in database.");
      }

      if (["employee", "exception"].includes(targetItem.originalType)) {
        throw new Error(
          "Can not set return all profits to employee or exception item."
        );
      }
      const payAmountFromCustomer = targetItem.payAmountFromCustomer;

      await typeToModel("cart").findOneAndUpdate(
        {
          user_id: user_id,
          "items._id": _id,
        },
        {
          $set: {
            "items.$.returnAllProfits": true,
            "items.$.payAmountToSender": payAmountFromCustomer,
          },
        }
      );
    },
    res,
    "Failed to set this item to return all profits item."
  );
};

setReturnAllProfitsItem();
const test = async () => {
  console.log(getPayAmountToSender(199, -100));
};

const getCartItems = async (req, res) => {
  try {
    const result = await CartModel.findOne({ user_id: user_id });
    if (result === null) {
      return res.status(200).json({ result: [] });
    } else {
      return res.status(200).json({ result: result.items });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to load cart items. Server error!" });
  }
};

const removeCartItem = async (req, res) => {
  const { record_id, solid_id, type, addToCart } = req.body;
  const types = ["sold", "stock", "employee", "exception"];
  const models = [
    SoldItemsModel,
    StockItemsModel,
    EmployeeItemsModel,
    ExceptionItemModel,
  ];
  const typeIndex = types.indexOf(type);

  generalResponse(
    async () => {
      // Make sure the item exists in the original collection.
      const result = await models[typeIndex].findById(solid_id);
      if (result === null) {
        return res.status(404).json({ msg: "The item does not exist." });
      }

      // Update the item's qty_in_cart
      await models[typeIndex].findByIdAndUpdate(solid_id, {
        $inc: { qty_in_cart: -addToCart },
      });

      await CartModel.findOneAndUpdate(
        { user_id: user_id },
        { $pull: { items: { _id: record_id } } }
      );

      return res
        .status(200)
        .json({ msg: " Item has been removed from cart successfully" });
    },
    res,
    "Failed to remove item from cart. Server error!",
    500
  );
};

const generalResponse = (action, res, msg, status) => {
  try {
    action();
  } catch (error) {
    console.log(error);
    res.status(status).json({ msg: msg });
  }
};

module.exports = { addToCart, getCartItems, removeCartItem };
