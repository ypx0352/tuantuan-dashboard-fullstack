const router = require("express").Router();

const { addAddress, getAllAddress } = require("../controllers/address");

router.post("/add", addAddress);

router.get("/all_address", getAllAddress)

module.exports = router;
