const { addTransaction, getTransaction, approveTransaction } = require("../controllers/transaction");

const router = require("express").Router();

router.post('/add',addTransaction);

router.get('/all',getTransaction);

router.put('/approve',approveTransaction)

module.exports = router