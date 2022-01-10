const connection = require("../database");
const mongoose = require("mongoose");

// define the schema of the sold collection
const soldItemsSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    pk_id: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

// define the schema of the stock collection
const stockItemsSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    pk_id: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

// define the schema of the employee collection
const employeeItemsSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    pk_id: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

const SoldItemsModel = connection.model("sold_items", soldItemsSchema);
const StockItemsModel = connection.model("stock_items", stockItemsSchema);
const EmployeeItemsModel = connection.model(
  "employee_items",
  employeeItemsSchema
);

module.exports = { SoldItemsModel, StockItemsModel, EmployeeItemsModel };
