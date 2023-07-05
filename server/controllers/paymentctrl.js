const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const secret = 'theValueIsInYouNotWithout'
exports.paymentRegister = async(req,res)=>{
    let customer;
    let {token} = req.body
    let jwt = JWT.sign(token.email,secret)
    let amount = req.body.amount * 100
    let password = await bcrypt.hash(req.body.password, 12)
    try{
        //find customer if they already exist 
        const retrieveCustomer = await stripe.customers.search({query: `email:"${token.email}"`})
        if(retrieveCustomer.data[0]){
            customer = retrieveCustomer.data[0]
            if(customer.metadata.password){
                return res.status(400).json({message:"You already have an account please go to login page"})
            }
            customer = await stripe.customers.update(
                customer.id,
                {metadata: {password:password, jwt:jwt}, source:token.id}
              );
              
        }else{
            //create new customer if they do not exist
            customer = await stripe.customers.create({
                email:token.email,
                name: token.card.name,
                source:token.id,
                metadata: {password:password,jwt:jwt}
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
            setTimeout(()=>{},5000)
        if(paymentIntent.status === "succeeded" ){
            res.status(200).json({name:customer.name,jwt:jwt})
            console.log('congrats on our purchase')
        }
    }catch(e){
        res.status(400)
        res.json({error:e.message})
        console.log(e.message)
    }
}

exports.payment = async(req,res)=>{
    let {token, amount} = req.body
    //numbers in stripe must be multiplied by 100 because they are token in cents not dollars 
    amount = amount*100
    const jwt = req.headers.authorization.split(' ')[1]
    try{
        //find customer if they already exist 
        const {data:[customer]}  = await stripe.customers.search({query: `metadata["jwt"]:"${jwt}"`})
        let sourceAdded = stripe.customers.update(customer.id,{source:token.id})
        setTimeout(()=>{},5000)
        if(sourceAdded){
            setTimeout(async ()=>{
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
            },3000)
        }
    }catch(e){
        res.status(400).json({error:e.message})
        console.log(e.message)
    }
    
}