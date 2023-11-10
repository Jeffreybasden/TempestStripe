import React from "react";
import {useState, useEffect} from 'react'
import { Button, Row, Spin } from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import styles from '../payment.module.css'
import { useNavigate } from "react-router-dom";
import Element from "./stripe3d/element";



const PayWithStripe = (props) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    const [display, setDisplay] = useState(0)
    const [api, contextHolder] = notification.useNotification();
    const [usd, setUsd] = useState(0)


   

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
    let total = (e.target.value/0.25).toFixed(2)
    setUsd(e.target.value)
    setDisplay(total)
    setAmount(e.target.value)
    }
   


  async function checkLoggedIn(){
    // check if logged in local storage
    if(localStorage.getItem('loggedIn') !== null){
       setLoggedIn(true)
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
            
            <div className="images-container">{<><img src="/stripe-logo.png" loading="lazy" sizes="(max-width: 479px) 100vw, 83.890625px" srcset="/stripe-logo-p-500.png 500w, /stripe-logo.png 616w" alt="" className="logo-images"/>
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
             <Element openNotif={openNotification} setLoad={setLoading} notification={props.notification} amount={amount} ></Element>
          </div>
          </>}
          </div>
        </div>
        </div>
        
        </>
      )

  }

  export default PayWithStripe