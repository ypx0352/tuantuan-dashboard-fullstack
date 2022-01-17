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

const addToStock = async (req, res) => {
  const { addToStock, _id, type } = req.body;
  console.log(addToStock, _id, type);
  const types = ["sold", "employee"];
  const models = [SoldItemsModel, EmployeeItemsModel];
  const typeIndex = types.indexOf(type);
  console.log(models[typeIndex]);
  const result = await models[typeIndex].findById(_id);
  const newQty = result.qty - addToStock;
  if (newQty === 0) {
    const result = await models[typeIndex].findByIdAndDelete(_id);
    console.log(result);
  } else {
    const result = await models[typeIndex].findByIdAndUpdate(
      _id,
      {
        $set: { qty: newQty },
      },
      { new: true }
    );
    console.log(result);
  }
  // console.log(result);
};


module.exports = { allItems, addToStock };
