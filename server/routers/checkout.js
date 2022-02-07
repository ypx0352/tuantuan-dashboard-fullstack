const router = require('express').Router()
const { allItems, addToStock, addToCart } = require("../controllers/checkout");

router.get("/all_items", allItems);

router.put("/add_to_stock", addToStock);

router.post("/add_to_cart", addToCart);


module.exports = router