require('dotenv').config()
import express from 'express'
import {Router} from "express"
import cors from 'cors'
import  { Stripe } from "stripe"
import serverless from 'serverless-http';
const router = Router()
const api = express()
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)


api.use(cors())
api.use(express.json())

router.post('/payment',async (req,res)=>{
    let customer;
    let {token} = req.body
    let email = token.email
    // delete token.email
   
    let amount = req.body.amount * 100

    console.log('REQ---->',token)
    console.log('AMOUNT-------->',req.body.amount, token.id)
    try{
        const retrieveCustomer = await stripe.customers.search({query: `email:"${token.email}"`})
        // console.log('USER---->',retrieveCustomer.data[0])
        if(retrieveCustomer.data[0]){
            customer = retrieveCustomer.data[0]
        }else{
            customer = await stripe.customers.create({
                email:token.email,
                name: token.card.name,
                source:token.id,
            })
        }
        const paymentIntent =  await stripe.paymentIntents.create({
            customer:customer.id,
            amount:amount,
            currency:'USD',
            confirm:true,
            receipt_email:token.email
        })
        console.log('PAY------>',paymentIntent)
    }catch(e){
        console.log('Error: ', e)
    }
    const idempontencyKey = uuid.v4()
    
 
// res.status(200).end()
})

api.use('/api/', router)

export const handler = serverless(app)