const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
} = require("../models/orderModels");

const allItems = async (req, res) => {
  try {
    const soldItems = await SoldItemsModel.find();

    const stockItems = await StockItemsModel.find();

    const employeeItems = await EmployeeItemsModel.find();

    const exceptionItems = [];

    const allItems = {
      soldItems,
      stockItems,
      employeeItems,
      exceptionItems,
    };
    res.status(200).json({ result: allItems });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Can not get all items." });
  }
};

const addToStock = async (req, res) => {
  const { addToStock, _id, type } = req.body;
  const types = ["sold", "employee"];
  const models = [SoldItemsModel, EmployeeItemsModel];
  const typeIndex = types.indexOf(type);
  try {
    // Deduct the qty of the item saved in sold or employee collection
    const origianlSoldOrEmployeeResult = await models[typeIndex].findById(_id);
    const newQtySoldOrEmployee = origianlSoldOrEmployeeResult.qty - addToStock;
    if (newQtySoldOrEmployee === 0) {
      await models[typeIndex].findByIdAndDelete(_id);
    } else {
      await models[typeIndex].findByIdAndUpdate(_id, {
        $set: { qty: newQtySoldOrEmployee },
      });
    }

    const { item, cost, pk_id } = origianlSoldOrEmployeeResult;
    const originalStockResult = await StockItemsModel.findOne({
      item,
      cost,
      pk_id,
    });

    // If the item is not saved in stock, create a new record in stock collection
    if (originalStockResult === null) {
      const newQtyStock = addToStock;
      const { item, cost, price, weight, pk_id, note, exchangeRate, status } =
        origianlSoldOrEmployeeResult;

      await StockItemsModel.create({
        item: item,
        qty: newQtyStock,
        cost: cost,
        price: price,
        weight: weight,
        pk_id: pk_id,
        note: note,
        exchangeRate: exchangeRate,
        type: "stock",
        status: status,
      });
      return res.status(200).json({
        msg: `${newQtyStock} ${item} has been added to stock successfully.`,
      });
    } else {
      // If the item was already saved in stock, add the qty of the item
      const newQtyStock = originalStockResult.qty + addToStock;
      const item = originalStockResult.item;
      await StockItemsModel.findByIdAndUpdate(originalStockResult._id, {
        $set: { qty: newQtyStock },
      });
      return res.status(200).json({
        msg: `${addToStock} ${item} has been added to stock successfully.`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Failed to add to stock. Server error!" });
  }
};

module.exports = { allItems, addToStock };
