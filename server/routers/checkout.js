const router = require('express').Router()
const count = require('../controllers/checkout')

router.get('/count', count)


module.exports = router