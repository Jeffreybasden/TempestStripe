require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const uuid = require("uuid")


app.use(cors())
app.use(express.json())

app.post('/payment',async (req,res)=>{
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
        const paymentIntent =  await stripe.charges.create({
            customer:customer.id,
            amount:amount,
            currency:'USD'

        })
        console.log('PAY------>',paymentIntent)
    }catch(e){
        console.log('Error: ', e)
    }
    const idempontencyKey = uuid.v4()
    
 
// res.status(200).end()
})

app.listen(4000,()=>{
    console.log('We here')
})