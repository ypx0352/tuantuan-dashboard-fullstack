const connection = require("../database");

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
        receiver,
        sendTimeISO,
      } = originalSoldOrEmployeeResult;

      await StockItemsModel.create({
        item,
        qty: newQtyStock,
        qty_in_cart: 0,
        cost,
        price,
        weight,
        pk_id,
        note,
        exchangeRate,
        type: "stock",
        status,
        receiver,
        sendTimeISO,
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
        receiver,
        sendTimeISO,
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
          qty_in_cart: 0,
          cost,
          price,
          weight,
          pk_id,
          note,
          exchangeRate,
          type: "employee",
          status,
          receiver,
          sendTimeISO,
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

  // Make sure the item exists in the original collection.
  try {
    const session = await connection.startSession();
    await session.withTransaction(async () => {
      const originalRecord = await models[typeIndex].findById(_id);
      if (originalRecord === null) {
        return res.status(400).json({
          msg: "Failed to add to the exception collection. Can not find the item in database.",
        });
      }

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
        receiver,
        sendTimeISO,
      } = originalRecord;

      // Add the item to exception collection. If the same item (share the same pk_id, cost, payAmountEach (amount reimbursed)) exists in the exception collection, increase the qty, payAmount and subtotal of the item, resetting the approved status to false. Otherwise, create a new record of this item in exception collection.

      // Calculate the amount of payment
      const payAmount = Number(
        (cost * addToCart + (subtotal - cost * addToCart) / 2).toFixed(2)
      );

      const payAmountEach = Number((payAmount / addToCart).toFixed(2));

      const recordInException = await ExceptionItemModel.findOne({
        pk_id: pk_id,
        item: item,
        cost: cost,
        payAmountEach: payAmountEach,
      });
      if (recordInException !== null) {
        const newPayAmount = Number(
          (recordInException.payAmount + payAmount).toFixed(2)
        );
        await ExceptionItemModel.findByIdAndUpdate(recordInException._id, {
          $inc: { qty: addToCart, subtotal: subtotal },
          $set: {
            approved: false,
            payAmount: newPayAmount,
            log:
              recordInException.log +
              `*[${dateTime} Exception + ${addToCart} <= ${firstLetterToUpperCase(
                type
              )}; The item is reset to unapproved]* `,
          },
        });
      } else {
        await ExceptionItemModel.create({
          item,
          solid_id: _id,
          cost,
          qty: addToCart,
          qty_in_cart: 0,
          type: "exception",
          originalType: type,
          payAmount,
          payAmountEach,
          price,
          weight,
          pk_id,
          note,
          exchangeRate,
          status,
          receiver,
          sendTimeISO,
          log:
            log +
            `*[${dateTime} Exception + ${addToCart} <= ${firstLetterToUpperCase(
              type
            )}]* `,
          subtotal,
        });
      }

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
    });
    session.endSession();
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
    receiver,
    sendTimeISO,
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
        receiver,
        sendTimeISO,
        log:
          log +
          `*[${dateTime} ${firstLetterToUpperCase(
            originalType
          )} + ${addToRecover} <= Exception]* `,
      });
    }

    // Decrease the qty and the payAmount of the item in the exception collection, if the new qty does not become 0. Otherwise, deelete the record in the exception collection.
    const newQty = recordInException.qty - addToRecover;
    const newPayAmount = Number(
      (recordInException.payAmountEach * newQty).toFixed(2)
    );
    const newSubtotal = Number(
      ((recordInException.subtotal / recordInException.qty) * newQty).toFixed(2)
    );
    if (newQty > 0) {
      await ExceptionItemModel.findByIdAndUpdate(_id, {
        $set: {
          qty: newQty,
          payAmount: newPayAmount,
          subtotal: newSubtotal,
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
        log:
          recordInException.log + `*[${dateTime} Exception item is approved]* `,
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

const updateNote = async (req, res) => {
  const { newNote, type, _id } = req.body;
  const models = [
    SoldItemsModel,
    StockItemsModel,
    EmployeeItemsModel,
    ExceptionItemModel,
  ];
  const types = ["sold", "stock", "employee", "exception"];
  const typeIndex = types.indexOf(type);

  // Make sure the item exists in the database.
  try {
    const originalRecord = await models[typeIndex].findById(_id);
    if (originalRecord === null) {
      return res.status(400).json({
        msg: "Failed to update the note. Can not find the record in the database.",
      });
    }

    // Update the note.
    await models[typeIndex].findByIdAndUpdate(_id, { $set: { note: newNote } });
    res.status(200).json({ msg: "Note has been updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Failed to update the note. Server error." });
  }
};

// item: { type: String, required: true },
//     qty: { type: Number, required: true },
//     qty_in_cart: { type: Number, min: 0 },
//     qty_available: { type: Number },
//     cost: { type: Number, required: true }, // cost per unit
//     price: { type: Number, required: true }, // price per unit
//     weight: { type: Number, required: true }, // weight per unit
//     pk_id: { type: String, required: true },
//     note: { type: String, required: false },
//     exchangeRate: { type: Number, required: true },
//     type: { type: String, required: true },
//     origin_type: { type: String },
//     log: { type: String, required: true },
//     receiver: { type: String, required: true },
//     sendTimeISO: { type: Date, required: true },

const transferItem = async (req, res) => {
  const { original_id, sourceType, targetType, transferQty } = req.body;
  const dateTime = new Date().toLocaleString();
  const models = [
    SoldItemsModel,
    StockItemsModel,
    EmployeeItemsModel,
    ExceptionItemModel,
  ];
  const types = ["sold", "stock", "employee", "exception"];
  const sourceTypeIndex = types.indexOf(sourceType);
  const targetTypeIndex = types.indexOf(targetType);

  // Make sure the item exists in the original collection.
  const originalRecord = await models[sourceTypeIndex].findById(original_id);
  if (originalRecord === null) {
    return res.status(404).json({
      msg: "Failed to transfer the item. Can not find the item in the database.",
    });
  } else if (originalRecord.qty_available < transferQty) {
    return res.status(400).json({
      msg: "Failed to transfer the item. The qty is not enough.",
    });
  }

  // If there is not the same item in the target collection, create a new record in the target collection.

  // If there is the same item in the target collection, update the qty in the target collection.

  // If the qty in the original collection becomes 0, delete the record in the original collection.

  // If the qty in the original collection does not becomes 0, update the qty in the original collection.
};

module.exports = {
  allItems,
  addToStock,
  addToEmployee,
  addToException,
  recoverFromException,
  approveExceptionItem,
  updateNote,
};
