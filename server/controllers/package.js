const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const getSearchedPackage = async (req, res) => {
  const { pk_id } = req.query;
  try {
    const recordInSold = await SoldItemsModel.find({ pk_id: pk_id });
    const recordInStock = await StockItemsModel.find({ pk_id: pk_id });
    const recordInEmployee = await EmployeeItemsModel.find({ pk_id: pk_id });
    const recordInException = await ExceptionItemModel.find({
      pk_id: pk_id,
    });
    const result = recordInSold.concat(
      recordInStock,
      recordInEmployee,
      recordInException
    );
    console.log(result);
    res.status(200).json({result})
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to fetch this package. Server error." });
  }
  const recordInSold = await SoldItemsModel.find({ pk_id: pk_id });
  const recordInStock = await StockItemsModel.find({ pk_id: pk_id });
  const recordInEmployee = await EmployeeItemsModel.find({ pk_id: pk_id });
  const recordInException = await ExceptionItemModel.find({ pk_id: pk_id });
};

module.exports = { getSearchedPackage };
