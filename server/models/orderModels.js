const connection = require("../database");
const mongoose = require("mongoose");

// define the schema of the sold collection
// const soldItemsSchema = new mongoose.Schema(
//   {
//     item: { type: String, required: true },
//     qty: { type: Number, required: true },
//     qty_in_cart: { type: Number, min: 0 },
//     cost: { type: Number, required: true },
//     price: { type: Number, required: true },
//     weight: { type: Number, required: true },
//     pk_id: { type: String, required: true },
//     note: { type: String, required: false },
//     exchangeRate: { type: Number, required: true },
//     status: { type: String, required: true },
//     type: { type: String, required: true },
//     log: { type: String, required: true },
//     receiver: { type: String, required: true },
//     sendTimeISO: { type: Date, required: true },
//   },
//   { timestamps: true }
// );

const normalItemSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    qty: { type: Number, required: true },
    qty_in_cart: { type: Number, min: 0 },
    qty_available: { type: Number },
    cost: { type: Number, required: true }, // cost per unit
    price: { type: Number, required: true }, // price per unit
    weight: { type: Number, required: true }, // weight per unit
    pk_id: { type: String, required: true },
    note: { type: String, required: false },
    exchangeRate: { type: Number, required: true },
    type: { type: String, required: true },
    origin_type: { type: String },
    receiver: { type: String, required: true },
    sendTimeISO: { type: Date, required: true },    
    updatedAt: { type: Date, required: true },
  },
  { timeseries: true }
);

// define the schema of the stock collection
// const stockItemsSchema = new mongoose.Schema(
//   {
//     item: { type: String, required: true },
//     qty: { type: Number, required: true },
//     qty_in_cart: { type: Number, min: 0 },
//     cost: { type: Number, required: true },
//     price: { type: Number, required: true },
//     weight: { type: Number, required: true },
//     pk_id: { type: String, required: true },
//     note: { type: String, required: false },
//     exchangeRate: { type: Number, required: true },
//     status: { type: String, required: true },
//     type: { type: String, required: true },
//     log: { type: String, required: true },
//     receiver: { type: String, required: true },
//     sendTimeISO: { type: Date, required: true },
//   },
//   { timestamps: true }
// );

// define the schema of the employee collection
// const employeeItemsSchema = new mongoose.Schema(
//   {
//     item: { type: String, required: true },
//     qty: { type: Number, required: true },
//     qty_in_cart: { type: Number, min: 0 },
//     cost: { type: Number, required: true },
//     price: { type: Number, required: true },
//     weight: { type: Number, required: true },
//     pk_id: { type: String, required: true },
//     note: { type: String, required: false },
//     exchangeRate: { type: Number, required: true },
//     status: { type: String, required: true },
//     type: { type: String, required: true },
//     log: { type: String, required: true },
//     receiver: { type: String, required: true },
//     sendTimeISO: { type: Date, required: true },
//   },
//   { timestamps: true }
// );

const exceptionItemsSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    solid_id: { type: String, required: true },
    cost: { type: Number, required: true },
    qty: { type: Number, required: true },
    type: { type: String, required: true },
    originalType: { type: String, required: true },
    payAmount: { type: Number, required: true },
    payAmountEach: { type: Number, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    pk_id: { type: String, required: true },
    note: { type: String, required: false },
    exchangeRate: { type: Number, required: true },
    status: { type: String},
    subtotal: { type: Number, required: true },
    qty_in_cart: { type: Number, min: 0 },
    approved: { type: Boolean, default: false, required: true },
    receiver: { type: String, required: true },
    sendTimeISO: { type: Date, required: true },
  },
  { timestamps: true }
);

const SoldItemsModel = connection.model("sold_items", normalItemSchema);

const StockItemsModel = connection.model("stock_items", normalItemSchema);

const EmployeeItemsModel = connection.model("employee_items", normalItemSchema);

const ExceptionItemModel = connection.model(
  "exception_items",
  exceptionItemsSchema
);

module.exports = {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
};
