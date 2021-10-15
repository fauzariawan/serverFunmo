const router = require('express').Router()
const dataProvinsi = require('../controllers/dataProvinsiController')

router.get('/provinsi', dataProvinsi.provinsi)
router.post('/kabupaten', dataProvinsi.kabupaten)
router.post('/kecamatan', dataProvinsi.kecamatan)
router.post('/kelurahan', dataProvinsi.kelurahan)

module.exports = router