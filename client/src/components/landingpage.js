import React from "react";
import { useState, useEffect } from "react";
import {Spin} from 'antd'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const LandingPage = () =>{
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

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
    setLoading(false)
  },[loggedIn])
 
    return(
      loading ? <Spin/> :
          <div data-w-id="2fc6eb50-7d4a-7800-2204-b951b846909b" className="section hero hp-hero wf-section">

      <div className="content-container">
        <div className="steps-container">
          <div className="outline-step-container">
            <div>Login or create an account</div>
          </div>
        </div>
        <div className="inner-container">
          <div className="title-text">Buy Now, Save Tomorrow</div>
          <div className="_350-width grey">Choose one of the options below to start.</div>
          <div className="_30-margin-top">
            <a href="#" className="button-1 w-inline-block">
              <div className="icon-embed w-embed"><svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 0C1.11875 0 0 1.11875 0 2.5V11.5C0 12.8813 1.11875 14 2.5 14H13.5C14.8813 14 16 12.8813 16 11.5V4.5C16 3.11875 14.8813 2 13.5 2H3.5C3.225 2 3 2.225 3 2.5C3 2.775 3.225 3 3.5 3H13.5C14.3281 3 15 3.67188 15 4.5V11.5C15 12.3281 14.3281 13 13.5 13H2.5C1.67188 13 1 12.3281 1 11.5V2.5C1 1.67188 1.67188 1 2.5 1H14.5C14.775 1 15 0.775 15 0.5C15 0.225 14.775 0 14.5 0H2.5ZM12 8.75C12.1989 8.75 12.3897 8.67098 12.5303 8.53033C12.671 8.38968 12.75 8.19891 12.75 8C12.75 7.80109 12.671 7.61032 12.5303 7.46967C12.3897 7.32902 12.1989 7.25 12 7.25C11.8011 7.25 11.6103 7.32902 11.4697 7.46967C11.329 7.61032 11.25 7.80109 11.25 8C11.25 8.19891 11.329 8.38968 11.4697 8.53033C11.6103 8.67098 11.8011 8.75 12 8.75Z" fill="white"></path>
                </svg></div>
              <div>Connect wallet</div>
            </a>
            <div className="_350-width grey _15-top-bottom">or</div>
              <Link style={{textDecoration: 'none'}} to={"/login"}>
            <a href="/login"  className="button-1 green w-inline-block">
              <div className="icon-embed w-embed"><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 1C1.44687 1 1 1.44687 1 2V3.24687L7.1125 7.72812C7.64062 8.11562 8.35938 8.11562 8.8875 7.72812L15 3.24687V2C15 1.44687 14.5531 1 14 1H2ZM1 4.4875V10C1 10.5531 1.44687 11 2 11H14C14.5531 11 15 10.5531 15 10V4.4875L9.47812 8.53438C8.59687 9.17813 7.4 9.17813 6.52187 8.53438L1 4.4875ZM0 2C0 0.896875 0.896875 0 2 0H14C15.1031 0 16 0.896875 16 2V10C16 11.1031 15.1031 12 14 12H2C0.896875 12 0 11.1031 0 10V2Z" fill="black"></path>
                </svg></div>
              <div>Sign in with email</div>
            </a>
              </Link>

          </div>
          <div className="_350-width grey _30-margin-top">Don&#x27;t have an account yet? <Link to={"/register"} > <a href="/register">Sign up</a>.</Link></div>
        </div>
      </div>
    </div>
    )

}

export default LandingPage