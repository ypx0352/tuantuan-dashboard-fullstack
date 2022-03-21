const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const allItems = async (req, res) => {
  try {
    const soldItems = await SoldItemsModel.find();

    const stockItems = await StockItemsModel.find();

    const employeeItems = await EmployeeItemsModel.find();

    const exceptionItems = await ExceptionItemModel.find();

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

  const firstLetterToUpperCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  try {
    // Deduct the qty of the item saved in sold or employee collection
    const originalSoldOrEmployeeResult = await models[typeIndex].findById(_id);
    const newQtySoldOrEmployee = originalSoldOrEmployeeResult.qty - addToStock;
    if (newQtySoldOrEmployee === 0) {
      await models[typeIndex].findByIdAndDelete(_id);
    } else {
      await models[typeIndex].findByIdAndUpdate(_id, {
        $set: {
          qty: newQtySoldOrEmployee,
          log:
            originalSoldOrEmployeeResult.log +
            `*[${dateTime}  ${firstLetterToUpperCase(
              originalSoldOrEmployeeResult.type
            )} - ${addToStock} => Stock]* `,
        },
      });
    }

    const { item, cost, pk_id } = originalSoldOrEmployeeResult;
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
      } = originalSoldOrEmployeeResult;

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
        log:
          log +
          `*[${dateTime} Stock + ${addToStock} <= ${firstLetterToUpperCase(
            type
          )}]* `,
      });
      return res.status(200).json({
        msg: `${newQtyStock} ${item} has been added to the stock collection successfully.`,
      });
    } else {
      // If the item was already saved in stock, add the qty of the item
      const newQtyStock = originalStockResult.qty + addToStock;
      const item = originalStockResult.item;

      await StockItemsModel.findByIdAndUpdate(originalStockResult._id, {
        $set: {
          qty: newQtyStock,
          log:
            originalStockResult.log +
            `*[${dateTime} Stock + ${addToStock} <= ${firstLetterToUpperCase(
              originalSoldOrEmployeeResult.type
            )}]* `,
        },
      });
      return res.status(200).json({
        msg: `${addToStock} ${item} has been added to the stock collection successfully.`,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Failed to add to the stock collection. Server error!" });
  }
};

const addToEmployee = async (req, res) => {
  const { addToEmployee, _id, type } = req.body;
  const types = ["sold", "stock"];
  const models = [SoldItemsModel, StockItemsModel];
  const typeIndex = types.indexOf(type);
  const dateTime = new Date().toLocaleString();
  const firstLetterToUpperCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  try {
    const originalRecord = await models[typeIndex].findById(_id);
    if (originalRecord === null) {
      return res.status(400).json({
        msg: "Failed to add to the employee collection. Can not find the item in database.",
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
          log:
            log +
            `*[${dateTime} Employee + ${addToEmployee} <= ${firstLetterToUpperCase(
              type
            )}]* `,
        });
      } else {
        await EmployeeItemsModel.findByIdAndUpdate(employeeRecord._id, {
          $set: {
            qty: employeeRecord.qty + addToEmployee,
            log:
              employeeRecord.log +
              `*[${dateTime} Employee + ${addToEmployee} <= ${firstLetterToUpperCase(
                type
              )}]* `,
          },
        });
      }

      // Deduct the number of this item in original collection, if the number becomes 0, delete the item from the original collection.
      if (originalRecord.qty - addToEmployee === 0) {
        await models[typeIndex].findByIdAndDelete(originalRecord._id);
      } else {
        await models[typeIndex].findByIdAndUpdate(originalRecord._id, {
          $set: {
            qty: originalRecord.qty - addToEmployee,
            log:
              originalRecord.log +
              `*[${dateTime} ${firstLetterToUpperCase(
                type
              )} - ${addToEmployee} => Employee]* `,
          },
        });
      }

      return res.status(200).json({
        msg: `${addToEmployee} ${item} has been added to the employee collection successfully.`,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Failed to add to the employee collection. Server error!" });
  }
};

const addToException = async (req, res) => {
  const { _id, type, addToCart, subtotal } = req.body;
  const types = ["sold", "stock"];
  const models = [SoldItemsModel, StockItemsModel];
  const typeIndex = types.indexOf(type);

  const dateTime = new Date().toLocaleString();
  const firstLetterToUpperCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Make sure the item exists
  try {
    const originalRecord = await models[typeIndex].findById(_id);
    if (originalRecord === null) {
      return res.status(400).json({
        msg: "Failed to add to the exception collection. Can not find the item in database.",
      });
    }

    // Add the item to exception collection. Create a new record of this item in exception collection.
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

    // Calculate the amount of payment
    const payAmount = Number(
      (cost * addToCart + (subtotal - cost * addToCart) / 2).toFixed(2)
    );

    await ExceptionItemModel.create({
      item,
      solid_id: _id,
      cost,
      qty: addToCart,
      type: "exception",
      originalType: type,
      payAmount,
      price,
      weight,
      pk_id,
      note,
      exchangeRate,
      status,
      log:
        log +
        `*[${dateTime} Exception + ${addToCart} <= ${firstLetterToUpperCase(
          type
        )}]* `,
      subtotal,
    });

    // Deduct the number of this item in original collection. If the number becomes 0, delete the item from the original collection.
    const newQty = originalRecord.qty - addToCart;
    if (newQty > 0) {
      await models[typeIndex].findByIdAndUpdate(_id, {
        $set: {
          qty: newQty,
          log:
            originalRecord.log +
            `*[${dateTime} ${firstLetterToUpperCase(
              type
            )} - ${addToCart} => Exception]* `,
        },
      });
    } else {
      await models[typeIndex].findByIdAndRemove(_id);
    }

    res.status(200).json({
      msg: `${addToCart} ${item} has been added to the exception collection successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Failed to add to the exception collection. Server error!",
    });
  }
};

const recoverFromException = async (req, res) => {
  const {
    originalType,
    _id,
    addToRecover,
    item,
    cost,
    price,
    weight,
    pk_id,
    note,
    exchangeRate,
    status,
    log,
  } = req.body;

  const types = ["sold", "stock"];
  const models = [SoldItemsModel, StockItemsModel];
  const typeIndex = types.indexOf(originalType);
  const dateTime = new Date().toLocaleString();
  const firstLetterToUpperCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  try {
    // Make sure the item exists in the exception collection
    const recordInException = await ExceptionItemModel.findById(_id);
    if (recordInException === null) {
      return res.status(400).json({
        msg: "Failed to remove the item from the exception collection. Can not find the item in database.",
      });
    }

    // Increase the qty of the item in original collection, if the item exists in original collection (share the same pk_id, item and cost). Otherwise, create a new record of the item in original collection.
    const originalRecord = await models[typeIndex].findOne({
      pk_id: pk_id,
      item: item,
      cost: cost,
    });
    if (originalRecord !== null) {
      await models[typeIndex].findOneAndUpdate(
        { pk_id: pk_id, item: item, cost: cost },
        {
          $inc: { qty: addToRecover },
          $set: {
            log:
              originalRecord.log +
              `*[${dateTime} ${firstLetterToUpperCase(
                originalRecord.type
              )} + ${addToRecover} <= Exception]* `,
          },
        }
      );
    } else {
      await models[typeIndex].create({
        item,
        qty: addToRecover,
        cost,
        price,
        weight,
        pk_id,
        note,
        exchangeRate,
        status,
        type: originalType,
        log:
          log +
          `*[${dateTime} ${firstLetterToUpperCase(
            originalType
          )} + ${addToRecover} <= Exception]* `,
      });
    }

    // Decrease the qty of the item in the exception collection, if the new qty does not become 0. Otherwise, deelete the record in the exception collection.
    const newQty = recordInException.qty - addToRecover;
    if (newQty > 0) {
      await ExceptionItemModel.findByIdAndUpdate(_id, {
        $set: {
          qty: newQty,
          log:
            recordInException.log +
            `*[${dateTime} Exception - ${addToRecover} => ${firstLetterToUpperCase(
              originalType
            )}]* `,
        },
      });
    } else {
      await ExceptionItemModel.findByIdAndRemove(_id);
    }

    res.status(200).json({
      msg: `${addToRecover} ${item} has been added to the ${originalType} collection successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Failed to recovery from the exception collection. Server error!",
    });
  }
};

const approveExceptionItem = async (req, res) => {
  const { _id } = req.body;
  const dateTime = new Date().toLocaleString();
  try {
    // Make sure the item exists in the exception collection.
    const recordInException = await ExceptionItemModel.findById(_id);
    if (recordInException === null) {
      return res.status(400).json({
        msg: "Failed to approve the item. Can not find the item in database",
      });
    }
    await ExceptionItemModel.findByIdAndUpdate(_id, {
      $set: {
        approved: true,
        log: recordInException.log + `*[${dateTime} Exception item approved]* `,
      },
    });
    res.status(200).json({ msg: "The item has been approved successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Failed to approve the exception item. Server error!",
    });
  }
};

module.exports = {
  allItems,
  addToStock,
  addToEmployee,
  addToException,
  recoverFromException,
  approveExceptionItem,
};
