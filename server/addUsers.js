var coinbase = require('coinbase-commerce-node');
const stripe = require("stripe")('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')
let Users = require('./models/users')
var Client = coinbase.Client;
var charge = coinbase.resources.Charge
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

    

      // Function to get successful charges from Stripe
      async function getSuccessfulCharges() {
        try {
          let charges = await stripe.charges.list({ limit: 1000, status:'succeeded' });
          charges.data = charges.data.filter(cus=> cus.status !== 'failed')
          
          // Create an object to store customer email and total
          const customerData = {};
      
          // Process charges
          for (const charge of charges.data) {
            let customerEmail = charge.customer; // Stripe customer ID
            const amount = charge.amount / 100; // Convert amount from cents to dollars
      
            if (!customerEmail) {
              // If there's no customer ID, use the recipient_email value
              customerEmail = charge.receipt_email || 'jjaunich@capenawind.com';
            } else {
              // Fetch customer information from Stripe using the customer ID
              try {
                const customer = await stripe.customers.retrieve(customerEmail);
                customerEmail = customer.email || 'jjaunich@capenawind.com';
              } catch (error) {
                console.error(`Error fetching customer information for ID ${customerEmail}:`, error);
              }
            }
      
            if (customerData[customerEmail]) {
              // If the customer email already exists, add the amount to the total
              customerData[customerEmail].total += amount;
            } else {
              // Create a new entry for the customer
              customerData[customerEmail] = {
                email: customerEmail,
                total: amount,
              };
            }
          }
      
          // Convert the customerData object to an array of objects
          const customerArray = Object.values(customerData);
      
           customerArray.forEach(async person=>{
            await Users.findOneAndUpdate({email:person.email},{total:person.total})
           })
        } catch (error) {
          console.error('Error fetching and processing charges:', error);
          return []; // Return an empty array in case of an error
        }
      }
      
      // Call the function to get and process charges
      getSuccessfulCharges()
        
       
      
} 

Meep()