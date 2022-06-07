const router = require("express").Router();

const {
  getSearchedPackage,
  getLatestPackages,
  getPostSlip,
} = require("../controllers/package");
const authentication = require("../middleware/authentication");
const { userAuthorization } = require("../middleware/authorization");

router.get("/", authentication, userAuthorization, getSearchedPackage);

router.get("/latest_package", authentication, getLatestPackages);

router.get("/post_slip",  getPostSlip);

module.exports = router;
