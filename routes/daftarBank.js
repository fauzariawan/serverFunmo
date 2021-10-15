const router = require('express').Router();
const daftarBank = require('../controllers/daftarBankControllers')

router.get("/", daftarBank.allBank)

module.exports = router