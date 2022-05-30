const connection = require("../database");
const mongoose = require("mongoose");

// Define the schema of the cart collection
const itemSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    original_id: { type: String, required: true },
    cost: { type: Number, required: true }, //total cost
    qty: { type: Number, required: true },
    profits: { type: Number }, //total profits
    payAmountFromCustomer: { type: Number }, // total money received from customers
    payAmountToSender: { type: Number, required: true }, //total money pay back to the sender
    originalType: { type: String, required: true },
    //payAmount: { type: Number, required: true },
    //payAmountEach: { type: Number, required: true },
    receiver: { type: String, required: true },
    pk_id: { type: String, required: true },
    note: { type: String, required: true },
    returnAllProfits: { type: Boolean, required: true, default: false },
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
    // payAmountToSender: { type: Number, required: true, min: 0 },
    // qty: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const CartModel = connection.model("cart", cartSchema);

module.exports = CartModel;
