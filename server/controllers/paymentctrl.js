const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const Users = require('../models/users')
const transactions = require('../models/transactions')
const secret = 'theValueIsInYouNotWithout'
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var charge = coinbase.resources.Charge
Client.init(process.env.E_TEMPEST);



exports.payment = async(req,res)=>{
    let  {amount, employeeId} = req.body
    //numbers in stripe must be multiplied by 100 because they are token in cents not dollars 
    amount = amount*100
    const jwt = req.headers.authorization.split(' ')[1]
    try{
        let user = await Users.findOne({jwt:jwt})
        //find customer if they already exist 
                const { data: [customer] } = await stripe.customers.list({
                    email: user.email,
                    limit: 1, // Limit the result to one customer, assuming you want only one matching customer
                })
                const paymentIntent =  await stripe.paymentIntents.create({
                    customer:customer.id,
                    amount:amount,
                    currency:'USD',
                    automatic_payment_methods: {
                        enabled: true,
                      },
                    receipt_email:customer.email,
                })
              
                if(paymentIntent){
                    let transaction
                    console.log('payment intent made')
                    user.paymentIntent = paymentIntent.id
                    await user.save()
                    
                    if(employeeId !== "undefined"){
                        console.log('EmployeeId is used')
                        transaction = new transactions({sourceId:paymentIntent.id, employee:employeeId, source:'stripe'})
                    }else{
                        console.log('Employee ID is undefined')
                        transaction = new transactions({sourceId:paymentIntent.id, source:'stripe'})
                    } 
                    await transaction.save()
                    console.log(user.paymentIntent)
                    return res.json({client_secret:paymentIntent.client_secret})  
                }
                       
    }catch(e){
        if(e){
            res.status(400)
            res.json({error:e.message})
            console.log(e)
        
        }
    }
    
}

exports.CoinbasePay = async(req,res) => {
    let name 
    let amount = req.body.amount
    let type = req.body.type
    let customer
    let employeeId = req.body.employeeId

    if(type === 'jwt'){
        // the loop is here because the stripe api is slow to update since it is all saved in stripe. So we call it until we get a the proper data
            try{
                customer = await Users.findOne({jwt:req.body.name})
                if(customer){
                    name = customer.email
                }else throw new Error('jwt did not update yet retrying')
            }catch(e){
                console.log(e)
                return res.status(400).end()
            }
        
    }else{
        name = req.body.name
    }


    let chargeData = {
        'name': `${name}`,
        'description': 'Purchase of Tempest tokens',
        'local_price': {
            'amount': `${amount}`,
            'currency': 'USD'
        },
        'pricing_type': 'fixed_price'
    
    }
    charge.create(chargeData, async function (error, response) {
    if(error){
        console.log(error);
    }else{
        let transaction
                    console.log('payment intent made')
                    customer.coinbaseID = response.id
                    await customer.save()
                    
                    if(employeeId !== "undefined"){
                        console.log('EmployeeId is used')
                        transaction = new transactions({sourceId:response.id, employee:employeeId, source:'coinbase'})
                    }else{
                        console.log('Employee ID is undefined')
                        transaction = new transactions({sourceId:response.id, source:'coinbase'})
                    } 
                    await transaction.save()
                    console.log(customer.coinbaseID)
                    
        return res.json({url:response.hosted_url});
    }
    });

    

}

exports.PayWallet = async(req,res) =>{
    let {employeeID,amount} = req.body
    let transaction = new transactions({employee:employeeID,total:amount,source:'metamask'})
    let savedTransaction = await transaction.save()
    console.log('metamask')
   
        return res.json({})
   
}

