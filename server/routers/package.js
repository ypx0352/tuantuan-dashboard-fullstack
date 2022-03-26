const router = require("express").Router();

const { getSearchedPackage } = require("../controllers/package");

router.get("/", getSearchedPackage);

module.exports = router;
