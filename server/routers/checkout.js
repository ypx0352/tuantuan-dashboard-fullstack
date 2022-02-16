const router = require("express").Router();
const {
  allItems,
  addToStock,
  addToEmployee,
} = require("../controllers/checkout");

router.get("/all_items", allItems);

router.put("/add_to_stock", addToStock);

router.put("/add_to_employee", addToEmployee);

module.exports = router;
