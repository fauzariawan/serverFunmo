const router = require('express').Router();
const grdv = require('../controllers/grdvControllers')

router.post("/login", grdv.login)
router.post("/rincianAkun", grdv.rincianAkun)
router.post("/daftarProduk", grdv.daftarProduk)
router.post("/pembelian", grdv.pembelian)
router.post("/cekTransaksi", grdv.cekTransaksi)

module.exports = router