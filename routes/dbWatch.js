const router = require('express').Router()
const dbWatch = require('../controllers/dbWatchController')

router.get('/', dbWatch.watchInsert)

module.exports = router