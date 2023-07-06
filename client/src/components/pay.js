import React from "react";
import {useState, useEffect} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Button, Row, Spin } from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import styles from '../payment.module.css'
import { useNavigate } from "react-router-dom";


const Pay = (props) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    const [wallet, setWallet] = useState(false)
    const [display, setDisplay] = useState(0)
    const [usd, setUsd] = useState(0)
    const [api, contextHolder] = notification.useNotification();
   

  const openNotification = (placement, icon, message, title ) => {
    api.open({
      message: title,
      description:message,
      placement:placement,
      icon: (
        icon
      ),
    });
  };

    const getAmount = (e) =>{
    let total = (e.target.value/0.15).toFixed(2)
    setUsd(e.target.value)
    setDisplay(total)
    setAmount(e.target.value)
    }
    const makePayment = async token =>{
    const jwt = localStorage.getItem('jwt')  
    const body = {token, amount:amount}
    const headers = {
    'Authorization': `Bearer ${jwt}`,
    "Content-Type":"application/json"
    }
  try{
    setLoading(true)
   let res = await fetch(`http://localhost:4000/payment`,
    {
    method:"POST",
    headers,
    body:JSON.stringify(body)
    })

    if(res.ok){
      props.notification("pay")
      return navigate('/dashboard')
    }else{
      setLoading(false)
      let data = await res.json()
      return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,data.error, 'Try Again')
    } 
  }catch(e){
      console.log(e.message)
  }


  }

  async function payWithWallet(){

  }

  async function checkLoggedIn(){
    // check if logged in local storage
    if(localStorage.getItem('loggedIn') !== null){
        if(localStorage.getItem('wallet') === null){
            setWallet(false)
        }
    }else{
      return navigate('/')
    }
  }
 

  useEffect(()=>{
    checkLoggedIn()
    
  },[loggedIn])

      return (
        
        <> 
        <div data-w-id="2fc6eb50-7d4a-7800-2204-b951b846909b" className="section hero hp-hero wf-section"> 
        <div className="basic-nav"></div>
        {contextHolder}
        <div className="content-container">
          <div className="steps-container">
            <div className="filled-step-container">
              <div className="number-container">
                <div>
              </div>
              <div className="green-text">
                Purchase Tempest token
              </div>
            </div>
            <div className="outline-step-container">
            </div>
          </div>
          </div>
          <div className={styles.theHelp}>
            
            <div className="images-container"><img src="/stripe-logo.png" loading="lazy" sizes="(max-width: 479px) 100vw, 83.890625px" srcset="/stripe-logo-p-500.png 500w, /stripe-logo.png 616w" alt="" className="logo-images"/>
            <div>+</div><img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
          </div>
          <div className="title-text">Get Your Tokens</div>
          <div className="light-blue-container _15-margin-top"><img src="images/coin-small_1coin-small.png" loading="lazy" alt="" className="coin-icon"/>
            <div className="h3">{display}</div>
            <div className="h3">TMPST Tokens</div>
          </div>
          <div className="_350-width grey">It is currently presale making the price of each tempest token $0.15. When presale ends the price for a Tempest token will be $0.25. </div>
          {loading ? <Spin><div className="content" style={{margin:"80px"}} /></Spin> : <>
          <div className="form-block w-form">
            <h4>Dollar amount </h4>
            <input style={{marginTop:40}} type="number" onChange={(e)=>getAmount(e)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
            {!wallet?
            <StripeCheckout
            name=''
            stripeKey={process.env.REACT_APP_OPEN_KEY}
            token={makePayment}
            amount={amount *100}
            billingAddress
            ><button type="primary" data-wait="Please wait..." className="form-btn w-button">Buy Tempest</button> 
            </StripeCheckout>:
            <button type="primary" onClick={payWithWallet} data-wait="Please wait..." className="form-btn w-button">Buy Tempest</button>}
          </div>
          </>}
          </div>
        </div>
        </div>
        
        </>
      )

  }

  export default Pay