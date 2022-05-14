const router = require("express").Router();

const { getAllLogs } = require("../controllers/log");

router.get("/all_logs", getAllLogs);

module.exports = router;
