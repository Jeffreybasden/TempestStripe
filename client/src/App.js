
import { Routes, Route } from 'react-router-dom';
import RegisterPay from './components/registerpay'
import NavBar from './components/navbar';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Login from './components/login'
import Register from './components/register';
import Pay from './components/pay';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {notification} from 'antd';


const App = () => {

  const [api, contextHolder] = notification.useNotification();
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

  //notifications for successful acts 
  function successfulAction(page){
      if(page === "login"){
        return openNotification('right',<CheckCircleOutlined style={{color: 'green',}}/>, 'Welcome back', 'Success' )

      }else if(page === 'register'){
        return openNotification('right',<CheckCircleOutlined style={{color: 'green',}}/>, 'Registration was successful. Welcome to Tempest!', 'Success' )
      }else if(page === 'register-pay'){
        return openNotification('right',<CheckCircleOutlined style={{color: 'green',}}/>, 'Your Purchase and Registration were successful. Welcome to Tempest!', 'Success' )
      }else if(page === 'pay'){
        return openNotification('right',<CheckCircleOutlined style={{color: 'green',}}/>, 'Your Purchase was successful.', 'Success' )
      }else{
        return openNotification('right',<CloseOutlined style={{color: 'red',}} /> ,"Log out successful", 'Logged out')
      }
  
    }
  return (
    <>
      {contextHolder}
  <div  data-w-id="3ba7b9c3-e2b2-3d55-63fd-3970abe464b9" className="navbar-top-scroll-trigger"></div>
  <div className="relative z-index-9999">
    <div className="gradient-hover-section bg-grey">
      <div className="gradient-1" ></div>
    </div>
      <div className="bg-grey">
      <NavBar notification={successfulAction}></NavBar>
      <Routes>
        <Route path='/' element= {<LandingPage notification={successfulAction}/>}/>
        <Route path='/dashboard' element= {<Dashboard notification={successfulAction}/>}/>
        <Route path='/register' element= {<Register notification={successfulAction}/>}/>
        <Route path='/login' element= {<Login notification={successfulAction}/>}/>
        <Route path='/register-pay' element={ <RegisterPay notification={successfulAction}/>}/>
        <Route path='/pay' element= {<Pay notification={successfulAction}/>}/>
        <Route path='*'  element= {<Dashboard notification={successfulAction}/>}/>
      </Routes>
      </div>
    </div>
    </>
  );
};
export default App;