const { addTransaction } = require("../controllers/transaction");

const router = require("express").Router();

router.post('/add_transaction',addTransaction)

module.exports = router