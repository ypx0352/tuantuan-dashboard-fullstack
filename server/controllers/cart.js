const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const CartModel = require("../models/cartModels");

const user_id = "tuantuan";

const addToCart = async (req, res) => {
  const { addToCart, _id, type } = req.body;
  const types = ["sold", "stock", "employee", "exception"];
  const models = [
    SoldItemsModel,
    StockItemsModel,
    EmployeeItemsModel,
    ExceptionItemModel,
  ];
  const typeIndex = types.indexOf(type);

  try {
    // Make sure the item exists in the original collection.
    const originalItem = await models[typeIndex].findById(_id);
    if (originalItem === null) {
      return res
        .status(400)
        .json({ msg: "Failed to add to cart. Item does not exist!" });
    } else {
      // Add the qty_in_cart of the item in the original collection
      await models[typeIndex].findByIdAndUpdate(_id, {
        $inc: { qty_in_cart: addToCart },
      });

      const { item, cost, type, receiver, pk_id } = originalItem;

      original_id = _id;
      const user_id = "tuantuan";
      var payAmount = 0;
      if (type !== "employee") {
        const { subtotal } = req.body;
        if (type === "exception") {
          payAmount = Number((req.body.payAmountEach * addToCart).toFixed(2));
        } else {
          const profits = subtotal - cost * addToCart;
          const halfProfits = profits / 2;
          payAmount = Number((cost * addToCart + halfProfits).toFixed(2));
        }
      } else {
        payAmount = Number((cost * addToCart).toFixed(2));
      }
      cartItem = {
        item,
        original_id,
        cost,
        qty: addToCart,
        originalType: type,
        payAmount,
        receiver,
        pk_id,
      };

      const result = await CartModel.findOne({ user_id: user_id });
      if (result === null) {
        await CartModel.create({
          user_id: user_id,
          items: [cartItem],
        });
        return res.status(200).json({
          msg: `${addToCart} ${item} has been added to cart successfully.`,
        });
      } else {
        await CartModel.findOneAndUpdate(
          { user_id: user_id },
          { $push: { items: [cartItem] } }
        );
        return res.status(200).json({
          msg: `${addToCart} ${item} has been added to cart successfully.`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Failed to add to cart. Server error!" });
  }
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
