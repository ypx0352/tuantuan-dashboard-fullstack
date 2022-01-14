const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
} = require("../models/orderModels");

const allItems = async (req, res) => {
  try {
    var soldItems = await SoldItemsModel.find();

    var stockItems = await StockItemsModel.find();

    const employeeItems = await EmployeeItemsModel.find();

    var exceptionItems = [];

    const allItems = {
      soldItems,
      stockItems,
      employeeItems,
      exceptionItems,
    };
    res.status(200).json({ result: allItems });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Can not get the amount of items." });
  }
};

module.exports = allItems;
