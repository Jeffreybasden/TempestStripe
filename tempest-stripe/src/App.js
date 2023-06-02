import { Button, message, Steps, theme, Row, Col, Image } from 'antd';
import { useState } from 'react';
import Stripe from './stripe'
import Success from './success';
import Home from './home';

const App = () => {
  
  return (
    <>
    <Row>
      <Image src='https://tmpsttest.net/assets/tempest-logo1.17e3eb35.png' style={{maxWidth:200, margin:30}}/>
    </Row>
    <Home/>
    {/* <Image src='https://clipartcraft.com/images/wind-clipart-turbine-1.png'  style={{maxWidth:200, margin:10, position:'fixed', right:'10%'}}/> */}
    </>
  );
};
export default App;