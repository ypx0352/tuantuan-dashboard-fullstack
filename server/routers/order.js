const router = require("express").Router();
const {
  getOrder,
  getExchangeRate,
  submitOrder,
} = require("../controllers/order");

router.get("/:pk_id", getOrder);
router.get("/tools/exchange_rate", getExchangeRate);
router.post("/submit", submitOrder);

module.exports = router;
