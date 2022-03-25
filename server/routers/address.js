const router = require("express").Router();

const {
  addAddress,
  getAllAddress,
  deleteAddress,
  updateAddress,
} = require("../controllers/address");

router.post("/add", addAddress);

router.get("/all_address", getAllAddress)

router.delete("/delete",deleteAddress)

router.put("/update",updateAddress)

module.exports = router;
