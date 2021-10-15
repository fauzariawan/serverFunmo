const router = require("express").Router()
const inbox = require('../controllers/inboxController')
const {
  isAuth
} = require("../midleware/auth");


router.post("/register", inbox.register);
router.post("/inboxinq", isAuth, inbox.inboxTrxInq);
router.post("/inboxtrx", isAuth, inbox.inboxTrx);
router.post("/inboxdeposit", isAuth, inbox.inboxDeposit);
router.post("/resetpin", isAuth, inbox.resetPin);
router.post("/inboxbalancecross", isAuth, inbox.inboxBalanceCross);
router.post("/ec", isAuth, inbox.exchangeCommission);
router.post("/inboxpay", isAuth, inbox.inboxTrxPay);
router.post("/forgetpin", inbox.forgetPin);
router.post("/inboxtrxid", isAuth, inbox.inboxTrxId);

router.post("/commissiontodeposit", isAuth, inbox.exchangeCommissiontodeposit);
router.post("/checkprice", isAuth, inbox.checkPriceProduct);
router.post("/checkmarkupdownline", isAuth, inbox.checkMarkupDownline);
router.post("/checkmarkupproduct", isAuth, inbox.checkMarkupProduct);
router.post("/checkallmarkupproduct", isAuth, inbox.checkAllMarkupProduk);
router.post("/checkmutation", isAuth, inbox.checkMutation);
router.post("/checklastmutation", isAuth, inbox.checkLastMutation);
router.post("/reportmutation", isAuth, inbox.reportMutation);
router.post("/reporttrx", isAuth, inbox.reportTrx);
router.post("/listgift", isAuth, inbox.listGift);
router.post("/listdownline", isAuth, inbox.listDownline);
router.post("/listsubdownline", isAuth, inbox.listSubDownline);
router.post("/inboxfun", isAuth, inbox.inboxTrxFun);
router.post("/inboxbalance", isAuth, inbox.inboxBalance);

router.post("/exchangepoin", isAuth, inbox.exchangePoin);
router.post("/changeip", isAuth, inbox.changeIp);
router.post("/changeleveldownline", isAuth, inbox.changeLevelDownline);
router.post("/changemarkupdownline", isAuth, inbox.changeMarkupDownline);
router.post("/changemarkupproduct", isAuth, inbox.changeMarkupProduct);
router.post("/changeallmarkupproduk", isAuth, inbox.changeAllMarkupProduk);
router.post("/changename", isAuth, inbox.changeName);
router.post("/changeoid", isAuth, inbox.changeOid);
router.post("/changeippassword", isAuth, inbox.changeIpPassword);

module.exports = router