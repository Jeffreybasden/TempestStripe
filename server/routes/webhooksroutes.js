const router = require('express').Router()
const express = require('express')
const  hooks = require('../controllers/webhooksctrl')



router.post('/webhook/coinbase',hooks.coinbaseWebhook)
router.post('/webhook/stripe', express.json({type: 'application/json'}),hooks.stripeWebhook)


module.exports = router