const router = require('express').Router()
const payment = require('../controllers/paymentctrl')

router.post('/payment-register',payment.paymentRegister)
router.post('/payment',payment.payment)

module.exports = router