import {useState} from 'react'
import {Input,Row ,Button} from "antd"
import React from "react";
import StripeCheckout from 'react-stripe-checkout'


const Stripe = (props)=>{

const [Amount, setAmount] = useState('')
const makePayment = token =>{
 const body = token
 const headers = {
    "Content-Type":"application/json"
 }
 return fetch(`http://localhost:4000/payment`,
 {
    method:"POST",
    headers,
    body:JSON.stringify(body)
 }
 ).then(res=>{
    if(res.status === 200){
        // return props.success()
    }
}).catch()
}

return(
<>
<p>Dollar amount you want to purchase</p>
<Row style={{marginBottom:20}}>
<Input placeholder="$USD" onChange={(e)=>{setAmount(e)}} width={'10px'}/>
</Row>
<StripeCheckout
email=""
stripeKey={process.env.REACT_APP_OPEN_KEY}
token={makePayment}
amount={Amount * 100}
billingAddress
>
    <Button type="primary" color=" blue" >Buy Tempest</Button>
</StripeCheckout>
</>
)
}

export default Stripe