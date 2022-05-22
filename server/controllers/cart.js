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
      return { success: false, msg: "Failed to get the package type." };
    } else {
      return { success: true, packageType: result.type };
    }
  } catch (error) {
    throw error;
  }
};

const addToCart = (req, res) => {
  const user_id = "Pengxiang Yue";
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
    const packageTypeResult = await getPackageType(pk_id);
    if (!packageTypeResult.success) {
      throw new Error(packageTypeResult.msg);
    }

    // Calculate the cost.
    const cost = await calculateCost(
      price,
      packageTypeResult.packageType,
      weight,
      addToCart
    );

    //Calculate the profits and payAmountToSender, except for employee items.
    if (type !== "employee") {
      const { subtotal } = req.body;
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
                note,
              },
            ],
          },
        },
        { session: session, upsert: true }
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
                note,
              },
            ],
          },
        },
        { session: session, upsert: true }
      );
    }

    // Add the qty_in_cart of the item in the original collection
    await typeToModel(type).findByIdAndUpdate(_id, {
      $inc: { qty_in_cart: addToCart },
    });

    return `${addToCart} ${item} has been added to the cart successfully.`;
  }, res);
};

const test = async () => {
  console.log(getPayAmountToSender(199, -100));
};
//test();

// const addToCart = async (req, res) => {
//   const { addToCart, _id, type } = req.body;
//   const types = ["sold", "stock", "employee", "exception"];
//   const models = [
//     SoldItemsModel,
//     StockItemsModel,
//     EmployeeItemsModel,
//     ExceptionItemModel,
//   ];
//   const typeIndex = types.indexOf(type);

//   try {
//     // Make sure the item exists in the original collection.
//     const originalItem = await models[typeIndex].findById(_id);
//     if (originalItem === null) {
//       return res
//         .status(400)
//         .json({ msg: "Failed to add to cart. Item does not exist!" });
//     } else {
//       // Add the qty_in_cart of the item in the original collection
//       await models[typeIndex].findByIdAndUpdate(_id, {
//         $inc: { qty_in_cart: addToCart },
//       });

//       const { item, cost, type, receiver, pk_id } = originalItem;

//       original_id = _id;
//       const user_id = "tuantuan";
//       var payAmount = 0;
//       if (type !== "employee") {
//         const { subtotal } = req.body;
//         if (type === "exception") {
//           payAmount = Number((req.body.payAmountEach * addToCart).toFixed(2));
//         } else {
//           const profits = subtotal - cost * addToCart;
//           const halfProfits = profits / 2;
//           payAmount = Number((cost * addToCart + halfProfits).toFixed(2));
//         }
//       } else {
//         payAmount = Number((cost * addToCart).toFixed(2));
//       }
//       cartItem = {
//         item,
//         original_id,
//         cost,
//         qty: addToCart,
//         originalType: type,
//         payAmount,
//         receiver,
//         pk_id,
//       };

//       const result = await CartModel.findOne({ user_id: user_id });
//       if (result === null) {
//         await CartModel.create({
//           user_id: user_id,
//           items: [cartItem],
//         });
//         return res.status(200).json({
//           msg: `${addToCart} ${item} has been added to cart successfully.`,
//         });
//       } else {
//         await CartModel.findOneAndUpdate(
//           { user_id: user_id },
//           { $push: { items: [cartItem] } }
//         );
//         return res.status(200).json({
//           msg: `${addToCart} ${item} has been added to cart successfully.`,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ msg: "Failed to add to cart. Server error!" });
//   }
// };

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
