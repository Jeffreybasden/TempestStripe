import React from "react";
import {useState, useEffect} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Button, Row, Spin , Card, Col} from 'antd'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';
import styles from '../payment.module.css'
import { useNavigate } from "react-router-dom";
import { Space, Table, Tag } from 'antd';




const Coinbase = (props) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingT, setLoadingT] = useState(true)
    const navigate = useNavigate()
    const [payLink, setPayLink] = useState('')
    const [amount, setAmount] = useState('')
    const [wallet, setWallet] = useState(false)
    const [display, setDisplay] = useState(0)
    const [type, setType] = useState(0)
    const [api, contextHolder] = notification.useNotification();
    const [data, setData] = useState()
    const [provideLink, setProvideLink] = useState(false)
    let [transaction, setTransactions] = useState(false)
   
  
    function formatDateToLocalHumanReadable(dateString) {
        const date = new Date(dateString);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        };
      
        return date.toLocaleString(undefined, options);
      }
      
   
    const columns = [
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          
        },
        {
          title: 'Link',
          dataIndex: 'link',
          key: 'link',
          render: (text) => <a href={text} target="_blank">{'link'}</a>,
        },
        {
          title: 'Expires',
          dataIndex: 'expires',
          key: 'expires',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
       
      ];


 async function getTransactions(){
    let name 
    let type
    if(localStorage.getItem('wallet')){
        name = localStorage.getItem('wallet')
        type = 'wallet'
    }else{
        name = localStorage.getItem('jwt')
        type = 'jwt'
    } 
    
    try{
     
        let res = await fetch('https://tempestapi.onrender.com/coinbase-user',{
            method:"POST",
            body:JSON.stringify({name,type}),
            headers:{'Content-Type': 'application/json'}
        })
        if(res.ok){
            res = await res.json()
            console.log(res)
            let tempData = res.reduce((acc,curr)=>{
                let date = formatDateToLocalHumanReadable(curr.expires)
                acc.push({key:curr.key, status:curr.status.status, link:curr.url, expires:date, amount:curr.amount.amount})
                return acc
            },[])
            console.log(tempData)
            setLoadingT(false)
            return setData(tempData)
        }else throw new Error('no info to show')
    }catch(e){
        console.log(e)
        getTransactions()
    }

 }


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
    setDisplay(total)
    setAmount(e.target.value)
  }

  const getLink = async token =>{
    let name 
    let type
    if(localStorage.getItem('wallet')){
        name = localStorage.getItem('wallet')
        type = 'wallet'
    }else{
        name = localStorage.getItem('jwt')
        type = 'jwt'
    } 
    const body = {name, amount:amount, type:type}
    const headers = {
    "Content-Type":"application/json"
    }
  try{
    setLoading(true)
   let res = await fetch(`https://tempestapi.onrender.com/coinbase`,
    {
    method:"POST",
    headers,
    body:JSON.stringify(body)
    })

    if(res.ok){
      setLoading(false)
      res = await res.json()
      setPayLink(res.url)
      props.notification("pay")
      setProvideLink(true)
      
    }else{
      setLoading(false)
      let data = await res.json()
      return openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,data.error, 'Try Again')
    } 
  }catch(e){
      console.log(e.message)
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

const switchHandler = (e) =>{
e.preventDefault()
    if(provideLink){
        setProvideLink(false)
    }
    setTransactions(!transaction)
}

  useEffect(()=>{
    checkLoggedIn()
    getTransactions()
    
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
            {provideLink ? 
            <Card title="Complete Your Purchase">
                <div>
                    <Row>
                    <p>Please click the link below to finalize your purchase. Once the payment is submitted, we kindly request your patience as the transaction may take some time to process.</p>
                    </Row>
                    <Row style={{justifyContent:"center", marginTop:"10px"}}>
                        <a href={payLink} target="_blank">
                        <Button type='primary'>Payment Link</Button>
                        </a>
                    </Row>

                </div>
            </Card> : <>
           {transaction?<Table columns={columns} dataSource={data} loading={loadingT}/> :<>
            <div className="images-container">
           <img src="/coin-small_1coin-small.png" loading="lazy" alt="" className="logo-images"/>
          </div>
          <div className="title-text">Get Your Tokens</div>
          <div className="light-blue-container _15-margin-top"><img src="images/coin-small_1coin-small.png" loading="lazy" alt="" className="coin-icon"/>
            <div className="h3">{display}</div>
            <div className="h3">TMPST Tokens</div>
          </div>
          <div className="_350-width grey">Each Tempest token will be $0.25.</div>
          {loading ? <Spin><div className="content" style={{margin:"80px"}} /></Spin> : <>
          <div className="form-block w-form">
            <h4>Dollar amount </h4>
            <input style={{marginTop:40}} type="number" onChange={(e)=>getAmount(e)} className="form-input w-input" maxLength="256"  required=""/>
            <button type="primary" hidden={transaction} onClick={getLink} data-wait="Please wait..." className="form-btn w-button">Buy Tempest</button>
          </div>
            </>}
           </>}
         </>}
            <button style={{backgroundColor:"#2fab1c"}} onClick={(e)=>switchHandler(e)} type="primary" data-wait="Please wait..." className="form-btn w-button">{transaction ? 'Make a Purchase':'View Previous Transactions'}</button> 
          </div>
        </div>
        </div>
        
        </> 
      )

  }

  export default Coinbase