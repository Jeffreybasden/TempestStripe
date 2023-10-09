var coinbase = require('coinbase-commerce-node');
const express = require('express')
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
Client.init(process.env.E_TEMPEST);
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Users = require('../models/users')
const transactions = require("../models/transactions")
const employees = require('../models/employee'); 
const Teams = require('../models/teams'); 
const { payment } = require('./paymentctrl');
let endpointSecret = 'whsec_d29d5d8d61c65e34a8422839193bcd48e58cc6afea19e75e1a8323d199922ce1'




exports.coinbaseWebhook = async(request,response) =>{
  const {event} = request.body;
  
    try{
      console.log(event)
      
      switch (event.type) {
        case 'charge:confirmed':
          
          let user = await Users.findOne({coinbaseID:event.data.id})
          user.total += Number(event.data.pricing.local.amount)
          let savedUser = await user.save()
          let transaction = await transactions.findOne({sourceId:event.data.id}).populate('employee')
          transaction.total = Number(event.data.pricing.local.amount)
          console.log('transaction=====',transaction)
          let employee = transaction.employee
          if(employee){
            console.log('employee====== before the changes', employee)
            employee.sales.push(transaction._id)
            let team = await Teams.findOne({_id:employee.team}) 
            team.transactions.push(transaction._id) 
            await team.save()
            await employee.save()  
          }
          await transaction.save()  
          console.log('employee======', employee)
          
          console.log("success status bby we lit")
          response.status(200).end()
          break;
          
          case 'charge:failed':
            let deleted = await transactions.findOneAndDelete({sourceId:paymentIntent.id})
            console.log(deleted)
            console.log('deleted transaction')
            response.status(200).end()
            break; 
      
        default:
          console.log(`Unhandled event type ${event.type}`);
        }
  
        
      }catch(e){
        console.log(e)
      }
        response.json({received: true});
        
}




exports.stripeWebhook = async (request,response) =>{
  
    const event = request.body;
  
    try{

      
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          let user = await Users.findOne({paymentIntent:paymentIntent.id})
          user.total += paymentIntent.amount/100
          let savedUser = await user.save()
          let transaction = await transactions.findOne({sourceId:paymentIntent.id}).populate('employee')
          transaction.total = paymentIntent.amount/100
          console.log('transaction=====',transaction)
          let employee = transaction.employee
          if(employee){
            console.log('employee====== before the changes', employee)
            employee.sales.push(transaction._id)
            let team = await Teams.findOne({_id:employee.team}) 
            team.transactions.push(transaction._id) 
            await team.save()
            await employee.save()  
          }
          await transaction.save()  
          console.log('employee======', employee)
          
          console.log("success status bby we lit")
          response.status(200)
          break;
          
          case 'payment_intent.failed':
            let deleted = await transactions.findOneAndDelete({sourceId:paymentIntent.id})
            console.log(deleted)
            console.log('deleted transaction')
            response.status(200).end()
            break; 
      
        default:
          console.log(`Unhandled event type ${event.type}`);
        }
  
        
      }catch(e){
        console.log(e)
      }
        response.json({received: true});
        
        
}