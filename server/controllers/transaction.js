const bigDecimal = require("js-big-decimal");

const {
  generalHandle,
  typeToModel,
  removeItemFromCollection,
  writeLog,
  generalHandleWithoutTransaction,
} = require("./static");

const addTransaction = (req, res) => {
  generalHandle(async (session) => {
    const { username, paymentMethod } = req.body; //get username from authentication middleware

    // Get all items from the cart collection.
    const resultInCart = await typeToModel("cart").findOne({
      username: username,
    });
    // Make sure the user exists in the cart collection
    if (resultInCart === null) {
      throw new Error("Can not find the user in the cart.");
    }

    //Make sure the items exist in the user's cart
    if (resultInCart.items.length === 0) {
      throw new Error("The cart is empty.");
    }
    const itemsInCart = resultInCart.toObject().items;

    for (var item of itemsInCart) {
      const originalRecord = await typeToModel(item.originalType).findOne({
        _id: item.original_id,
      });
      // Add price(each) and weight(each) properties to transaction item.
      item.price = originalRecord.price;
      item.weight = originalRecord.weight;

      // Reduce items' qty and qty_in_cart in their original collection.
      const removeResult = await removeItemFromCollection(
        originalRecord.type,
        originalRecord,
        item.qty,
        item.qty,
        session
      );
      if (removeResult.ok !== 1) {
        // If the removeItemFromCollection function returns an error, rollback the transaction.
        throw new Error("Failed to manipulate the original record.");
      }
    }

    // Calculate payAmountToSender and qty.
    var payAmountToSender = 0;
    var qty = 0;
    itemsInCart.forEach((item) => {
      payAmountToSender += item.payAmountToSender;
      qty += item.qty;
    });

    // Save all items in the transaction collection.
    await typeToModel("transaction").create(
      [
        {
          username,
          items: itemsInCart,
          payAmountToSender,
          qty,
          paymentMethod,
        },
      ],
      { session: session }
    );

    // Clear the cart collection.
    await typeToModel("cart").findOneAndUpdate(
      { username: username },
      { $set: { items: [] } },
      { session, session }
    );

    const roundedPrettyCartSubtotal = new bigDecimal(
      payAmountToSender.toFixed(2)
    ).getPrettyValue();

    // Write the log.
    const logResult = await writeLog(
      username,
      `Create transaction with ${qty} items and ￥${roundedPrettyCartSubtotal}.`,
      "",
      session
    );
    if (logResult.insertedCount !== 1) {
      // If the writeLog function returns an error, rollback the transaction.
      throw new Error("Failed to write the log.");
    }

    return "The transaction has been submitted.";
  }, res);
};

const getTransaction = (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      const result = await typeToModel("transaction")
        .find()
        .sort({ createdAt: -1 });
      res.status(200).json({ result });
    },
    res,
    "Failed to get transactions. Server error."
  );
};

const approveTransaction = (req, res) => {
  const { transaction_id, username } = req.body;
  generalHandle(async (session) => {
    await typeToModel("transaction").findOneAndUpdate(
      { _id: transaction_id },
      { $set: { approved: true } },
      { session: session }
    );

    // Generate invoice pdf.
    const transactionRecord = await typeToModel("transaction").findOne({
      _id: transaction_id,
    });
    console.log(transactionRecord);

    // Write the log.
    const logResult = await writeLog(
      username,
      `Approve transaction ${transaction_id}.`,
      transaction_id,
      session
    );
    if (logResult.insertedCount !== 1) {
      // If the writeLog function returns an error, rollback the transaction.
      throw new Error("Failed to write the log.");
    }

    return "The transaction has been approved.";
  }, res);
};

module.exports = { addTransaction, getTransaction, approveTransaction };
