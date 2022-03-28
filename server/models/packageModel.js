const mongoose = require("mongoose");

const connect = require("../database");

const packageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    count: { type: Number, required: true },
    postage: { type: Number, required: true },
    exchangeRate: { type: Number, required: true },
    receiver: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

const PackageModel = connect.model("package", packageSchema);

module.exports = PackageModel;
