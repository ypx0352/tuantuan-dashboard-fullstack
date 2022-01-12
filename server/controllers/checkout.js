const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
} = require("../models/orderModels");

const count = async (req, res) => {
  try {
    var sold = 0;
    const soldItems = await SoldItemsModel.find();
    soldItems.forEach((item) => {
      sold += item["qty"];
    });

    var stock = 0;
    const stockItems = await StockItemsModel.find();
    stockItems.forEach((item) => {
      stock += item["qty"];
    });

    var employee = 0;
    const employeeItems = await EmployeeItemsModel.find();
    employeeItems.forEach((item) => {
      employee += item["qty"];
    });

    var exception = 0;

    const countResult = { sold, stock, employee, exception };
    res.status(200).json({ result: countResult });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Can not get the amount of items." });
  }
};

module.exports = count;
