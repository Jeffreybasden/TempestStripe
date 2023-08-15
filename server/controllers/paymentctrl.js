const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const secret = 'theValueIsInYouNotWithout'
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var charge = coinbase.resources.Charge
Client.init(process.env.E_TEMPEST);


// exports.paymentRegister = async(req,res)=>{
//     let customer;
//     let {token} = req.body
//     let jwt = JWT.sign(token.email,secret)
//     let amount = req.body.amount * 100
//     let password = await bcrypt.hash(req.body.password, 12)
//     try{
//         //find customer if they already exist 
//         const retrieveCustomer = await stripe.customers.search({query: `email:"${token.email}"`})
//         if(retrieveCustomer.data[0]){
//             customer = retrieveCustomer.data[0]
//             //check if the have a password already
//             if(customer.metadata.password){
//                 return res.status(400).json({error:"You already have an account please go to login page"})
//             }
//             customer = await stripe.customers.update(
//                 customer.id,
//                 {metadata: {password:password, jwt:jwt}, source:token.id}
//               );
              
//         }else{
//             //create new customer if they do not exist
//             customer = await stripe.customers.create({
//                 email:token.email,
//                 name: token.card.name,
//                 source:token.id,
//                 metadata: {password:password,jwt:jwt}
//             })

//             console.log(customer)
//         }
//         const paymentIntent =  await stripe.paymentIntents.create({
//             customer:customer.id,
//             amount:amount,
//             currency:'USD',
//             confirm:true,
//             receipt_email:token.email,
//         })
//             setTimeout(()=>{},5000)
//         if(paymentIntent.status === "succeeded" ){
//             res.status(200).json({name:customer.name,jwt:jwt})
//             console.log('congrats on our purchase')
//         }
            
        
//     }catch(e){
//         if(e){
//             res.status(400)
//             res.json({error:e.message + " As you now have an account please login and retry your purchase"})
//             console.log(e.message)
//         }
//     }
// }

exports.payment = async(req,res)=>{
    let  {amount} = req.body
    //numbers in stripe must be multiplied by 100 because they are token in cents not dollars 
    amount = amount*100
    const jwt = req.headers.authorization.split(' ')[1]
    try{
        //find customer if they already exist 
        const {data:[customer]}  = await stripe.customers.search({query: `metadata["jwt"]:"${jwt}"`})
        setTimeout(()=>{},5000)
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
                    return res.json({client_secret:paymentIntent.client_secret})
                }
                       
    }catch(e){
        if(e){
            res.status(400)
            res.json({error:e.message})
        
        }
    }
    
}

exports.CoinbasePay = async(req,res) => {
    let name 
    let amount = req.body.amount
    let type = req.body.type
    
    if(type === 'jwt'){
        // the loop is here because the stripe api is slow to update since it is all saved in stripe. So we call it until we get a the proper data
            try{
                const {data:[customer]} = await stripe.customers.search({query: `metadata["jwt"]:"${req.body.name}"`})
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
    charge.create(chargeData, function (error, response) {
    if(error){
        console.log(error);
    }else{
        return res.json({url:response.hosted_url});

    }
    });

    

}


