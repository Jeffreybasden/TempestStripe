import {useState} from 'react'
import {Input,Row ,Button} from "antd"
import React from "react";
import StripeCheckout from 'react-stripe-checkout'


const Stripe = (props)=>{
    
    const [amount, setAmount] = useState('')
    const getAmount = (e) =>{
    setAmount(e.target.value)
    }
    const makePayment = async token =>{
    const body = {token, amount:amount}
    const headers = {
    "Content-Type":"application/json"
    }
    fetch(`/api/payment`,
    {
    method:"POST",
    headers,
    body:JSON.stringify(body)
    }
    ).then(res=>{
    if(res.status === 200){
        // return props.okay(true)
    }
    }).catch()

    console.log(token)
}

return(
<>
<p>Dollar amount you want to purchase</p>
<Row style={{marginBottom:20}}>
<Input placeholder="$USD" onChange={(e)=>{getAmount(e)}} width={'10px'}/>
</Row>
<StripeCheckout
email=""
name=""
stripeKey={process.env.REACT_APP_OPEN_KEY}
token={makePayment}
amount={amount * 100}
billingAddress
>
    <Button type="primary" color=" blue" >Buy Tempest</Button>
</StripeCheckout>
</>
)
}

export default Stripe