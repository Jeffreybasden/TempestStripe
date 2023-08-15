import React from "react";
import {useState, useEffect} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Button, Row, Spin } from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import styles from '../payment.module.css'
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import presaleContractAbi from '../abi/presaleContractAbi.json'
import usdcAbi from '../abi/usdcAbi.json'
import Element from "./stripe3d/element";


const Pay = (props) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    const [wallet, setWallet] = useState(false)
    const [display, setDisplay] = useState(0)
    const [usd, setUsd] = useState(0)
    const [api, contextHolder] = notification.useNotification();
    const [provider, setProvider] = useState()

  const getProvider = () =>{
    if(localStorage.getItem("wallet")){
      if(props.provider !== undefined){
        return setProvider(props.provider)
      }else{
        let tempProvider =  new ethers.providers.Web3Provider(window.ethereum)
        return setProvider(tempProvider)
      }
    }
  }

  const usdcContract = new ethers.Contract('0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',usdcAbi,provider?.getSigner())
  const presaleContract = new ethers.Contract('0x7e9d22f5EBF3f4808A259E9F864a7d24f6E79461',presaleContractAbi,provider?.getSigner())
   

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
   let res = await fetch(`https://localhost:4000/payment`,
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

  async function payWithWallet (){
    const amountDecimals = ethers.utils.parseUnits(amount.toString(),6)
    const amount18Decimal = ethers.utils.parseUnits(amount.toString(),18)
    try{
      await usdcContract.approve(presaleContract.address, amountDecimals)
      await presaleContract.buyTokens(amount18Decimal)

    }catch(e){
      console.log(e)
      return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,e.message, 'Try Again')
    }
    
  }

  async function checkLoggedIn(){
    // check if logged in local storage
    if(localStorage.getItem('loggedIn') !== null){
        if(localStorage.getItem('wallet') === null){
            setWallet(false)
        }else{
          setWallet(true)
        }
    }else{
      return navigate('/')
    }
  }
 

  useEffect(()=>{
    checkLoggedIn()
    getProvider()
    
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
            
            <div className="images-container">{!wallet&& <><img src="/stripe-logo.png" loading="lazy" sizes="(max-width: 479px) 100vw, 83.890625px" srcset="/stripe-logo-p-500.png 500w, /stripe-logo.png 616w" alt="" className="logo-images"/>
            <div>+</div></>}<img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
          </div>
          <div className="title-text">Get Your Tokens</div>
          <div className="light-blue-container _15-margin-top"><img src="images/coin-small_1coin-small.png" loading="lazy" alt="" className="coin-icon"/>
            <div className="h3">{display}</div>
            <div className="h3">TMPST Tokens</div>
          </div>
          <div className="_350-width grey">Each Tempest token will be $0.25. </div>
          {loading ? <Spin><div className="content" style={{margin:"80px"}} /></Spin> : <>
          <div className="form-block w-form">
            <h4>Dollar amount</h4>
            <input style={{marginTop:20}} type="number" placeholder="$USD" onChange={(e) => getAmount(e)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
            {!wallet? <Element openNotif={openNotification} setLoad={setLoading} notification={props.notification} amount={amount} ></Element>
            // <StripeCheckout
            // name=''
            // stripeKey={process.env.REACT_APP_OPEN_KEY}
            // token={makePayment}
            // amount={amount *100}
            // billingAddress
            // ><button type="primary" data-wait="Please wait..." className="form-btn w-button">Buy Tempest</button> 
            // </StripeCheckout> 
            :
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