import React from "react";
import {useState, useEffect} from "react"
import { Button, Row, Spin } from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import styles from '../payment.module.css'
import { useNavigate } from "react-router-dom";
const Register = (props) =>{
  const navigate = useNavigate()
    const [name, setName] = useState('')
    const [loggedIn, setLoggedIn] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false)
    const openNotification = async(placement, icon, message, title ) => {
        api.open({
            message: title,
            description:message,
            placement:placement,
            icon:(
                icon
                ),
            });
          };
    
    async function createAccount(){
      const body = { name:name ,email:email, password:password}
      const headers = {"Content-Type":"application/json"}
        setLoading(true)
         let res = await fetch(`https://tempestapi.onrender.com/register`,
          {
            method:"POST",
            headers,
            body:JSON.stringify(body)
          })
          
          if(res.ok){
            props.notification("register")
            res = await res.json()
            localStorage.setItem('jwt',res.jwt)
            localStorage.setItem('name',res.name)
            localStorage.setItem('loggedIn','true')
            return navigate('/dashboard')
          }else{
            let error = await res.json()
            setLoading(false)
            return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,error.message, 'Try Again')
          }
          
    }          
       
    const verifyCreds = () =>{
    if(!email.includes('@') || !email.includes('.')){
      return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,'Provide a valid email', 'Try Again')
    }
    if(name === ''){
      return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,'Provide a valid name', 'Try Again')
    }
    if(password !== passwordTwo){
      return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,'Passwords do not match', 'Try Again')
    }
    return createAccount()
  }

  async function checkLoggedIn(){
    // check if logged in local storage
    if(loggedIn === true){
      navigate('/dashboard')
    }
    if(localStorage.getItem('loggedIn') !== null){
        setLoggedIn(true)
    }
    
  }

  useEffect(()=>{
    checkLoggedIn()
    
  },[loggedIn])

    return(
       <> 
         <div data-w-id="2fc6eb50-7d4a-7800-2204-b951b846909b" className="section hero hp-hero wf-section">
        <div className="basic-nav"></div>
        {contextHolder}
        <div className="content-container">
          <div className="steps-container">
            <div className="filled-step-container">
              <div className="number-container">
                <div>
                Create Account
                </div>
              </div>
              <div className="green-text">
              </div>
            </div>
            <div className="outline-step-container"></div>
          </div>
          <div className={styles.theHelp}>
    <div className="images-container">
     <img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
    </div>
    <div className="title-text">Create account</div>
    <div className="_350-width grey">Ensure this email address is one you use, as this is how you will access your tokens in the future.</div>
    {loading ? <Spin><div className="content" style={{marginTop:"90px"}} /></Spin> :  <>
    <div className="form-block w-form">
      <form id="email-form" name="email-form" data-name="Email Form" method="get">
        <h4>Full Name</h4>
        <input type="name" onChange={(e)=>setName(e.target.value)} className="form-input w-input" maxLength="256" name="email" data-name="Email" placeholder="John Doe" id="email" required=""/>
        <h4>Email</h4>
        <input type="email" onChange={(e)=>setEmail(e.target.value)} className="form-input w-input" maxLength="256" name="email" data-name="Email" placeholder="john@email.com" id="email" required=""/>
        <h4>Password</h4>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
        <h4>Re-type Password</h4>
        <input type="password" onChange={(e)=>setPasswordTwo(e.target.value)} className="form-input w-input" maxLength="256" name="email" data-name="Email" id="email" required=""/>
      </form>  
    </div>
        <Row>
        <Button style={{left:'10%'}} type='primary' onClick={verifyCreds}>Register</Button> 
        </Row>
  </>}
          </div>
        </div>
        </div>
        </>
    )
}

export default Register