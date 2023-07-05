import React from 'react'
import {useState, useEffect} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Button, Row, Spin } from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import styles from '../payment.module.css'
import { useNavigate } from "react-router-dom";


const InputContent = (props) =>{
  return(
   <>
    <div className="images-container"><img src="/stripe-logo.png" loading="lazy" sizes="(max-width: 479px) 100vw, 83.890625px" srcset="/stripe-logo-p-500.png 500w, /stripe-logo.png 616w" alt="" className="logo-images"/>
      <div>+</div><img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
    </div>
    <div className="title-text">Create account</div>
    <div className="_350-width grey">Ensure this email address is one you use, as this is how you will access your tokens in the future.</div>
    <div className="form-block w-form">
      <form id="email-form" name="email-form" data-name="Email Form" method="get">
        <h4>Email</h4>
        <input type="email" onChange={(e)=>props.email(e)} className="form-input w-input" maxLength="256" name="email" data-name="Email" placeholder="john@email.com" id="email" required=""/>
        <h4>Password</h4>
        <input type="password" onChange={(e)=>props.pass(e)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
        <h4>Re-type Password</h4>
        <input type="password" onChange={(e)=>props.passTwo(e)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
      </form>  
    </div>
   </>
  

  )
}

const Introduction = () =>{
  return(
    <>
    <div className="images-container"><img src="/stripe-logo.png" loading="lazy" sizes="(max-width: 479px) 100vw, 83.890625px" srcset="/stripe-logo-p-500.png 500w, /stripe-logo.png 616w" alt="" className="logo-images"/>
      <div>+</div><img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/></div>
    <p style={{fontSize:"1rem", padding:20, textAlign:"justify", margin:20, }} >Given that you have opted to utilize Stripe as your payment method, in order to view your tokens you will need to create an account with us.</p>
    </>
  )
}




  const RegisterPay = (props) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    let [current, setCurrent] = useState(1)
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')
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

  const  setPass = (e) =>{
      setPassword(e.target.value)
    }
    const setEm = (e) =>{
      setEmail(e.target.value)
    }
    const setPassTwo = (e) =>{
      setPasswordTwo(e.target.value)

    }
    
    
    const verifyCreds = () =>{
      if(!email.includes('@') || !email.includes('.')){
        return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,'Provide a valid email', 'Try Again')
      }
      if(password !== passwordTwo){
        return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,'Passwords do not match', 'Try Again')
      }
      return setCurrent(current += 1)
    }

    const getAmount = (e) =>{
    let total = (e.target.value/0.15).toFixed(2)
    setUsd(e.target.value)
    setDisplay(total)
    setAmount(e.target.value)
    }


    const makePayment = async token =>{
    const body = {token, amount:amount, password:password}
    const headers = {
    "Content-Type":"application/json"
    }

    try{

      let res = await fetch(`http://localhost:4000/payment-register`,
      {
        method:"POST",
        headers,
        body:JSON.stringify(body)
      }
      )
      
      if(res.ok){
        res = await res.json()
        props.notification("register-pay")
        localStorage.setItem('loggedIn','true')
        localStorage.setItem('jwt',res.jwt)
        localStorage.setItem('name',res.name)
        navigate('/')
      }else{
        let data = await res.json()
        return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,data.error, 'Try Again')
      }
    }catch(e){
      console.log(e)
    }

  }

  async function checkLoggedIn(){
    // check if logged in local storage
    if(loggedIn === true){
      navigate('/dashboard')
    }
    if(localStorage.getItem('loggedIn') !== null){
        setLoggedIn(true)
    }else setLoading(false)
    
  }
 

  useEffect(()=>{
    checkLoggedIn()
    
  },[loggedIn])

      return (
        loading ? <Spin><div className="content" style={{margin:"20px"}} /></Spin> :  <>
          
        <div data-w-id="2fc6eb50-7d4a-7800-2204-b951b846909b" className="section hero hp-hero wf-section"> 
        <div className="basic-nav"></div>
        {contextHolder}
        <div className="content-container">
          <div className="steps-container">
            <div className="filled-step-container">
              <div className="number-container">
                <div>
                {current === 1 &&'1'}
                {current === 2 &&'2'}
                {current === 3 &&'3'}
                </div>
              </div>
              <div className="green-text">
                {current === 1 &&'Stripe'}
                {current === 2 &&'Create Account'}
                {current === 3 &&'Purchase Tempest token'}
              </div>
            </div>
            <div className="outline-step-container">
            </div>
          </div>
          <div className={styles.theHelp}>
           {current === 1 && <Introduction/>} 
           {current === 2 && <InputContent email={setEm} pass={setPass} passTwo={setPassTwo}/>}
           {current === 3 &&
            <>
            <div className="images-container"><img src="/stripe-logo.png" loading="lazy" sizes="(max-width: 479px) 100vw, 83.890625px" srcset="/stripe-logo-p-500.png 500w, /stripe-logo.png 616w" alt="" className="logo-images"/>
            <div>+</div><img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
          </div>
          <div className="title-text">Get Your Tokens</div>
          <div className="light-blue-container _15-margin-top"><img src="images/coin-small_1coin-small.png" loading="lazy" alt="" className="coin-icon"/>
            <div className="h3">{display}</div>
            <div className="h3">TMPST Tokens</div>
          </div>
          <div className="_350-width grey">It is currently presale making the price of each tempest token $0.15. When presale ends the price for a Tempest token will be $0.25. </div>
          <div className="form-block w-form">
          <h4>Dollar amount </h4>
            <input style={{marginTop:40}} type="number" onChange={(e)=>getAmount(e)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
            <StripeCheckout
            email={email}
            name=""
            stripeKey={process.env.REACT_APP_OPEN_KEY}
            token={makePayment}
            amount={amount*100}
            billingAddress
            ><button type="primary" data-wait="Please wait..." className="form-btn w-button">Buy Tempest</button> 
            </StripeCheckout> 
          </div>
            </>}
            <Row>
          <Button hidden={current === 1} type='primary' onClick={()=>setCurrent(current -= 1)}>previous</Button>
          <Button style={{left:'10%'}} hidden={current === 3 && true} type='primary' onClick={current === 2 ? ()=> verifyCreds() : ()=> setCurrent(current += 1) }>{current === 2 ? 'Signup': 'Next' }</Button>
            </Row>
          </div>
        </div>
    
      
        </div>
        </>
      )

  }


  export default RegisterPay