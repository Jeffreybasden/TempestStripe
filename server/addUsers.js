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







  async function fetchCustomersAndTransactions() {
    try {
      const customers = await stripe.customers.list({ limit: 1000 }); // Adjust limit as needed
      const customerDataArray = [];
  
      // Step 1: Retrieve all customers and extract their data
      for (const customer of customers.data) {
        const email = customer.email || 'No Email Available';
        const name = customer.name || 'No Name Available';
        const metadata = customer.metadata || {};
        const jwt = metadata.jwt || '';
        const password = metadata.password || '';
        const wallet = metadata.wallet || '';
  
        const customerData = {
          email,
          name,
          jwt,
          password,
          wallet,
          total: 0, // Initialize total to 0
        };
  
        customerDataArray.push(customerData);
      }
  
      // Step 2: Retrieve all transactions and calculate customer totals
      const transactions = await stripe.charges.list({
        limit: 1000, status:'succeeded' // Adjust limit as needed
      });
  
      for (const transaction of transactions.data) {
        if(transaction.status === 'succeeded'){

        
        let transactionEmail = transaction.receipt_email || 'No Email Available';
  
        if (typeof transaction.customer === 'string') {
          const customerInfo = await stripe.customers.retrieve(transaction.customer);
            transactionEmail = customerInfo.email;
            console.log('customer ID', transactionEmail)
        }else if(transaction.customer_details){
          transactionEmail = transaction.customer_details.email
          console.log( 'customer_details',transaction.customer_details)
        }
  
        // Find the customer in the customerDataArray
        const customer = customerDataArray.find((c) => c.email === transactionEmail);
  
        if (customer) {
          customer.total += transaction.amount / 100; // Convert to the desired currency format
        }

        }
      }//
  
      return customerDataArray;
    } catch (error) {
      console.error('Error fetching customers and transactions:', error);
      throw error;
    }
  }
  
  // Example usage:
  
  
// Example usage:

  
  // Example usage:
  
  

async function Meep(){
    mongoose.connect("mongodb+srv://tempestwebsite:uA9LuxpHLRCwV28V@cluster0.rdy8xpc.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
  
      fetchCustomersAndTransactions()
      .then((customerDataArray) => {
       let newArray = removeObjectsWithRepeatedProperty(customerDataArray, 'email')
        console.log(newArray.sort((a,b)=> a.total - b.total));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
             
      
} 

Meep()