var coinbase = require('coinbase-commerce-node');
const stripe = require("stripe")('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')
let Users = require('./models/users')
const Teams = require('./models/teams')
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge
Client.init('a6398651-5c1d-4611-9e17-ad73a818860c');
const mongoose = require('mongoose')
const fs = require('fs')


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



const  getAllCustomers = async() =>{
  let allCustomers = [];
  let hasMore = true;
  let startingAfter = undefined;

  while (hasMore) {
    const customers = await stripe.customers.list({
      limit: 100,
      starting_after: startingAfter,
    });

    allCustomers = allCustomers.concat(customers.data);

    // Check if there are more records to fetch
    hasMore = customers.has_more;

    // Update the starting_after parameter for the next page
    if (customers.data.length > 0) {
      startingAfter = customers.data[customers.data.length - 1].id;
    }
  }

  return allCustomers
  // let finalCustomers = []
  // allCustomers.forEach((customer) => {
  //   finalCustomers.push({name:customer.name, email:customer.email, ...customer.metadata , total:0})

  // });
}

  

  async function fetchCustomersAndTransactions() {
    try {
      // Step 1: Fetch customers from Stripe API
      const customers = await getAllCustomers()  // Adjust limit as needed
  
      // Initialize an array to store customer data
      const customerDataArray = [];
  
      // Step 2: Process customer data
      for (const customer of customers) {
        // Extract relevant customer information
        const { email, name, id, metadata } = customer;
        const { password, jwt, wallet } = metadata || {};
        const total = 0; // Initialize total to 0
  
        // Create an object with the extracted data
        const customerData = { email, name,   password, jwt, wallet , total };
  
        // Step 3: Fetch successful transactions for the customer
        const successfulTransactions = await stripe.charges.list({
          customer: id, // Filter by customer ID
          status: 'succeeded',
          limit: 10000, // Adjust limit as needed
        });
  
        // Step 4: Update the customer's total based on successful transactions
        successfulTransactions.data.forEach((transaction) => {
          customerData.total += transaction.amount / 100; // Convert amount to the desired currency
        });
  
        // Add the customer data to the array
        customerDataArray.push(customerData);
      }
  
      // The customerDataArray now contains the processed customer data

      console.log(customerDataArray.sort((a,b)=>b.total - a.total));
      fs.writeFileSync('./allcustomers.json', JSON.stringify(customerDataArray.sort((a,b)=>b.total - a.total)))
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Call the function to fetch and process data
 
  async function processTransactions(transactions) {
    const customerMap = new Map(); // Use a Map to store customer data by email
    const processedData = [];
  
    // Loop through the transactions
    for (const transaction of transactions) {
      const customerId = transaction.cus;
      const email = transaction.billingDetails.email;
  
      // If the customer's email is already in the map, update their total
      if (customerMap.has(email)) {
        const existingCustomer = customerMap.get(email);
        existingCustomer.total += transaction.amount;
      } else {
        // Fetch customer information from your data source (Stripe API)
        // Replace this with your actual code to fetch customer data
        if(customerId){
          const customerInfo = await stripe.customers.retrieve(customerId);
    
          // Create a new customer object with email, name, metadata, and total
          const newCustomer = {
            email: email,
            name: customerInfo.name,
            ...customerInfo.metadata,
            total: transaction.amount,
          };
    
          // Add the new customer to the map
          customerMap.set(email, newCustomer);

        }
      }
    }
  
    // Convert the map values to an array
    for (const customer of customerMap.values()) {
      processedData.push(customer);
    }
  
    return processedData;
  }
  
  // Example usage:
 
 
 
  
  
  

async function Meep(){
    // mongoose.connect("mongodb+srv://tempestwebsite:uA9LuxpHLRCwV28V@cluster0.rdy8xpc.mongodb.net/?retryWrites=true&w=majority", {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   })
try{



  // fetchCustomersAndTransactions()
  // let usersList = JSON.parse(fs.readFileSync('./allcustomers.json'))
  // usersList = removeObjectsWithRepeatedProperty(usersList, 'email')
  
  // let coinCharge = JSON.parse(fs.readFileSync('./coinbaseTrans.json'))

  // usersList.forEach(user=>{
  //     coinCharge.forEach(charge=>{
  //       if(user.email === charge.name){
  //         console.log('before change in price', user.total)
  //         user.total+=charge.amount
  //         console.log('after change in price', user.total)
  //       }
  //     })
  // })

  // usersList.sort((a,b)=> b.total - a.total).forEach(async newCustomer=>{
  //   let newUser = new Users(newCustomer)
  //   await newUser.save()
  // })


  Charge.all({}, function (error, list, pagination) {
    if(error){
     return console.log(error)
    }
    console.log(...list.filter(li=>li.id === '9bbd6359-a5fd-41b4-bc77-0d5c33faf552'))
  //   console.log(list.length)
  //   let filtered = list.filter(charge=> charge.timeline[charge.timeline.length-1].status === 'COMPLETED' || charge.timeline[charge.timeline.length-1].status ==='RESOLVED' )
  //  filtered = filtered.map(trans =>{ return{name:trans.name, amount:Number(trans.pricing.local.amount)}})
  //  console.log(filtered)
   
   
   
  }); 
 


        
       
      }catch(e){
      console.log(e)
      }
          // get the transactions sorted right
} 
      
      Meep()