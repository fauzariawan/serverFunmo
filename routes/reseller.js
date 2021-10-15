const router = require('express').Router()
const reseller = require('../controllers/resellerController')
const { isAuth } = require('../midleware/auth')

router.post('/getReseller', reseller.getReseller)
router.post('/signin', reseller.signin)
router.post('/kirimotp', reseller.kirimotp)
router.post('/confirmotp', reseller.confirmOtp)
router.get('/alltransaksi', isAuth, reseller.allTransaksi)
router.get('/findOneTransaksi', isAuth, reseller.findOneTransaksi)
router.get('/alldeposit', isAuth, reseller.allDeposit)
router.get('/allmutasi', isAuth, reseller.allMutasi)
router.get('/allnotification', isAuth, reseller.allNotification)
router.post('/verifikasidata', reseller.verifikasiData)
router.post('/editMarkup', isAuth, reseller.editMarkup)
router.get('/downline/:kode_upline', reseller.downline)
router.get('/reward', reseller.reward)
router.get('/komisi', isAuth, reseller.komisi)
router.post('/cekPlnPrePaid', reseller.cekPlnPrePaid)
router.post('/cekKtp', reseller.cekKtp)
router.post('/logout', reseller.logout)
// router.post('/savNumber', isAuth, reseller.saveNumber)
router.post('/saveNumber', isAuth, reseller.saveNumber)
router.post('/saveResellerToko', isAuth, reseller.saveResellerToko)
router.post('/editPemilik', isAuth, reseller.editPemilik)
router.post('/lupaPin', reseller.lupaPin)
router.get('/migrasi', reseller.migrasi)
router.get('/tiketDeposit', reseller.tiketDeposit)
router.get('/getAllReseller', reseller.getAllReseller)

module.exports = router