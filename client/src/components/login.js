import React, { useEffect } from "react";
import {useState} from 'react'
import styles from '../payment.module.css'
import { Button, Row, Spin } from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import { useNavigate } from "react-router-dom";
const Login = (props) =>{
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
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    
  async function checkLoggedIn(){
    // check if logged in local storage
    if(loggedIn === true){
      navigate('/dashboard')
    }
    if(localStorage.getItem('loggedIn') !== null){
        setLoggedIn(true)
    }else{
      setLoading(false)
    }


  }


  async function getUser(){

        const body = { email:email, password:password}
        const headers = {
        "Content-Type":"application/json"
        }
          setLoading(true)
          fetch(`https://tempestapi.onrender.com/login`,
          {
            method:"POST",
            headers,
            body:JSON.stringify(body)
          }).then(res=>{
            if(res.ok){
              return res.json()
            }else{
              throw new Error("Email or Password incorrect")
            }
            
          }).then(data => {
            props.notification('login')
            if(data){
              localStorage.setItem('jwt',data.jwt)
              localStorage.setItem('loggedIn', 'true')
              localStorage.setItem('name',data.name)
              navigate('/dashboard')
            }
          }).catch(e=>{
            if(e){
              setLoading(false)
               openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,e.message, 'Try Again')
               
            }
          })
  }

  useEffect(()=>{
    checkLoggedIn()
    
  },[loggedIn])
    

    return(

        <>
      <div data-w-id="2fc6eb50-7d4a-7800-2204-b951b846909b" className="section hero hp-hero wf-section">
        <div className="basic-nav"></div>
      {contextHolder}
        <div className="content-container" hidden={loggedIn}>
          <div className="steps-container">
            <div className="filled-step-container">
              <div className="number-container">
                <div>
                  View Dashboard
                </div>
              </div>
              <div className="green-text"></div>
            </div>
            <div className="outline-step-container"></div>
          </div>
          <div className={styles.theHelp}>
          <div className="images-container">
            <img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
          </div>
      <div className="title-text">Login</div>
      <div className="_350-width grey">Enter your email and password to view your Dashboard.</div>
      {loading ? <Spin><div className="content" style={{marginBottom:"120px", marginTop:"120px"}} /></Spin> : 
      <>
      <div className="form-block w-form">
      <form id="email-form" name="email-form" data-name="Email Form" method="get">
      
    
        <h4>Email</h4>
        <input type="email" onChange={(e)=>setEmail(e.target.value)} className="form-input w-input" maxLength="256" name="email" data-name="Email" placeholder="john@email.com" id="email" required=""/>
        <h4>Password</h4>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
      </form>  
      </div>
        <Row>
          <a href="/">
            <Button  type='primary' onClick={()=>window.location('/')}>Back</Button>
          </a>
          <Button style={{left:'10%'}}  type='primary' onClick={getUser}>Login</Button>
        </Row>
      </>}
          </div>
        </div> 
        
     </div>
    </>
    )
}

export default Login