require('dotenv').config()
const  express = require("express")
const app = express()
const cors = require('cors')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
app.use(cors())
app.use(express.json())

app.post('/payment',async (req,res)=>{
    let customer;
    let {token} = req.body
    let amount = req.body.amount * 100
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
            receipt_email:token.email,
        })

        if(paymentIntent.status === "succeeded" ){
            res.status(200).end()
            console.log('congrats on our purchase')
        }
    }catch(e){
        res.status(400)
        res.json({error:e.message})
        console.log(e.message)
    }
   
    
 
// res.status(200).end()
})



app.listen(4000, ()=> console.log('server started',process.env.STRIPE_PRIVATE_KEY))