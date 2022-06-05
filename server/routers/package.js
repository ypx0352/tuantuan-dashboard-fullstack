const router = require("express").Router();

const { getSearchedPackage, getLatestPackages } = require("../controllers/package");
const authentication = require("../middleware/authentication");
const { userAuthorization } = require("../middleware/authorization");

router.get("/", authentication,userAuthorization, getSearchedPackage);

router.get("/latest_package", authentication, getLatestPackages)

module.exports = router;
