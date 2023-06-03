import {useState} from 'react'
import {Input,Row ,Button} from "antd"
import React from "react";
import StripeCheckout from 'react-stripe-checkout'
import Success from './success';


const Stripe = ()=>{
    const [message, setMessage] = useState('')
    const [okay, setOkay] = useState(false)
    const [amount, setAmount] = useState('')
    const getAmount = (e) =>{
    setAmount(e.target.value)
    }
    const makePayment = async token =>{
    const body = {token, amount:amount}
    const headers = {
    "Content-Type":"application/json"
    }
    fetch(`https://tempestapi.onrender.com/payment`,
    {
    method:"POST",
    headers,
    body:JSON.stringify(body)
    }
    ).then(res =>{
    if(res.ok){
        setMessage('Thank you for playing your part in keeping our planet clean!')
        setOkay(true)
    }else{
        return res.json()
    }
    }).then(data=>{
        setMessage(data.error)
        setOkay(true)
    }).catch(e=>{
        console.log(e)
    })

}


if(okay){
    return( <Success mess={message}/>)
}else{
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


}

export default Stripe