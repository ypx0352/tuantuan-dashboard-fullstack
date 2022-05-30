const { generalHandle, typeToModel } = require("./static");

const addTransaction = async (req, res) => {
  generalHandle(async (session) => {
    const { user_id } = req.body;

    // Get all items from the cart collection.
    const resultInCart = await typeToModel("cart").findOne({
      user_id: user_id,
    });

    // Calculate payAmountToSender and qty.
    var payAmountToSender = 0;
    var qty = 0;
    const items = resultInCart.items;
    items.forEach((item) => {
      payAmountToSender += item.payAmountToSender;
      qty += item.qty;
      delete item._id
    });
    console.log(items);
    // Save all items in the transaction collection.
    const result = await typeToModel("transaction").create({
      user_id,
      items:items,
      payAmountToSender,
      qty,
    });

    // Reduce items' qty in their original collection.

    // Clear items in the cart collection.
  }, res);
};

module.exports = { addTransaction };
