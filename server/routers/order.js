const router = require("express").Router();
const { getOrder, getExchangeRate } = require("../controllers/order");

router.get("/:pk_id", getOrder);
router.get('/tools/exchange_rate',getExchangeRate)
module.exports = router;
