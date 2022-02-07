const router = require("express").Router();
const {
  getOrder,
  getExchangeRate,
  submitOrder,
  confirmOrder,
} = require("../controllers/order");

router.get("/:pk_id", getOrder);
router.get("/tools/exchange_rate", getExchangeRate);
router.post("/submit", submitOrder);
router.post("/confirm", confirmOrder);

module.exports = router;
