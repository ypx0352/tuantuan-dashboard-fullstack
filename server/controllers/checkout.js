const { writeLog,generalHandle } = require("./static");

const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

// const firstLetterToUpperCase = (word) => {
//   return word.charAt(0).toUpperCase() + word.slice(1);
// };

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

// const recoverFromException = async (req, res) => {
//   const {
//     originalType,
//     _id,
//     addToRecover,
//     item,
//     cost,
//     price,
//     weight,
//     pk_id,
//     note,
//     exchangeRate,
//     status,
//     log,
//     receiver,
//     sendTimeISO,
//   } = req.body;

//   const types = ["sold", "stock"];
//   const models = [SoldItemsModel, StockItemsModel];
//   const typeIndex = types.indexOf(originalType);
//   const dateTime = new Date().toLocaleString();
//   const firstLetterToUpperCase = (word) => {
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   };

//   try {
//     // Make sure the item exists in the exception collection
//     const recordInException = await ExceptionItemModel.findById(_id);
//     if (recordInException === null) {
//       return res.status(400).json({
//         msg: "Failed to remove the item from the exception collection. Can not find the item in database.",
//       });
//     }

//     // Increase the qty of the item in original collection, if the item exists in original collection (share the same pk_id, item and cost). Otherwise, create a new record of the item in original collection.
//     const originalRecord = await models[typeIndex].findOne({
//       pk_id: pk_id,
//       item: item,
//       cost: cost,
//     });
//     if (originalRecord !== null) {
//       await models[typeIndex].findOneAndUpdate(
//         { pk_id: pk_id, item: item, cost: cost },
//         {
//           $inc: { qty: addToRecover },
//           $set: {
//             log:
//               originalRecord.log +
//               `*[${dateTime} ${firstLetterToUpperCase(
//                 originalRecord.type
//               )} + ${addToRecover} <= Exception]* `,
//           },
//         }
//       );
//     } else {
//       await models[typeIndex].create({
//         item,
//         qty: addToRecover,
//         qty_in_cart: 0,
//         cost,
//         price,
//         weight,
//         pk_id,
//         note,
//         exchangeRate,
//         status,
//         type: originalType,
//         receiver,
//         sendTimeISO,
//         log:
//           log +
//           `*[${dateTime} ${firstLetterToUpperCase(
//             originalType
//           )} + ${addToRecover} <= Exception]* `,
//       });
//     }

//     // Decrease the qty and the payAmount of the item in the exception collection, if the new qty does not become 0. Otherwise, deelete the record in the exception collection.
//     const newQty = recordInException.qty - addToRecover;
//     const newPayAmount = Number(
//       (recordInException.payAmountEach * newQty).toFixed(2)
//     );
//     const newSubtotal = Number(
//       ((recordInException.subtotal / recordInException.qty) * newQty).toFixed(2)
//     );
//     if (newQty > 0) {
//       await ExceptionItemModel.findByIdAndUpdate(_id, {
//         $set: {
//           qty: newQty,
//           payAmount: newPayAmount,
//           subtotal: newSubtotal,
//           log:
//             recordInException.log +
//             `*[${dateTime} Exception - ${addToRecover} => ${firstLetterToUpperCase(
//               originalType
//             )}]* `,
//         },
//       });
//     } else {
//       await ExceptionItemModel.findByIdAndRemove(_id);
//     }

//     res.status(200).json({
//       msg: `${addToRecover} ${item} has been added to the ${originalType} collection successfully.`,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       msg: "Failed to recovery from the exception collection. Server error!",
//     });
//   }
// };

// const approveExceptionItem = async (req, res) => {
//   const dateTime = new Date().toLocaleString();
//   try {
//     // Make sure the item exists in the exception collection.
//     const recordInException = await ExceptionItemModel.findById(req.body._id);
//     if (recordInException === null) {
//       return res.status(400).json({
//         msg: "Failed to approve the item. Can not find the item in database",
//       });
//     }
//     await ExceptionItemModel.findByIdAndUpdate(req.body._id, {
//       $set: {
//         approved: true,
//         log:
//           recordInException.log + `*[${dateTime} Exception item is approved]* `,
//       },
//     });
//     res.status(200).json({ msg: "The item has been approved successfully." });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       msg: "Failed to approve the exception item. Server error!",
//     });
//   }
// };

const approveExceptionItem = async (req, res) => {
  generalHandle(async (session) => {
    // Validate and get the source record.
    const sourceRecordResult = await validateAndGetSourceRecord(
      "exception",
      req.body._id,
      1
    );
    if (sourceRecordResult.ok !== 1) {
      throw new Error(sourceRecordResult.msg);
    }

    // Manipulate the record in the source collection.
    const result = await ExceptionItemModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          approved: true,
        },
      },
      { new: true, session: session }
    );

    // If the modification is failed, rollback the transaction.
    if (!result.approved) {
      throw new Error("Failed to approve this item. Server error.");
    }

    // Logging this action.
    const logResult = await writeLog(
      "Pengxiang Yue",
      `approve ${sourceRecordResult.sourceRecord.qty} ${sourceRecordResult.sourceRecord.item}.`,
      sourceRecordResult.sourceRecord.pk_id,
      session
    );

    // If the writeLog function returns an error, rollback the transaction.
    if (logResult.insertedCount !== 1) {
      throw new Error("Failed to write the log.");
    }

    // If there is no error, return the success response text.
    return `Successfully approve ${sourceRecordResult.sourceRecord.qty} ${sourceRecordResult.sourceRecord.item}.`;
  }, res);
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

    // Validate and get the source record.
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
      `transfer ${transferQty} ${sourceRecordResult.sourceRecord.item} to ${targetType} from ${sourceType}.`,
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
  // Create a new record or update the record in the target collection depending on whether there is a same item saved in the target collection. Same items have the same pk_id, item, cost and price (plus payAmountEach in cart and exception collection).
  const model = typeToModel(collectionType);

  var payAmountEach;

  if (collectionType === "exception") {
    payAmountEach = Number(((subtotal * 100) / addQty / 100).toFixed(2));
  }

  const filter =
    collectionType === "exception"
      ? {
          pk_id: item.pk_id,
          item: item.item,
          cost: item.cost,
          price: item.price,
          payAmountEach: payAmountEach,
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
            payAmountEach: payAmountEach,
            price: item.price,
            subtotal: item.subtotal,
            approved: false,
            receiver: item.receiver,
            sendTimeISO: item.sendTimeISO,
            updatedAt: new Date(),
          },
          $inc: { qty: addQty, qty_in_cart: 0, payAmount: subtotal },
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
          $inc: { qty: addQty, qty_in_cart: 0 },
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
      msg: `Failed to transfer the item. Can not find the item in the ${sourceType} collection or there are not sufficient items for this action.`,
    };
  }

  // Make sure the item has enough quantity to transfer.

  if (sourceRecord.qty - sourceRecord.qty_in_cart < transferQty) {
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

module.exports = {
  allItems,
  //recoverFromException,
  approveExceptionItem,
  updateNote,
  transferItem,
};
