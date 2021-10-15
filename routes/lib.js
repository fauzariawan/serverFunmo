const router = require('express').Router()
const {
    listInfo,
    getInfo,
    listBanner,
    getBanner
} = require("../controllers/infoController");
const {
    isAuth
} = require('../midleware/auth')

router.get("/info", listInfo);
router.get("/info/:id", isAuth, getInfo);

router.get("/banner", isAuth, listBanner);
router.get("/banner/:id", isAuth, getBanner);

module.exports = router