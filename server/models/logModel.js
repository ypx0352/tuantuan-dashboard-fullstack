const mongoose = require("mongoose");
const connection = require("../database");

const logSchema = new mongoose.Schema(
  {
    msg: { type: String, required: true },
    user: { type: String, required: true },
    package: { type: String, required: true },
  },
  { timestamps: true }
);

const LogModel = connection.model("log", logSchema);

module.exports = LogModel;
