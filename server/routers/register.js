const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const {registerValidation} = require('../middleware/validation')

router.post("/", registerValidation, register);

module.exports = router;
