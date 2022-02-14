const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
} = require("../models/orderModels");

const CartModel = require("../models/cartModels");

const user_id = "tuantuan";

const addToCart = async (req, res) => {
  const { addToCart, _id, type} = req.body;

  const types = ["sold", "stock", "employee"];
  const models = [SoldItemsModel, StockItemsModel, EmployeeItemsModel];
  const typeIndex = types.indexOf(type);

  try {
    const originalItem = await models[typeIndex].findById(_id);
    if (originalItem === null) {
      res
        .status(400)
        .json({ msg: "Failed to add to cart. Item does not exist!" });
    } else {
      const { item, cost, type } = originalItem;
      solid_id = _id;
      const user_id = "tuantuan";
      var payAmount = 0;
      if (type !== "employee") {
        const { subtotal } = req.body;
        const profits = subtotal - cost * addToCart;
        const halfProfits = profits / 2;
        payAmount = cost * addToCart + halfProfits;
      } else {
        payAmount = cost * addToCart;
      }
      cartItem = { item, solid_id, cost, addToCart, type, payAmount };

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
    res.status(400).json({ msg: "Failed to load cart items. Server error!" });
  }
};

const removeCartItem = async (req, res) => {
  const { record_id } = req.body;
  try {
    await CartModel.findOneAndUpdate(
      { user_id: user_id },
      { $pull: { items: { _id: record_id } } }
    );
    return res
      .status(200)
      .json({ msg: " Item has been removed from cart successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Failed to remove it from cart. Server error!" });
  }
};

module.exports = { addToCart, getCartItems, removeCartItem };
