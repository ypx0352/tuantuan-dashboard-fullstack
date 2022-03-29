const router = require("express").Router();

const { getSearchedPackage, getLatestPackages } = require("../controllers/package");

router.get("/", getSearchedPackage);

router.get("/latest_package", getLatestPackages)

module.exports = router;
