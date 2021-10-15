const router = require('express').Router()
const winpay = require('../controllers/winpayController')
const { isAuth } = require('../midleware/auth')

router.get('/paymentChannel', winpay.paymentChannel)
router.post("/topup", isAuth, winpay.topup)
router.post("/topupQr", isAuth, winpay.topupQr)
router.get("/cekTransaksi", winpay.cekTransaksi)

module.exports = router