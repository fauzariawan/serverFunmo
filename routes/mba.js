const router = require('express').Router()
const mba = require('../controllers/mbaController')

router.get("/tes", mba.tes)
router.get("/cekTransaksi", mba.cekTransaksi)

module.exports = router