const router = require('express').Router()
const allItems = require("../controllers/checkout");

router.get("/all_items", allItems);


module.exports = router