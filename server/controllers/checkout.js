const connection = require("../database");

const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const LogModel = require("../models/logModel");

const firstLetterToUpperCase = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

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

// const addToStock = async (req, res) => {
//   const { addToStock, _id, type } = req.body;
//   const types = ["sold", "employee"];
//   const models = [SoldItemsModel, EmployeeItemsModel];
//   const typeIndex = types.indexOf(type);
//   const dateTime = new Date().toLocaleString();

//   const firstLetterToUpperCase = (word) => {
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   };

//   try {
//     // Deduct the qty of the item saved in sold or employee collection
//     const originalSoldOrEmployeeResult = await models[typeIndex].findById(_id);
//     const newQtySoldOrEmployee = originalSoldOrEmployeeResult.qty - addToStock;
//     if (newQtySoldOrEmployee === 0) {
//       await models[typeIndex].findByIdAndDelete(_id);
//     } else {
//       await models[typeIndex].findByIdAndUpdate(_id, {
//         $set: {
//           qty: newQtySoldOrEmployee,
//           log:
//             originalSoldOrEmployeeResult.log +
//             `*[${dateTime}  ${firstLetterToUpperCase(
//               originalSoldOrEmployeeResult.type
//             )} - ${addToStock} => Stock]* `,
//         },
//       });
//     }

//     const { item, cost, pk_id } = originalSoldOrEmployeeResult;
//     const originalStockResult = await StockItemsModel.findOne({
//       item,
//       cost,
//       pk_id,
//     });

//     // If the item is not saved in stock, create a new record in stock collection
//     if (originalStockResult === null) {
//       const newQtyStock = addToStock;
//       const {
//         item,
//         cost,
//         price,
//         weight,
//         pk_id,
//         note,
//         exchangeRate,
//         status,
//         log,
//         receiver,
//         sendTimeISO,
//       } = originalSoldOrEmployeeResult;

//       await StockItemsModel.create({
//         item,
//         qty: newQtyStock,
//         qty_in_cart: 0,
//         cost,
//         price,
//         weight,
//         pk_id,
//         note,
//         exchangeRate,
//         type: "stock",
//         status,
//         receiver,
//         sendTimeISO,
//         log:
//           log +
//           `*[${dateTime} Stock + ${addToStock} <= ${firstLetterToUpperCase(
//             type
//           )}]* `,
//       });

//       return res.status(200).json({
//         msg: `${newQtyStock} ${item} has been added to the stock collection successfully.`,
//       });
//     } else {
//       // If the item was already saved in stock, add the qty of the item
//       const newQtyStock = originalStockResult.qty + addToStock;
//       const item = originalStockResult.item;

//       await StockItemsModel.findByIdAndUpdate(originalStockResult._id, {
//         $set: {
//           qty: newQtyStock,
//           log:
//             originalStockResult.log +
//             `*[${dateTime} Stock + ${addToStock} <= ${firstLetterToUpperCase(
//               originalSoldOrEmployeeResult.type
//             )}]* `,
//         },
//       });

//       return res.status(200).json({
//         msg: `${addToStock} ${item} has been added to the stock collection successfully.`,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ msg: "Failed to add to the stock collection. Server error!" });
//   }
// };

// const addToEmployee = async (req, res) => {
//   const { addToEmployee, _id, type } = req.body;
//   const types = ["sold", "stock"];
//   const models = [SoldItemsModel, StockItemsModel];
//   const typeIndex = types.indexOf(type);
//   const dateTime = new Date().toLocaleString();
//   const firstLetterToUpperCase = (word) => {
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   };

//   try {
//     const originalRecord = await models[typeIndex].findById(_id);
//     if (originalRecord === null) {
//       return res.status(400).json({
//         msg: "Failed to add to the employee collection. Can not find the item in database.",
//       });
//     } else {
//       // Add the item to employee collection. If the item is already saved in the collection (share the same pk_id and cost), add the qty of this item. Otherwise, create a new record of this item in employee collection.
//       const {
//         item,
//         cost,
//         price,
//         weight,
//         pk_id,
//         note,
//         exchangeRate,
//         status,
//         log,
//         receiver,
//         sendTimeISO,
//       } = originalRecord;

//       const employeeRecord = await EmployeeItemsModel.findOne({
//         pk_id: originalRecord.pk_id,
//         cost: originalRecord.cost,
//         item: originalRecord.item,
//       });

//       if (employeeRecord === null) {
//         await EmployeeItemsModel.create({
//           item,
//           qty: addToEmployee,
//           qty_in_cart: 0,
//           cost,
//           price,
//           weight,
//           pk_id,
//           note,
//           exchangeRate,
//           type: "employee",
//           status,
//           receiver,
//           sendTimeISO,
//           log:
//             log +
//             `*[${dateTime} Employee + ${addToEmployee} <= ${firstLetterToUpperCase(
//               type
//             )}]* `,
//         });
//       } else {
//         await EmployeeItemsModel.findByIdAndUpdate(employeeRecord._id, {
//           $set: {
//             qty: employeeRecord.qty + addToEmployee,
//             log:
//               employeeRecord.log +
//               `*[${dateTime} Employee + ${addToEmployee} <= ${firstLetterToUpperCase(
//                 type
//               )}]* `,
//           },
//         });
//       }

//       // Deduct the number of this item in original collection, if the number becomes 0, delete the item from the original collection.
//       if (originalRecord.qty - addToEmployee === 0) {
//         await models[typeIndex].findByIdAndDelete(originalRecord._id);
//       } else {
//         await models[typeIndex].findByIdAndUpdate(originalRecord._id, {
//           $set: {
//             qty: originalRecord.qty - addToEmployee,
//             log:
//               originalRecord.log +
//               `*[${dateTime} ${firstLetterToUpperCase(
//                 type
//               )} - ${addToEmployee} => Employee]* `,
//           },
//         });
//       }

//       return res.status(200).json({
//         msg: `${addToEmployee} ${item} has been added to the employee collection successfully.`,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ msg: "Failed to add to the employee collection. Server error!" });
//   }
// };

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
        qty_in_cart: 0,
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
  const dateTime = new Date().toLocaleString();
  try {
    // Make sure the item exists in the exception collection.
    const recordInException = await ExceptionItemModel.findById(req.body._id);
    if (recordInException === null) {
      return res.status(400).json({
        msg: "Failed to approve the item. Can not find the item in database",
      });
    }
    await ExceptionItemModel.findByIdAndUpdate(req.body._id, {
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

const transferItem = async (req, res) => {
  generalHandle(async (session) => {
    const { original_id, sourceType, targetType, transferQty, subtotal } =
      req.body;

    const sourceRecordResult = await validateAndGetSourceRecord(
      sourceType,
      original_id,
      transferQty
    );
    if (sourceRecordResult.ok !== 1) {
      throw new Error(sourceRecordResult.msg);
    }

    // Manipulate the record in the source collection.
    const removeResult = await removeItemFromCollection(
      sourceType,
      sourceRecordResult.sourceRecord,
      transferQty,
      session
    );
    if (removeResult.ok !== 1) {
      // If the removeItemFromCollection function returns an error, rollback the transaction.
      throw new Error("Failed to manipulate the original record.");
    }

    // Manipulate the record in the target collection.
    const addResult = await addItemToCollection(
      targetType,
      sourceRecordResult.sourceRecord,
      transferQty,
      subtotal,
      session
    );
    if (addResult.ok !== 1) {
      // If the addItemToCollection function returns an error, rollback the transaction.
      throw new Error("Failed to manipulate the target record.");
    }

    // Write the log.
    const logResult = await writeLog(
      "Pengxiang Yue",
      `Transfer ${transferQty} ${sourceRecordResult.sourceRecord.item} to ${targetType} from ${sourceType}.`,
      sourceRecordResult.sourceRecord.pk_id,
      session
    );
    if (logResult.insertedCount !== 1) {
      // If the writeLog function returns an error, rollback the transaction.
      throw new Error("Failed to write the log.");
    }

    // If there is no error, return the success response text.
    return `Successfully transferred ${transferQty} ${sourceRecordResult.sourceRecord.item} to ${targetType} from ${sourceType}.`;
  }, res);
};

const addItemToCollection = async (
  collectionType,
  item,
  addQty,
  subtotal,
  session
) => {
  // Create a new record or update the record in the target collection depending on whether there is a same item saved in the target collection. Same item has the same pk_id, item, cost and price (plus payAmountEach in cart and exception collection).
  const model = typeToModel(collectionType);

  if (collectionType === "exception") {
    const payAmountEach = Number(((subtotal * 100) / addQty / 100).toFixed(2));
  }

  const filter =
    collectionType === "exception"
      ? {
          pk_id: item.pk_id,
          item: item.item,
          cost: item.cost,
          price: item.price,
          payAmountEach: item.payAmountEach,
        }
      : {
          pk_id: item.pk_id,
          item: item.item,
          cost: item.cost,
          price: item.price,
        };

  const update =
    collectionType === "exception"
      ? {
          $set: {
            original_id: item._id,
            weight: item.weight,
            note: item.note,
            exchangeRate: item.exchangeRate,
            type: collectionType,
            originalType: item.type,
            payAmountEach: item.payAmountEach,
            price: item.price,
            subtotal: item.subtotal,
            approved: false,
            receiver: item.receiver,
            sendTimeISO: item.sendTimeISO,
            updatedAt: new Date(),
          },
          $inc: { qty: addQty, payAmount: subtotal },
        }
      : {
          $set: {
            weight: item.weight,
            note: item.note,
            exchangeRate: item.exchangeRate,
            receiver: item.receiver,
            sendTimeISO: item.sendTimeISO,
            type: collectionType,
            updatedAt: new Date(),
          },
          $inc: { qty: addQty },
        };

  const result = await model.findOneAndUpdate(filter, update, {
    upsert: true,
    rawResult: true,
    timestamps: true,
    session: session,
  });
  return result;
};

const validateAndGetSourceRecord = async (sourceType, item_id, transferQty) => {
  // Make sure the item exists in the database.
  const model = typeToModel(sourceType);
  const sourceRecord = await model.findById(item_id);
  if (sourceRecord === null) {
    return {
      ok: 0,
      msg: `Failed to transfer the item. Can not find the item in the ${sourceType} collection.`,
    };
  }

  // Make sure the item has enough quantity to transfer.
  if (sourceRecord.qty_available < transferQty) {
    return {
      ok: 0,
      msg: `Failed to transfer the item. The item has only ${sourceRecord.qty_available} quantity available.`,
    };
  }

  return { ok: 1, sourceRecord };
};

const removeItemFromCollection = async (
  collectionType,
  originalRecord,
  removeQty,
  session
) => {
  const model = typeToModel(collectionType);

  // If the new qty does not becomes 0, update the qty.
  if (originalRecord.qty - removeQty !== 0) {
    const result = await model.findByIdAndUpdate(
      originalRecord._id,
      {
        $inc: { qty: -removeQty },
      },
      { rawResult: true, session: session }
    );
    return result;
  }
  // If the qty in the original collection becomes 0 after updating, delete the record in the original collection.
  else {
    const result = await model.findByIdAndDelete(originalRecord._id, {
      rawResult: true,
      session: session,
    });
    return result;
  }
};

const typeToModel = (type) => {
  const modelsMap = {
    sold: SoldItemsModel,
    stock: StockItemsModel,
    employee: EmployeeItemsModel,
    exception: ExceptionItemModel,
  };
  return modelsMap[type];
};

const writeLog = async (user, msg, pk_id, session) => {
  const result = await LogModel.insertMany(
    [
      {
        user: user,
        msg: msg,
        package: pk_id,
      },
    ],
    { session: session, rawResult: true }
  );
  return result;
};

const generalHandle = async (action, res) => {
  const session = await connection.startSession();
  try {
    session.startTransaction();

    const successResponseText = await action(session);
    await session.commitTransaction();
    res.status(200).json({ msg: successResponseText });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({
      msg: error.message || "Server error!",
    });
  }
  session.endSession();
};

module.exports = {
  allItems,
  // addToStock,
  // addToEmployee,
  addToException,
  recoverFromException,
  approveExceptionItem,
  updateNote,
  transferItem,
};
