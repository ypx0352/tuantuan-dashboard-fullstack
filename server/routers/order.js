const router = require('express').Router()
const getOrder = require('../controllers/order')

router.get('/:pk_id', getOrder)

module.exports = router