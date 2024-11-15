
import { Routes, Route, useNavigate} from 'react-router-dom';
import NavBar from './components/navbar';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Login from './components/login'
import Register from './components/register';
import PayWithMetamask from './components/paywithmetamask';
import Coinbase from './components/coinbase';
import PayWithStripe from './components/paywithstripe';

import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { notification, Alert, Space, } from 'antd';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';

const App = () => {

  const [Provider, SetProvider] = useState(undefined)
  const [notAvax, setAvax] = useState(false)
  const [account, setAccount] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()

  const connectWallet = async () => {
    try{

      let provider = new ethers.providers.Web3Provider(window.ethereum)
      let Signer = await provider.send("eth_requestAccounts", [])
      Signer = Signer[0]
      setAccount(Signer)
      let Network = await provider.getNetwork()
      if (Network.chainId !== 43114) {
        console.log(Network)
        setAvax(true)
      }
      SetProvider(provider)
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('wallet', Signer)
      console.log('provider======>', provider)
      setLoggedIn(true)
      navigate('/dashboard')
    }catch(e){
      console.log(e)
    }
}
    
  window.ethereum?.on('chainChanged', async (Network) => {
    if (Network === '0xa86a') {
      setAvax(false)
    } else {
      setAvax(true)
    }
    console.log(notAvax)
  })

  window.ethereum?.on('accountsChanged', async (account) => {
    console.log(account)
    setAccount(account[0])
    localStorage.setItem('wallet', account[0])
  })

  const [api, contextHolder] = notification.useNotification();
  const openNotification = async (placement, icon, message, title) => {
    api.open({
      message: title,
      description: message,
      placement: placement,
      icon: (
        icon
      ),
    });
  };

  //notifications for successful acts 
  function successfulAction(page) {
    if (page === "login") {
      return openNotification('right', <CheckCircleOutlined style={{ color: 'green', }} />, 'Welcome back', 'Success')

    } else if (page === 'register') {
      return openNotification('right', <CheckCircleOutlined style={{ color: 'green', }} />, 'Registration was successful. Welcome to Tempest!', 'Success')
    } else if (page === 'register-pay') {
      return openNotification('right', <CheckCircleOutlined style={{ color: 'green', }} />, 'Your Purchase and Registration were successful. Welcome to Tempest!', 'Success')
    } else if (page === 'pay') {
      return openNotification('right', <CheckCircleOutlined style={{ color: 'green', }} />, 'Your Purchase was successful.', 'Success')
    }else if(page === 'add-wallet'){
      return openNotification('right', <CheckCircleOutlined style={{ color: 'green', }} />, 'Your wallet was added', 'Success')
    }else {
      return openNotification('right', <CloseOutlined style={{ color: 'red', }} />, "Log out successful", 'Logged out')
    }

  }



  useEffect(() => {

  }, [notAvax])

  return (
    <>
      {contextHolder}
      <div data-w-id="3ba7b9c3-e2b2-3d55-63fd-3970abe464b9" className="navbar-top-scroll-trigger"></div>
      <div className="relative z-index-9999">
        <div className="gradient-hover-section bg-grey">
          <div className="gradient-1" ></div>
        </div>
        <div className="bg-grey">
          <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} notification={successfulAction}></NavBar>
          {notAvax && <Space
            direction="vertical"
            style={{
              width: '100%', justifyContent: "center",
            }}
          >

            <Alert style={{ textAlign: "center" }} message="Switch to the Avalanche network in order to use this site" type="warning" />

          </Space>}
          <Routes>
            <Route path='/:id' element={<LandingPage connect={connectWallet} notification={successfulAction} />} />
            <Route path='/dashboard' element={<Dashboard account={account} provider={Provider} notification={successfulAction} />} />
            <Route path='/register'  element={<Register setLoggedIn={setLoggedIn} notification={successfulAction} />} />
            <Route path='/login'  element={<Login setLoggedIn={setLoggedIn} notification={successfulAction} />} />
            <Route path='/metamask' element={<PayWithMetamask provider={Provider} notification={successfulAction} />} />
            <Route path='/stripe' element={<PayWithStripe provider={Provider} notification={successfulAction} />} />
            <Route path='/commerce' element={<Coinbase provider={Provider} notification={successfulAction} />} />
            <Route path='*' element={<Dashboard notification={successfulAction} />} />
          </Routes>
        </div>
      </div>
    </>
  );
};
export default App;