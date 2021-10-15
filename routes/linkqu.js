const router = require('express').Router()
const linkqu = require('../controllers/linkquController')
const { isAuth } = require('../midleware/auth')

router.get('/getDataBank', linkqu.getDataBank)
router.get('/getDataEmoney', linkqu.getDataEmoney)
router.get('/getResumeAccount', linkqu.getResumeAccount)
router.post('/createVirtualAccount', linkqu.createVirtualAccount)
router.post('/createVirtualAccountOB', linkqu.createVirtualAccountOB)
router.post('/createVirtualAccountDedicated', linkqu.createVirtualAccountDedicated)
router.post('/updateVirtualAccountDedicated', linkqu.updateVirtualAccountDedicated)
router.post('/callback', linkqu.callback)
router.post('/simulateInqBill', linkqu.simulateInqBill)
router.post('/simulatePayBill', linkqu.simulatePayBill)
router.post('/inqTransferBank', isAuth, linkqu.inqTransferBank)
router.post('/payTransferBank/:bankcode/:accountnumber/:amount/:partner_reff/:inquiry_reff/:remark', isAuth, linkqu.payTransferBank)
router.post('/payTransferBankDQ', linkqu.payTransferBankDQ)
router.post('/callbackTransferBank', linkqu.callbackTransferBank)



module.exports = router