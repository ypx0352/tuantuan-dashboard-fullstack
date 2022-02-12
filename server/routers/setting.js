const router = require('express').Router()
const { getSetting, setSetting } = require("../controllers/setting");

router.get('/', getSetting)

router.put('/',setSetting)

module.exports = router