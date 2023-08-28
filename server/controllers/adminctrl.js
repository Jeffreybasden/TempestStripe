const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const adminUser = require('../models/adminUser')
var coinbase = require('coinbase-commerce-node');

var Client = coinbase.Client;
var charge = coinbase.resources.Charge
Client.init(process.env.E_TEMPEST);
const secret = 'theValueIsInYouNotWithout'

function isDateInPastWeek(dateToCheck) {
    const checkDate = new Date(dateToCheck)
    const currentDate = new Date();
    const pastWeekStartDate = new Date();
    pastWeekStartDate.setDate(currentDate.getDate() - 7);

    return checkDate >= pastWeekStartDate && checkDate <= currentDate;
}

function isDateInPastMonth(dateToCheck) {
    const checkDate = new Date(dateToCheck)
    const currentDate = new Date();
    const pastMonthStartDate = new Date();
    pastMonthStartDate.setMonth(currentDate.getMonth() - 1);

    return checkDate >= pastMonthStartDate && checkDate <= currentDate;
}
function isDateInPast3Month(dateToCheck) {
    const checkDate = new Date(dateToCheck)
    const currentDate = new Date();
    const pastMonthStartDate = new Date();
    pastMonthStartDate.setMonth(currentDate.getMonth() - 3);

    return checkDate >= pastMonthStartDate && checkDate <= currentDate;
}

function isDateInPastDay(dateToCheck) {
    const checkDate = new Date(dateToCheck)
    const currentDate = new Date();
    const pastDayStartDate = new Date();
    pastDayStartDate.setDate(currentDate.getDate() - 1);

    return checkDate >= pastDayStartDate && checkDate <= currentDate;
}

function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    const month = date.getMonth() + 1; // Months are 0-indexed, so adding 1
    const day = date.getDate();
    const year = date.getFullYear();
    
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}
const coinbaseSearch = async(name, time) =>{
        
    let final = []
            
    let coin = await charge.all({}) //get all charges
 
   const confirmed = coin.filter(charge => charge.confirmed_at) // filter charges that were completed
  
    if(name && time){
       final = confirmed.filter(charge=>{
        switch(time){
            case 'week':
                return name === charge.name && isDateInPastWeek(charge.created_at)
            case 'month': 
                return name === charge.name && isDateInPastMonth(charge.created_at) 
            case '3month': 
                return name === charge.name && isDateInPast3Month(charge.created_at) 
            case 'day': 
                return name === charge.name && isDateInPastDay(charge.created_at) 
        }


    }) 
        
    }else if (name && !time){
        final = confirmed.filter(charge => charge.name === name)
    }else if(time && !name){
        final = confirmed.filter(charge=>{
            switch(time){
                case 'week':
                    return isDateInPastWeek(charge.created_at)
                case 'month': 
                    return isDateInPastMonth(charge.created_at) 
                case '3month': 
                    return isDateInPast3Month(charge.created_at) 
                case 'day': 
                    return isDateInPastDay(charge.created_at) 
            }
    
    
        }) 

    }else{
        final = confirmed
    }

    return final.map(charge =>{
        return {email:charge.name, time:convertDateFormat(charge.created_at), source:'coinbase', amount:charge.pricing.local.amount}
    })


}

const stripeSearch = async(name,time)=>{
    let final = []
    let {data} = await stripe.charges.list({status:'succeeded',limit:1000})
    console.log('before the filter',data.length)
    // data = data.filter(charge=> charge.status === 'succeeded')
    console.log('after the filter',data.length)
    let checkList = await stripe.checkout.sessions.list({limit:1000})
    console.log('check before the filter',checkList.data.length)
    let  data2 = checkList.data.filter(check=>check.payment_status === 'paid')
    console.log('check before the filter',data2.length)

    data2 = data2.map(charge=>{

        if(charge.customer_details.email){
            charge.receipt_email = charge.customer_details.email
            console.log('first one',charge.receipt_email)
        }else if(charge.customer){
            charge.receipt_email = charge.customer.email
            console.log('second one',charge.receipt_email)
        }
        charge.amount = charge.amount_total
        return charge 
    }) 
    data = data2.concat(data)
    console.log('data concatenated',data.length)
    if(name && time){
        console.log('name and time are showing up')
        final = data.filter(charge=>{
            switch(time){
                case 'week':
                    return name === charge.receipt_email && isDateInPastWeek(charge.created*1000)
                    case 'month': 
                    return name === charge.receipt_email && isDateInPastMonth(charge.created*1000) 
                    case 'day': 
                    return name === charge.receipt_email && isDateInPastDay(charge.created*1000) 
                }
            })     
        }else if (name && !time){
         console.log('just name  showing up')
         final = data.filter(charge => charge.receipt_email === name)
        }else if(time && !name){
         console.log('just time showing up')
         final = data.filter(charge=>{
             switch(time){
                 case 'week':
                     return isDateInPastWeek(charge.created * 1000)
                 case 'month': 
                     return isDateInPastMonth(charge.created* 1000) 
                 case 'day': 
                     return isDateInPastDay(charge.created * 1000) 
             } 
         })  
     }else{
        console.log('nothing showed up')
         final = data
     }

     
     return final.map(charge =>{
         return {email:charge.receipt_email, time:convertDateFormat(charge.created* 1000), source:'stripe', amount:charge.amount / 100}
     })
 

}


exports.getData = async(req,res) =>{
try {
    const {user,time} = req.body
    console.log(user,time)
    let coinbaseFiltered = await coinbaseSearch(user,time)
    let stripeFiltered = await stripeSearch(user,time)
    let walletFiltered
    let fullTransaction = coinbaseFiltered.concat(stripeFiltered)
    
    res.json(fullTransaction)
    
} catch (error) {
    console.log(error)
    res.status(200).end()
}


}

exports.getTotal = async(req,res) =>{

    let {data} = await stripe.charges.list({limit:1000})
    data = data.map(charge=> charge.amount / 100).reduce((acc,curr)=> acc+=curr,0)
    const sessions = await stripe.checkout.sessions.list({limit:1000})
    const paidSesh = sessions.data.filter(check=>check.payment_status === 'paid' ).reduce((acc,curr)=> acc+=curr.amount_total/100,0)

    let coin = await charge.all({}) //get all charges
    const total = coin.filter(charge => charge.confirmed_at).map(charge=> Number(charge.pricing.local.amount)).reduce((acc,curr)=> acc+=curr,0) + data// filter charges that were completed
    console.log('TOTALALALAL',total)
    console.log(paidSesh,total)
    res.json({total:total+paidSesh}) 
}

exports.login = async(req,res)=>{
    const {email,password} = req.body
    const token = JWT.sign(email,secret)
    try {
        const admin = await adminUser.findOne({email})
        if(admin){
            const validPassword = await bcrypt.compare(password,admin.password)
            if(validPassword){
                admin.jwt = token
                await admin.save() 
                res.json({token})
            }else res.json({error:'access denied'})
    
        }else res.json({error:'access denied'})
             
    } catch (error) {
        console.log(error)
    }

}


exports.register = async(req,res) =>{
    
    let {email, password}= req.body 
    const token =  JWT.sign(email,secret)
    try {
        password = await bcrypt.hash(password,12)
        const newAdmin = new adminUser({email,password,jwt:token})
        await newAdmin.save()
        res.json({token}) 
    } catch (error) {
        res.json({error:error}) 
    }

}
