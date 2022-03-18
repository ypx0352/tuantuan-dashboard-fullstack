const connection = require("../database");
const mongoose = require("mongoose");

// Define the schema of the cart collection
const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  solid_id: { type: String, required: true },
  cost: { type: Number, required: true },  
  addToCart: { type: Number, required: true },
  type: { type: String, required: true },
  payAmount: { type: Number, required: true },
});

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
