const axios = require("axios")

const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const PackageModel = require("../models/packageModel");

const parseTrackHtml = async (pk_id) => {
  const url = `https://www.polarexpress.com.au/wechat/track/?s=${pk_id}`;

  const response = await axios.get(url);
  console.log(response);
};

parseTrackHtml("PE6420948BB");

const getSearchedPackage = async (req, res) => {
  const { pk_id } = req.query;
  try {
    const recordInSold = await SoldItemsModel.find({ pk_id: pk_id });
    const recordInStock = await StockItemsModel.find({ pk_id: pk_id });
    const recordInEmployee = await EmployeeItemsModel.find({ pk_id: pk_id });
    const recordInException = await ExceptionItemModel.find({
      pk_id: pk_id,
    });
    const itemRecords = recordInSold.concat(
      recordInStock,
      recordInEmployee,
      recordInException
    );

    const packageRecord = await PackageModel.findOne({ id: pk_id });

    res.status(200).json({ itemRecords, packageRecord });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to fetch this package. Server error." });
  }
};

module.exports = { getSearchedPackage };
