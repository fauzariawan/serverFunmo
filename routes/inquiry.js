const router = require('express').Router()
const inquiry = require('../controllers/inquiryController')

router.get('/plnprepaid', inquiry.inquiryPlnPrepaid)

module.exports = router
