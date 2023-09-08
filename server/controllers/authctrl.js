const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')
const User = require('../models/users')
const Jwt = require('jsonwebtoken')
const secret = 'theValueIsInYouNotWithout'
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
Client.init(process.env.E_TEMPEST);



exports.Login = async (req,res) =>{
    const {email, password} = req.body
    try{
        const customer = await User.findOne({email:email})
        if(customer === undefined){
            console.log("email wrong")
            return res.status(400).json({message:'Email or password is incorrect'}) 
        }
        if(!await bcrypt.compare(password,customer.password)){
            console.log("password wrong")
            return res.status(400).json({message:'Email or password is incorrect'})
        }else{
            const token = Jwt.sign(email,secret)
            customer.jwt = token
            let updatedCustomer = await customer.save()
                
                if(updatedCustomer){
                    return res.status(200).json({jwt:token,name:customer.name, message:"login was successful"})
                }
            }
    }catch(e){
        if(e){
            console.log(e)
           return  res.status(400).json({message:'There was an error with login please try again'})
        }
    }
}

exports.GetUser = async(req,res) =>{
    const token = req.headers.authorization.split(' ')[1]
   
    try{
        
        const customer = await User.findOne({jwt:token})
        
       
        if(customer === undefined){
            console.log('search got nothing')
           return res.status(400).end("no customer found")
        }
         
        return res.status(200).json({name:customer.name, purchase_amount:customer.total,})
    }catch(e){
        if(e){
            console.log(e)
            return res.status(400).end()
        }

    
    }
        

}

exports.Register = async(req,res)=>{
   let {name, email, password} = req.body 
   const token =  Jwt.sign(email,secret)
   password = await bcrypt.hash(password,12)

   try{
       let {data:[customer]} = await stripe.customers.search({query: `email:"${email}"`})
       if(customer !== undefined && customer.metadata.password !== undefined ){
           return res.status(400).json({message:"You already have an account please go to login page"})
        }else if (customer !== undefined && customer.metadata.password === undefined){
            customer = await stripe.customers.update(
                customer.id,
                {name:name , metadata:{ password:password, jwt:token}}
              );

             return  res.status(200).json({message:"Your account was created!", name:name, jwt:token})
        }else{
            let newCustomer = await stripe.customers.create({
                    email:email,
                    name: name,
                    metadata: {password:password, jwt:token}
                })
                
                if(newCustomer.metadata.jwt === token){
                   return res.status(200).json({message:"Your account was created!", name:name, jwt:token})
                }

        }
    }catch(e){
        console.log(e)
    }
   
}

exports.LogOut = async(req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
        try{
            const {data:[customer]}  = await stripe.customers.search({query: `metadata["jwt"]:"${token}"`})
            const logout = await stripe.customers.update(customer.id,
                {metadata:{jwt:''}}
                )
                if(logout){
                   res.status(200).end() 
                }
        }catch(e){  
            console.log(e)
        }
}


exports.Coinbase = async(req,res)=>{
    let name 
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

    Charge.all({}, function (error, list, pagination) {
        if(error){
         return console.log(error)
        }
        
        let count = 1
        let parsedCharges = list.reduce((acc,charge)=>{
            if(charge.name === name){
                acc.push({key:count, name:charge.name, amount:charge.pricing.local, url:charge.hosted_url, status:charge.timeline[charge.timeline.length-1], expires:charge.expires_at})
                count++
            }

            return acc
        },[]) 
        return res.json(parsedCharges)
      });

}

exports.AddWallet = async(req,res) =>{

    const token = req.headers.authorization.split(' ')[1]
    const wallet = req.body.wallet

    try{
        const {data:[customer]} = await stripe.customers.search({query: `metadata["jwt"]:"${token}"`})
        const walletAdded = await stripe.customers.update(
            customer.id, {metadata:{wallet:wallet}}
        )
        if(walletAdded){
            res.status(200).end()
        }
    }catch(e){
        console.log(error)
    }

}