const router = require('express').Router()
const merchantController = require('../controllers/MerchantController')

router.post("/listener", merchantController.urlListener)
router.post("/callback", merchantController.urlCallback)

module.exports = router