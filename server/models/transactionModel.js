const connection = require("../database");
const mongoose = require("mongoose");

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
    receiver: { type: String, required: true },
    pk_id: { type: String, required: true },
    note: { type: String },
    returnAllProfits: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    items: [itemSchema],
    approved: { type: Boolean, default: false },
    payAmountToSender: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { timestamps: true }
);

const TransactionModel = connection.model("transaction", transactionSchema);

module.exports = TransactionModel;
