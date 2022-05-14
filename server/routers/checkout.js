const router = require("express").Router();
const {
  allItems,
  //addToStock,
  //addToEmployee,
  // addToException,
  //recoverFromException,
  approveExceptionItem,
  updateNote,
  transferItem,
} = require("../controllers/checkout");

router.get("/all_items", allItems);

// router.put("/add_to_stock", addToStock);

// router.put("/add_to_employee", addToEmployee);

// router.put("/add_to_exception", addToException);

// router.put("/recover_from_exception", recoverFromException);

router.put("/approve_exception_item", approveExceptionItem);

router.put("/update_note", updateNote);

router.put("/transfer_item", transferItem)

module.exports = router;
