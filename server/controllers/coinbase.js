require('dotenv').config()
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
var Checkout = coinbase.resources.Checkout
Client.init('a6398651-5c1d-4611-9e17-ad73a818860c');

const  transaction = async() =>{
    var chargeData = {
        'name': 'testlogin@test.com',
        'description': 'Mastering the Transition to the Information Age',
        'local_price': {
            'amount': '100.00',
            'currency': 'USD'
        },
        'pricing_type': 'fixed_price' 
    
    }
    Charge.create(chargeData, function (error, response) {
      console.log(error);
      // console.log('THE URL !!',response);
    });

    Charge.all({}, function (error, list) {
      if(error){
       return console.log(error);
      }
     
      console.log('PARSED LISTED OF CHARGES_____________________________________')
      let parsedCharges = list.forEach(charge=>{
        console.log(charge.timeline)
        if(charge.name === 'GJJ Test'){
          console.log(charge)
        }
        // if(string.includes('Completed') || string.includes('COMPLETED') || string.includes('Resolved' )|| string.includes('RESOLVED')){
        //   console.log(charge)
        //   return {name:charge.name, amount:charge.pricing.local, url:charge.hosted_url, timeline:charge.timeline[charge.timeline.length-1], expires:charge.expires_at}

        // } else{
        //   return {name:charge.name, amount:charge.pricing.local, url:charge.hosted_url, timeline:charge.timeline[charge.timeline.length-1], expires:charge.expires_at}
        // }
      }) 
      // console.log(JSON.stringify(parsedCharges))
    });
}



transaction()