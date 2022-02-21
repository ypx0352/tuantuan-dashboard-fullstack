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
  const dateTime = new Date().toLocaleString();
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
      const {
        item,
        cost,
        price,
        weight,
        pk_id,
        note,
        exchangeRate,
        status,
        log,
      } = origianlSoldOrEmployeeResult;

      await StockItemsModel.create({
        item,
        qty: newQtyStock,
        cost,
        price,
        weight,
        pk_id,
        note,
        exchangeRate,
        type: "stock",
        status,
        log: log + `* [Transfer ${addToStock} item(s) to stock from ${type} at ${dateTime}] *`,
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

const addToEmployee = async (req, res) => {
  const { addToEmployee, _id, type } = req.body;
  const types = ["sold", "stock"];
  const models = [SoldItemsModel, StockItemsModel];
  const typeIndex = types.indexOf(type);
  const dateTime = new Date().toLocaleString();
  try {
    const originalRecord = await models[typeIndex].findById(_id);
    if (originalRecord === null) {
      return res.status(400).json({
        msg: "Failed to add to employee. Can not find the item in database.",
      });
    } else {
      // Add the item to employee collection. If the item is already saved in the collection (share the same pk_id and cost), add the qty of this item. Otherwise, create a new record of this item in employee collection.
      const {
        item,
        cost,
        price,
        weight,
        pk_id,
        note,
        exchangeRate,
        status,
        log,
      } = originalRecord;
      console.log(originalRecord);
      const employeeRecord = await EmployeeItemsModel.findOne({
        pk_id: originalRecord.pk_id,
        cost: originalRecord.cost,
        item: originalRecord.item,
      });
      if (employeeRecord === null) {
        await EmployeeItemsModel.create({
          item,
          qty: addToEmployee,
          cost,
          price,
          weight,
          pk_id,
          note,
          exchangeRate,
          type: "employee",
          status,
          log: log + `* [Transfer ${addToEmployee} item(s) to employee from ${type} at ${dateTime}] *`,
        });
      } else {
        await EmployeeItemsModel.findByIdAndUpdate(employeeRecord._id, {
          $set: {
            qty: employeeRecord.qty + addToEmployee,
            note: `${employeeRecord.note} * [add ${addToEmployee} to employee at ${dateTime}] *`,
          },
        });
      }

      // Deduct the number of this item in original collection, if the number becomes 0, delete the item from the original collection.
      if (originalRecord.qty - addToEmployee === 0) {
        await models[typeIndex].findByIdAndDelete(originalRecord._id);
      } else {
        await models[typeIndex].findByIdAndUpdate(originalRecord._id, {
          $set: { qty: originalRecord.qty - addToEmployee },
        });
      }

      return res.status(200).json({
        msg: `${addToEmployee} ${item} has been added to employee successfully.`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Failed to add to employee. Server error!" });
  }
};

module.exports = { allItems, addToStock, addToEmployee };
