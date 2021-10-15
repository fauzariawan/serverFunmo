const router = require('express').Router()
const {reportDeposit, getDeposit, reportTransaction, getTransaction, reportMutation, getMutation } = require('../controllers/reportController')
const { isAuth } = require('../midleware/auth')

router.get('/transaction/:id', isAuth, reportTransaction)
router.get('/detailtransaction/:id', isAuth, getTransaction)

router.get('/deposit/:id', isAuth, reportDeposit)
router.get('/detaildeposit/:id', isAuth, getDeposit)

router.get('/mutation/:id', isAuth, reportMutation)
router.get('/detailmutation/:id', isAuth, getMutation)

module.exports = router