const connection = require("../database");
const mongoose = require("mongoose");

// Define the schema of the item in cart
// const itemSchema = new mongoose.Schema(
//   {
//     item: {
//       type: String,
//       required: true,
//     },
//     qty: {
//       type: Number,
//       required: true,
//     },
//     cost: {
//       type: Number,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     weight: {
//       type: Number,
//       required: true,
//     },
//     pk_id: {
//       type: String,
//       required: true,
//     },
//     note: {
//       type: String,
//       required: false,
//     },
//     exchangeRate: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       required: true,
//     },
//     createdAt: Date,
//     updatedAt: Date,
//   },
//   { timestamps: true }
// );

// Define the schema of the cart collection

const itemSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    solid_id: { type: String, required: true },
    cost: { type: Number, required: true },
    profits: { type: Number, required: true },
    addToCart: { type: Number, required: true },
    type: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    items: [itemSchema],
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

const CartModel = connection.model("cart", cartSchema);

module.exports = CartModel;
