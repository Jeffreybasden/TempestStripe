var coinbase = require('coinbase-commerce-node');
const stripe = require("stripe")('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')
let Users = require('./models/users')
const Teams = require('./models/teams')
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge
Client.init('a6398651-5c1d-4611-9e17-ad73a818860c');
const mongoose = require('mongoose')

function removeObjectsWithRepeatedProperty(arr, propertyName) {
    const uniqueObjects = [];
    const seenValues = new Set();
  
    for (const obj of arr) {
      const propertyValue = obj[propertyName];
  
      if (!seenValues.has(propertyValue)) {
        seenValues.add(propertyValue);
        uniqueObjects.push(obj);
      }
    }
  
    return uniqueObjects;
  }



async function Meep(){
    mongoose.connect("mongodb+srv://tempestwebsite:uA9LuxpHLRCwV28V@cluster0.rdy8xpc.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

  
      for(let i = 1; i<=5; i++){
        let newTeam = new Teams({teamName:`Team ${i}`})
        await newTeam.save()
      }

        
       
      
} 

Meep()