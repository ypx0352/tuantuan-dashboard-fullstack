const connection = require("../database");
const mongoose = require("mongoose");

// Define the schema of the cart collection
const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  original_id: { type: String, required: true },
  cost: { type: Number, required: true },
  qty: { type: Number, required: true },
  // type: { type: String, required: true },
  originalType: { type: String, required: true },
  payAmount: { type: Number, required: true },
  //payAmountEach: { type: Number, required: true },
  receiver: { type: String, required: true },
  pk_id: { type: String, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    items: [itemSchema],
  },
  { timestamps: true }
);

const CartModel = connection.model("cart", cartSchema);

module.exports = CartModel;
