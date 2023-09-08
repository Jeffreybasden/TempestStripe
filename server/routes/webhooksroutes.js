const router = require('express').Router()
const express = require('express')
const  hooks = require('../controllers/webhooksctrl')

router.post('/webhook/coinbase',express.raw({type: 'application/json'}),hooks.coinbaseWebhook)
router.post('/webhook/stripe',express.raw({type: 'application/json'}),hooks.stripeWebhook)


module.exports = router