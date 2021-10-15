const router = require('express').Router()
const operator = require('../controllers/operatorController')

router.get('/', operator.getKodeOperator)

module.exports = router