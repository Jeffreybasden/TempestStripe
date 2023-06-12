require('dotenv').config()
const  express = require("express")
const app = express()
const cors = require('cors')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')





app.use(cors())
app.use(express.json())

app.post('/payment', async(req,res)=>{
    let customer;
    let {token} = req.body
    let amount = req.body.amount * 100
    let password = await bcrypt.hash(req.body.password, 12)
    try{
        const retrieveCustomer = await stripe.customers.search({query: `email:"${token.email}"`})
        if(retrieveCustomer.data[0]){
            customer = retrieveCustomer.data[0]
             customer = await stripe.customers.update(
                customer.id,
                {metadata: {password:password}, source:token.id}
              );
              console.log(customer)
        }else{
            customer = await stripe.customers.create({
                email:token.email,
                name: token.card.name,
                source:token.id,
                metadata: {password:password}
            })

            console.log(customer)
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
})



app.listen(4000, ()=> console.log('server started',process.env.STRIPE_PRIVATE_KEY ))