const router = require("express").Router();
const { allItems, addToStock } = require("../controllers/checkout");

router.get("/all_items", allItems);

router.put("/add_to_stock", addToStock);

module.exports = router;
