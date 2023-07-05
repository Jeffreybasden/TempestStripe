import React from "react";
import { useState, useEffect } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () =>{
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [bigSpin, setBigSpin] = useState(true)
    const [name,setName] = useState('')
    const [balance, setBalance] = useState(0)
    const [staked,setStaked] = useState(0)
    const [cost,setCost] = useState(0)
    const [marketValue, setMarketValue] = useState(0)
    const [currentAPY, setCurrentAPY] = useState('10%')
    const [ExpectedRewards, setExpectedRewards] = useState(0)
    
    //get user info if its a wallet
    async function getWalletInfo(){
      const address = localStorage.getItem('wallet')
    }


    async function getUserInfo(){
      const jwt = localStorage.getItem('jwt')
      //https://tempestapi.onrender.com
      fetch('http://localhost:4000/get-user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          getUserInfo()
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          // Process the response data
          let Balance = (data.purchase_amount/ 100)/(.15)
          let Cost = Balance *.15
          let Market = Balance*.15
          let Expected = (Market * 1.1)/12
          setName(data.name)
          setBalance(Balance)
          setCost(Cost)
          setMarketValue(Market)
          setExpectedRewards(Expected)
          setLoading(false)
        })
        .catch(error => {
          // Handle the error
       
          console.error('Error:', error);
          
        });
    }
    
    async function checkLoggedIn(){
      // check if logged in local storage
      if(localStorage.getItem('loggedIn') !== null){
        setBigSpin(false)
        if(localStorage.getItem("jwt") === null){
          const address = localStorage.getItem('wallet')
          return getWalletInfo()
          
        }else{
          
          return getUserInfo()
        }
      }else{
        return navigate('/')
      }
  
      
    }

    useEffect(()=>{
      checkLoggedIn()
    },[])
      
    

    return(
      bigSpin ? <Spin><div className="content" style={{margin:"20px"}} /></Spin> :
        <>                                                      {/*staking and bond page must have this class name or it will break*/}
        <div data-w-id="2fc6eb50-7d4a-7800-2204-b951b846909b" className="section wf-section">
        <div className="grid">
          <div id="w-node-_1f24ada2-6789-b07c-d844-ae0ba2fb5856-d68700ca" className="box vertical">
            <div className="grey">Welcome back, <span id="user-name" className="person-name">{name}</span>!</div>
            <div className="h1 _10-margin-top">Your Current Balance:</div>
            {loading ? <Spin><div className="content" style={{margin:"20px"}} /></Spin>:<>
            <div className="light-blue-container _15-margin-top"><img src="images/coin-small_1coin-small.png" loading="lazy" alt="" className="coin-icon"/>
              <div className="h3">{balance.toFixed(2)}</div>
              <div className="h3">TMPST Tokens</div>
            </div>
            </>}
            <Link to={'/pay'}>
            <a   className="button-1 _15-margin-top w-inline-block">
              <div><img src="https://uploads-ssl.webflow.com/6421d264d066fd2b24b91b20/6446ac737eb6c0523ebcdbef_coin-small.png" loading="lazy" alt="" className="coin-button-image"/></div>
              <div>Buy Now</div>
            </a>
            </Link>
          </div>
          <div id="w-node-_66da84e9-2422-9fe0-23a9-ae78aee4c7a9-d68700ca" className="box chart-container" hidden={true}></div>
          <div id="w-node-_59f9c4a8-fdb3-f510-a4e3-9e9afd902861-d68700ca" className="box no-bg vertical">
            <div className="question">
              <div>?</div>
            </div>
            <div className="grey _375-width">If you have any questions, please feel free to reach out to our support team. We’d be happy to assist you!</div>
            <a href="http://contribute.tmpst.io" target="_blank" className="button-1 _15-margin-top outline grey w-inline-block">
              <div className="icon-1 w-embed"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 1.125C11.0886 1.125 13.0916 1.95468 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95468 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95468 4.90838 3.43153 3.43153C4.90838 1.95468 6.91142 1.125 9 1.125ZM9 18C11.3869 18 13.6761 17.0518 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C13.6761 0.948212 11.3869 0 9 0C6.61305 0 4.32387 0.948212 2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9C0 11.3869 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18ZM7.3125 12.375C7.00313 12.375 6.75 12.6281 6.75 12.9375C6.75 13.2469 7.00313 13.5 7.3125 13.5H10.6875C10.9969 13.5 11.25 13.2469 11.25 12.9375C11.25 12.6281 10.9969 12.375 10.6875 12.375H9.5625V8.4375C9.5625 8.12813 9.30937 7.875 9 7.875H7.59375C7.28438 7.875 7.03125 8.12813 7.03125 8.4375C7.03125 8.74687 7.28438 9 7.59375 9H8.4375V12.375H7.3125ZM9 6.46875C9.22378 6.46875 9.43839 6.37986 9.59662 6.22162C9.75486 6.06339 9.84375 5.84878 9.84375 5.625C9.84375 5.40122 9.75486 5.18661 9.59662 5.02838C9.43839 4.87014 9.22378 4.78125 9 4.78125C8.77622 4.78125 8.56161 4.87014 8.40338 5.02838C8.24514 5.18661 8.15625 5.40122 8.15625 5.625C8.15625 5.84878 8.24514 6.06339 8.40338 6.22162C8.56161 6.37986 8.77622 6.46875 9 6.46875Z" fill="currentColor"></path>
                </svg></div>
              <div>Get in touch</div>
            </a>
          </div>
        </div>
        
        <div className="divider-line"></div>
        <div className="grid _4-column">
          <div id="w-node-_2610ec14-d57b-15f7-a21e-8e5d06519635-d68700ca" className="box vert-center">
            <div className="horizontal-container">
              <div className="vert-content-container">
                <div className="icon-bg">
                  <div className="icon-2 w-embed"><svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.31147 1.14235H18.4917C19.131 1.14235 19.6475 1.65284 19.6475 2.2847V4.76932C20.0159 4.62653 20.4095 4.5587 20.8032 4.56941V2.2847C20.8032 1.02455 19.7667 0 18.4917 0H2.31147C1.03655 0 0 1.02455 0 2.2847V11.4235C0 12.6837 1.03655 13.7082 2.31147 13.7082H11.9257L12.2147 12.5659H2.31147C1.6722 12.5659 1.15573 12.0554 1.15573 11.4235V2.2847C1.15573 1.65284 1.6722 1.14235 2.31147 1.14235ZM4.04507 7.99647C3.72724 7.99647 3.4672 8.2535 3.4672 8.56764C3.4672 8.88179 3.72724 9.13882 4.04507 9.13882H13.2909C13.6088 9.13882 13.8688 8.88179 13.8688 8.56764C13.8688 8.2535 13.6088 7.99647 13.2909 7.99647H4.04507ZM3.4672 5.14059C3.4672 5.45473 3.72724 5.71176 4.04507 5.71176H16.7581C17.076 5.71176 17.336 5.45473 17.336 5.14059C17.336 4.82644 17.076 4.56941 16.7581 4.56941H4.04507C3.72724 4.56941 3.4672 4.82644 3.4672 5.14059ZM21.0488 7.1397L21.6772 7.76086C21.9011 7.98219 21.9011 8.34631 21.6772 8.56764L20.7815 9.45297L19.3369 8.02503L20.2326 7.1397C20.4565 6.91837 20.8249 6.91837 21.0488 7.1397ZM14.6814 12.6266L18.517 8.83538L19.9617 10.2633L16.1225 14.0545C16.0466 14.1295 15.9563 14.1795 15.8552 14.2044L14.0855 14.6435L14.5297 12.8943C14.555 12.7943 14.6092 12.7015 14.6814 12.6301V12.6266ZM19.4127 6.33292L13.8616 11.8198C13.6377 12.0411 13.4824 12.316 13.4065 12.6159L12.7311 15.2897C12.6806 15.486 12.7383 15.6895 12.8828 15.8323C13.0273 15.9751 13.2331 16.0322 13.4318 15.9822L16.1369 15.3147C16.4403 15.2397 16.7184 15.0826 16.9423 14.8649L22.4935 9.37443C23.1688 8.70687 23.1688 7.62163 22.4935 6.9505L21.865 6.32935C21.1897 5.66178 20.0917 5.66178 19.4127 6.32935V6.33292Z" fill="#0000FF"></path>
                    </svg></div>
                </div>
                <div className="_12-pt _10-margin-top _25px-height">Your Staked TMPST</div>
                <> {loading ? <Spin size="small"><div className="content" style={{margin:"20px"}} /></Spin>:
                
                <div className="blue _20-margin-top">
                  {staked}
                </div>
                }
                </>
              </div>
              <div className="vert-content-container">
                <div className="icon-bg">
                  <div className="icon-2 w-embed"><svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.16667 5.42955C2.45365 5.42955 3.5 4.40495 3.5 3.14471V3.12686C2.82552 3.07688 2.1474 2.96978 1.46562 2.78771C1.38542 2.76629 1.28698 2.78057 1.21406 2.83055C1.18125 2.85197 1.17031 2.86982 1.16667 2.87339V2.87696V5.42955ZM1.16667 12.2841V13.937C1.16667 14.1798 1.30156 14.3083 1.39271 14.3404C2.08906 14.5975 2.78906 14.7474 3.5 14.8117V14.5689C3.5 13.3087 2.45365 12.2841 1.16667 12.2841ZM1.16667 11.1417C3.09896 11.1417 4.66667 12.6768 4.66667 14.5689V14.8545C6.29635 14.8188 7.98802 14.4368 9.81823 13.9799C9.975 13.9406 10.1318 13.9013 10.2922 13.862C12.1807 13.3872 14.2297 12.8767 16.3333 12.841C16.3406 10.956 17.9047 9.42803 19.8333 9.42803V4.85834C17.901 4.85834 16.3333 3.32322 16.3333 1.43108V1.14548C14.7036 1.18118 13.012 1.56317 11.1818 2.02014C11.025 2.05941 10.8682 2.09868 10.7078 2.13796C8.81927 2.61277 6.77031 3.12329 4.66667 3.15899C4.65937 5.04399 3.09531 6.57197 1.16667 6.57197V11.1417ZM19.5344 13.2123C19.6146 13.2337 19.713 13.2194 19.7859 13.1695C19.8188 13.148 19.8297 13.1302 19.8333 13.1266C19.8333 13.1266 19.8333 13.1266 19.8333 13.123V10.5704C18.5464 10.5704 17.5 11.5951 17.5 12.8553V12.8731C18.1745 12.9231 18.8526 13.0302 19.5344 13.2123ZM17.5 1.43108C17.5 2.69131 18.5464 3.71592 19.8333 3.71592V2.06298C19.8333 1.82022 19.6984 1.6917 19.6073 1.65957C18.9109 1.40252 18.2109 1.25258 17.5 1.18832V1.43108ZM0 13.937V2.87696C0 2.02371 0.933333 1.45964 1.77552 1.68456C4.6849 2.46283 7.59427 1.73811 10.5 1.00981C13.6719 0.217261 16.8438 -0.575293 20.0156 0.584977C20.6318 0.809891 21 1.41323 21 2.05941V13.123C21 13.9763 20.0667 14.5404 19.2245 14.3154C16.3151 13.5372 13.4057 14.2619 10.5 14.9902C7.32812 15.7827 4.15625 16.5753 0.984375 15.415C0.368229 15.1901 0 14.5868 0 13.9406L0 13.937ZM8.16667 8C8.16667 9.67793 9.30781 10.8561 10.5 10.8561C11.6922 10.8561 12.8333 9.67793 12.8333 8C12.8333 6.32207 11.6922 5.14395 10.5 5.14395C9.30781 5.14395 8.16667 6.32207 8.16667 8ZM10.5 4.00153C12.5271 4.00153 14 5.89366 14 8C14 10.1063 12.5271 11.9985 10.5 11.9985C8.47292 11.9985 7 10.1063 7 8C7 5.89366 8.47292 4.00153 10.5 4.00153Z" fill="#0000FF"></path>
                    </svg></div>
                </div>
                <div className="_12-pt _10-margin-top _25px-height">Cost Basis</div>
                <> {loading ? <Spin size="small"><div className="content" style={{margin:"20px"}} /></Spin>:
                
                <div className="blue _20-margin-top">
                  ${cost.toFixed(2)}
                </div>
                }
                </>
              </div>
              <div className="vert-content-container">
                <div className="icon-bg">
                  <div className="icon-2 w-embed"><svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.97421 0.00165435C8.4704 0.00165435 8.94706 0.206573 9.29869 0.568194L16.0461 7.50329C17.0229 8.50779 17.0229 10.1351 16.0461 11.1396L10.8341 16.5036C9.85739 17.5081 8.27505 17.5081 7.2983 16.5036L0.550889 9.56855C0.199258 9.20693 0 8.71673 0 8.20644V1.9303C0 0.865528 0.840008 0.00165435 1.87537 0.00165435H7.97421ZM1.43387 8.65646L8.18129 15.5956C8.66966 16.0978 9.46279 16.0978 9.95116 15.5956L15.1631 10.2315C15.6515 9.72927 15.6515 8.91361 15.1631 8.41136L8.41571 1.47627C8.2985 1.35573 8.13831 1.28742 7.97421 1.28742H1.87537C1.53155 1.28742 1.25024 1.57672 1.25024 1.9303V8.20242C1.25024 8.37118 1.31666 8.53592 1.43387 8.65646ZM12.0492 0.198537C12.2876 -0.0586158 12.6822 -0.0666519 12.9322 0.178447L18.4528 5.60277C20.5157 7.62785 20.5157 11.015 18.4528 13.0401L13.5847 17.8216C13.3346 18.0667 12.94 18.0586 12.7017 17.8015C12.4634 17.5443 12.4712 17.1385 12.7212 16.8934L17.5894 12.112C19.1366 10.5931 19.1366 8.05376 17.5894 6.53495L12.0688 1.11063C11.8187 0.865528 11.8109 0.459708 12.0492 0.202555V0.198537ZM4.06329 3.21607C4.31198 3.21607 4.55049 3.31766 4.72634 3.49851C4.90219 3.67936 5.00098 3.92464 5.00098 4.18039C5.00098 4.43614 4.90219 4.68142 4.72634 4.86227C4.55049 5.04312 4.31198 5.14471 4.06329 5.14471C3.8146 5.14471 3.5761 5.04312 3.40025 4.86227C3.2244 4.68142 3.12561 4.43614 3.12561 4.18039C3.12561 3.92464 3.2244 3.67936 3.40025 3.49851C3.5761 3.31766 3.8146 3.21607 4.06329 3.21607Z" fill="#0000FF"></path>
                    </svg></div>
                </div>
                <div className="_12-pt _10-margin-top _25px-height">Market Value</div>
                <> {loading ? <Spin size="small"><div className="content" style={{margin:"20px"}} /></Spin>:
                
                <div className="blue _20-margin-top">
                  ${marketValue.toFixed(2)}
                </div>
                }
                </>
              </div>
              <div className="vert-content-container">
                <div className="icon-bg">
                  <div className="icon-2 w-embed"><svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.2774 0C12.0177 0 11.8052 0.225 11.8052 0.5C11.8052 0.775 12.0177 1 12.2774 1H14.4085L9.89255 5.34688L5.95512 2.10625C5.78983 1.96875 5.55666 1.96562 5.38842 2.09687L0.193605 6.09688C-0.0159586 6.25938 -0.0631842 6.57188 0.0902989 6.79688C0.243782 7.02187 0.538942 7.06875 0.751457 6.90625L5.65701 3.125L9.62691 6.39375C9.80696 6.54375 10.0637 6.53125 10.2349 6.36875L15.111 1.675V4C15.111 4.275 15.3235 4.5 15.5832 4.5C15.843 4.5 16.0555 4.275 16.0555 4V0.5C16.0555 0.225 15.843 0 15.5832 0H12.2774ZM6.13812 13.5C6.13812 13.775 5.92561 14 5.66587 14C5.40613 14 5.19361 13.775 5.19361 13.5V8.5C5.19361 8.225 5.40613 8 5.66587 8C5.92561 8 6.13812 8.225 6.13812 8.5V13.5ZM5.66587 7C4.88369 7 4.2491 7.67188 4.2491 8.5V13.5C4.2491 14.3281 4.88369 15 5.66587 15C6.44804 15 7.08263 14.3281 7.08263 13.5V8.5C7.08263 7.67188 6.44804 7 5.66587 7ZM2.36008 13.5C2.36008 13.775 2.14756 14 1.88782 14C1.62808 14 1.41557 13.775 1.41557 13.5V11.5C1.41557 11.225 1.62808 11 1.88782 11C2.14756 11 2.36008 11.225 2.36008 11.5V13.5ZM1.88782 10C1.10565 10 0.471055 10.6719 0.471055 11.5V13.5C0.471055 14.3281 1.10565 15 1.88782 15C2.66999 15 3.30459 14.3281 3.30459 13.5V11.5C3.30459 10.6719 2.66999 10 1.88782 10ZM9.44391 11.5C9.44391 10.5717 9.7922 9.6815 10.4122 9.02513C11.0321 8.36875 11.8729 8 12.7497 8C13.6264 8 14.4673 8.36875 15.0872 9.02513C15.7072 9.6815 16.0555 10.5717 16.0555 11.5C16.0555 12.4283 15.7072 13.3185 15.0872 13.9749C14.4673 14.6313 13.6264 15 12.7497 15C11.8729 15 11.0321 14.6313 10.4122 13.9749C9.7922 13.3185 9.44391 12.4283 9.44391 11.5ZM17 11.5C17 10.3065 16.5522 9.16193 15.7551 8.31802C14.958 7.47411 13.8769 7 12.7497 7C11.6224 7 10.5414 7.47411 9.74428 8.31802C8.9472 9.16193 8.4994 10.3065 8.4994 11.5C8.4994 12.6935 8.9472 13.8381 9.74428 14.682C10.5414 15.5259 11.6224 16 12.7497 16C13.8769 16 14.958 15.5259 15.7551 14.682C16.5522 13.8381 17 12.6935 17 11.5ZM12 12.2937C11.8931 12.1919 11.8069 12.068 11.7466 11.9297C11.6864 11.7914 11.6533 11.6416 11.6496 11.4894C11.6458 11.3371 11.6713 11.1856 11.7246 11.0442C11.7779 10.9027 11.8578 10.7742 11.9595 10.6666C12.0613 10.5589 12.1826 10.4742 12.3162 10.4178C12.4498 10.3614 12.5929 10.3343 12.7367 10.3384C12.8805 10.3424 13.022 10.3773 13.1526 10.4411C13.2832 10.5049 13.4002 10.5962 13.4965 10.7094C13.6034 10.8113 13.6896 10.9351 13.7498 11.0734C13.8101 11.2117 13.8431 11.3615 13.8469 11.5138C13.8507 11.666 13.8251 11.8175 13.7718 11.9589C13.7185 12.1004 13.6386 12.2289 13.5369 12.3366C13.4352 12.4443 13.3138 12.5289 13.1802 12.5853C13.0466 12.6417 12.9036 12.6688 12.7598 12.6648C12.616 12.6608 12.4744 12.6258 12.3438 12.562C12.2132 12.4982 12.0962 12.407 12 12.2937ZM11.7048 13.3125C12.3424 13.725 13.1541 13.725 13.7916 13.3125L14.0661 13.6031C14.2491 13.7969 14.5502 13.7969 14.7332 13.6031C14.9162 13.4094 14.9162 13.0906 14.7332 12.8969L14.4587 12.6062C14.8483 11.9312 14.8483 11.0719 14.4587 10.3969L14.7332 10.1062C14.9162 9.9125 14.9162 9.59375 14.7332 9.4C14.5502 9.20625 14.2491 9.20625 14.0661 9.4L13.7916 9.69063C13.1541 9.27812 12.3424 9.27812 11.7048 9.69063L11.4303 9.4C11.2473 9.20625 10.9463 9.20625 10.7633 9.4C10.5803 9.59375 10.5803 9.9125 10.7633 10.1062L11.0378 10.3969C10.6482 11.0719 10.6482 11.9312 11.0378 12.6062L10.7633 12.8969C10.5803 13.0906 10.5803 13.4094 10.7633 13.6031C10.9463 13.7969 11.2473 13.7969 11.4303 13.6031L11.7048 13.3125Z" fill="#0000FF"></path>
                    </svg></div>
                </div>
                <div className="_12-pt _10-margin-top _25px-height">Current APY</div>
                <> {loading ? <Spin size="small"><div className="content" style={{margin:"20px"}} /></Spin>:
                
                <div className="blue _20-margin-top">
                  {currentAPY}
                </div>
                }
                </>
              </div>
              <div className="vert-content-container">
                <div className="icon-bg">
                  <div className="icon-2 w-embed"><svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.22222 1.07143V7.5H6.33333V6.42857C6.33333 5.24665 7.28004 4.28571 8.44444 4.28571H10.5556C11.72 4.28571 12.6667 5.24665 12.6667 6.42857V7.5H14.7778V1.07143H4.22222ZM10.5556 11.7857H8.44444C7.28004 11.7857 6.33333 10.8248 6.33333 9.64286V8.57143H4.22222V13.9286H14.7778V8.57143H12.6667V9.64286C12.6667 10.8248 11.72 11.7857 10.5556 11.7857ZM3.16667 1.25558C1.93628 1.6942 1.05556 2.88616 1.05556 4.28571V7.5H3.16667V1.25558ZM1.05556 8.57143V13.3929C1.05556 13.6875 1.29306 13.9286 1.58333 13.9286H3.16667V8.57143H1.05556ZM15.8333 13.9286H17.4167C17.7069 13.9286 17.9444 13.6875 17.9444 13.3929V8.57143H15.8333V13.9286ZM17.9444 7.5V4.28571C17.9444 2.88616 17.0637 1.6942 15.8333 1.25558V7.5H17.9444ZM0 4.28571C0 1.91853 1.8901 0 4.22222 0H14.7778C17.1099 0 19 1.91853 19 4.28571V13.3929C19 14.2801 18.2908 15 17.4167 15H1.58333C0.709201 15 0 14.2801 0 13.3929V4.28571ZM10.5556 5.35714H8.44444C7.86059 5.35714 7.38889 5.83594 7.38889 6.42857V9.64286C7.38889 10.2355 7.86059 10.7143 8.44444 10.7143H10.5556C11.1394 10.7143 11.6111 10.2355 11.6111 9.64286V6.42857C11.6111 5.83594 11.1394 5.35714 10.5556 5.35714ZM10.0278 6.96429V9.10714C10.0278 9.40179 9.79028 9.64286 9.5 9.64286C9.20972 9.64286 8.97222 9.40179 8.97222 9.10714V6.96429C8.97222 6.66964 9.20972 6.42857 9.5 6.42857C9.79028 6.42857 10.0278 6.66964 10.0278 6.96429Z" fill="#0000FF"></path>
                    </svg></div>
                </div>
                <div className="_12-pt _10-margin-top _25px-height">Expected<br/>Rewards (1 mo.)</div>
                <> {loading ? <Spin size="small"><div className="content" style={{margin:"20px"}} /></Spin>:
                
                <div className="blue _20-margin-top">
                  ${ExpectedRewards.toFixed(2)}
                </div>
                }
                </>
              </div>
            </div>
          </div>
          <div id="w-node-bfb693f9-adfc-dd73-0fce-9d4b0f8b2341-d68700ca" className="box no-bg no-padding-bottom">
            <div className="h1">Your Impact So Far</div>
            <div className="horizontal-container _10-margin-top">
              <div className="light-blue-box">
                <div className="h1">23%</div>
                <div className="_12-pt _10-margin-top _25px-height">Current Carbon<br/>Offset</div>
              </div>
              <div className="light-blue-box">
                <div className="h1">500K</div>
                <div className="_12-pt _10-margin-top _25px-height">Projected Offset</div>
              </div>
              <div className="light-blue-box">
                <div className="h1">23%</div>
                <div className="_12-pt _10-margin-top _25px-height">Market Value After 5 Years</div>
              </div>
              <div className="light-blue-box">
                <div className="h1">23%</div>
                <div className="_12-pt _10-margin-top _25px-height">Total Impact Over X Years</div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider-line"></div>
        <div className="grid">
          <div id="w-node-cb747eeb-9ba9-c870-5999-50a9b69c9c3b-d68700ca" className="box left">
            <div className="h3 center">Quick links &amp; resources</div>
            <div className="links-container">
              <a href="#" className="grey-link w-inline-block">
                <div>Read the Whitepaper</div>
                <div className="icon-2 _5-margin-left w-embed"><svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.3536 4.85355C17.5488 4.65829 17.5488 4.34171 17.3536 4.14645L14.1716 0.964466C13.9763 0.769204 13.6597 0.769204 13.4645 0.964466C13.2692 1.15973 13.2692 1.47631 13.4645 1.67157L16.2929 4.5L13.4645 7.32843C13.2692 7.52369 13.2692 7.84027 13.4645 8.03553C13.6597 8.2308 13.9763 8.2308 14.1716 8.03553L17.3536 4.85355ZM0 5H17V4H0V5Z" fill="black" fillOpacity="0.5"></path>
                  </svg></div>
              </a>
              <a href="#" className="grey-link w-inline-block">
                <div>Join our community in Discord</div>
                <div className="icon-2 _5-margin-left w-embed"><svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.3536 4.85355C17.5488 4.65829 17.5488 4.34171 17.3536 4.14645L14.1716 0.964466C13.9763 0.769204 13.6597 0.769204 13.4645 0.964466C13.2692 1.15973 13.2692 1.47631 13.4645 1.67157L16.2929 4.5L13.4645 7.32843C13.2692 7.52369 13.2692 7.84027 13.4645 8.03553C13.6597 8.2308 13.9763 8.2308 14.1716 8.03553L17.3536 4.85355ZM0 5H17V4H0V5Z" fill="black" fillOpacity="0.5"></path>
                  </svg></div>
              </a>
              <a href="#" className="grey-link w-inline-block">
                <div>Contact our support team</div>
                <div className="icon-2 _5-margin-left w-embed"><svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.3536 4.85355C17.5488 4.65829 17.5488 4.34171 17.3536 4.14645L14.1716 0.964466C13.9763 0.769204 13.6597 0.769204 13.4645 0.964466C13.2692 1.15973 13.2692 1.47631 13.4645 1.67157L16.2929 4.5L13.4645 7.32843C13.2692 7.52369 13.2692 7.84027 13.4645 8.03553C13.6597 8.2308 13.9763 8.2308 14.1716 8.03553L17.3536 4.85355ZM0 5H17V4H0V5Z" fill="black" fillOpacity="0.5"></path>
                  </svg></div>
              </a>
              <a href="#" className="grey-link w-inline-block">
                <div>Add a new wallet</div>
                <div className="icon-2 _5-margin-left w-embed"><svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.3536 4.85355C17.5488 4.65829 17.5488 4.34171 17.3536 4.14645L14.1716 0.964466C13.9763 0.769204 13.6597 0.769204 13.4645 0.964466C13.2692 1.15973 13.2692 1.47631 13.4645 1.67157L16.2929 4.5L13.4645 7.32843C13.2692 7.52369 13.2692 7.84027 13.4645 8.03553C13.6597 8.2308 13.9763 8.2308 14.1716 8.03553L17.3536 4.85355ZM0 5H17V4H0V5Z" fill="black" fillOpacity="0.5"></path>
                  </svg></div>
              </a>
            </div>
          </div>
          <div id="w-node-f6edf471-c63f-fa70-1e81-3f2cea84095c-d68700ca" className="box vert-center">
            <div className="grid">
              <div id="w-node-_35b5ff1c-ce47-d0e1-188a-8397897ec026-d68700ca" className="relative-image"><img src="images/our-commitment.jpg" loading="lazy" alt="" className="full-image"/></div>
              <div id="w-node-_65520cfc-f471-ae85-0462-ec8ca8e09208-d68700ca" className="content-left _30-margin-left">
                <div className="h1">Our Commitment to 10%</div>
                <div className="_18px grey _375-width _15-margin-top">10% of the energy generated from our New Renewable Energy Resources is dedicated to the Energy Assistance Programs within the jurisdiction of the project&#x27;s location.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider-line"></div>
        <div className="grid _100-margin-top">
          <div id="w-node-_8b003c47-8b31-594d-bd77-567ca5232650-d68700ca">
            <div className="grey center-mobile">© 2023 Tempest Inc. View our <a href="#" className="grey">terms and conditions</a>.</div>
          </div>
          <div id="w-node-_579865f9-8f23-219e-31e0-e163d787d689-d68700ca"></div>
          <a id="w-node-_0bd334f5-29f3-9816-ec08-0a11d1d2f965-d68700ca" href="https://discord.gg/EsStxxTJCk" target="_blank" className="discord-link w-inline-block">
            <div className="small-icon w-embed"><svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.58715 2.91183C6.5291 2.00324 8.60553 1.34291 10.7764 0.966919C11.043 1.44893 11.3545 2.09725 11.5692 2.61299C13.8769 2.26594 16.1633 2.26594 18.4286 2.61299C18.6433 2.09725 18.9618 1.44893 19.2308 0.966919C21.404 1.34291 23.4828 2.00567 25.4248 2.91664C29.3417 8.83565 30.4035 14.6076 29.8726 20.2977C27.2747 22.2377 24.757 23.4163 22.2818 24.1875C21.6706 23.3463 21.1256 22.4522 20.656 21.5099C21.5503 21.1701 22.4068 20.7508 23.2162 20.2639C23.0015 20.1049 22.7914 19.9386 22.5885 19.7675C17.6523 22.0763 12.2889 22.0763 7.41158 19.7675C7.20629 19.9386 6.99631 20.1049 6.78395 20.2639C7.59565 20.7532 8.45452 21.1725 9.3488 21.5123C8.87925 22.4522 8.33654 23.3488 7.72305 24.1898C5.24546 23.4186 2.72543 22.2402 0.127506 20.2977C-0.495438 13.7015 1.19167 7.98249 4.58715 2.91183ZM19.9835 16.7984C21.4653 16.7984 22.6806 15.415 22.6806 13.7304C22.6806 12.0458 21.4913 10.66 19.9835 10.66C18.4757 10.66 17.2606 12.0434 17.2865 13.7304C17.2842 15.415 18.4757 16.7984 19.9835 16.7984ZM10.0166 16.7984C11.4984 16.7984 12.7136 15.415 12.7136 13.7304C12.7136 12.0458 11.5244 10.66 10.0166 10.66C8.50881 10.66 7.2936 12.0434 7.31954 13.7304C7.31954 15.415 8.50881 16.7984 10.0166 16.7984Z" fill="currentColor"></path>
              </svg></div>
            <div>Join our community on Discord</div>
            <div className="button-arrow w-embed"><svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3536 4.35355C18.5488 4.15829 18.5488 3.84171 18.3536 3.64645L15.1716 0.464466C14.9763 0.269204 14.6597 0.269204 14.4645 0.464466C14.2692 0.659728 14.2692 0.976311 14.4645 1.17157L17.2929 4L14.4645 6.82843C14.2692 7.02369 14.2692 7.34027 14.4645 7.53553C14.6597 7.7308 14.9763 7.7308 15.1716 7.53553L18.3536 4.35355ZM0 4.5H18V3.5H0V4.5Z" fill="currentColor"></path>
              </svg></div>
          </a>
        
        </div>
        </div>
        </>
    )

}

export default Dashboard