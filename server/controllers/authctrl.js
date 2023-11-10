const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const Jwt = require('jsonwebtoken')
const secret = 'theValueIsInYouNotWithout'
var coinbase = require('coinbase-commerce-node');
const users = require("../models/users")
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
Client.init(process.env.E_TEMPEST);



exports.Login = async (req,res) =>{
    const {email, password} = req.body
    console.log(password)
    try{
        const customer = await Users.findOne({email:email})
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
        const customer = await Users.findOne({jwt:token})
        if(customer === undefined){
            console.log('search got nothing')
           return res.status(400).end("no customer found")
        }
        return res.json({name:customer.name, purchase_amount:Number(customer.total)})
    }catch(e){
        if(e){ 
            console.log(e)
            return res.status(400).end() 
        }  

    
    }
        

}

exports.Register = async(req,res)=>{
   let {name, email, password} = req.body 
   console.log(password)
   const token =  Jwt.sign(email,secret)
   
   try{
    const existingUser = await Users.findOne({ email });
    console.log(existingUser)
       if(existingUser){
           return res.status(400).json({message:"You already have an account please go to login page"})
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
            jwt:token,
            total:0 
          });
          let newCustomer = await stripe.customers.create({name,email})
          await newUser.save()
          return res.status(200).json({ message: "Your account was created!", name, jwt: token});
    }catch(e){
        console.log(e)
        return res.status(500).json({ message: "Internal Server Error" });
    }
   
}

exports.LogOut = async(req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
        try{
            const logout = await Users.findOneAndUpdate({jwt:token},{jwt:''})
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
                const customer = await Users.findOne({jwt:req.body.name})
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
        console.log('ParsedCharges for coinbase charges history',parsedCharges)
        return res.json(parsedCharges)
      }); 

}
exports.CoinbaseHistory = async(req,res)=>{
   
    let name = req.body.name

    let wallet = await Users.findOne({name})
    if(wallet){
        return res.json(wallet.total)
    }else{
    Charge.all({}, function (error, list, pagination) {
        if(error){
         return console.log('Coinbase is so slow bro omg', error)
        }
  
        let parsedCharges = list.reduce((acc,charge)=>{
            if(charge.timeline[charge.timeline.length-1].status ==="COMPLETED" || charge.timeline[charge.timeline.length-1].status ==="RESOLVED"){
                if(charge.name === name){ 
                    acc += Number(charge.pricing.local.amount)
                }
            }

                
            return acc
        },0) 
        console.log('ParsedCharges for coinbase charges history',parsedCharges)
        return res.json(parsedCharges)
      }); 

    }

}

exports.AddWallet = async(req,res) =>{

    const token = req.headers.authorization.split(' ')[1]
    const wallet = req.body.wallet

    try{
        
        const walletAdded = await Users.findOneAndUpdate({jwt:token}, {wallet:wallet})
        if(walletAdded){
            res.status(200).end()
        }
    }catch(e){
        console.log(error)
    }

}

exports.changePassword = async (req,res) =>{
let password = req.body.password
 let updated = await Users.findOneAndUpdate({jwt:req.body.jwt},{password})
 if(updated){
    return res.json({})
 }
}