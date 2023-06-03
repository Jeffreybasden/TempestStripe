import { Button, message, Steps, theme, Row, Col, Image } from 'antd';
import { useState } from 'react';
import Stripe from './stripe'


const Home = () => {
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: 'Email',
      content:`The email you provide will be used in order for you to receive your Tempest tokens. \n 
      Ensure this email address is one you use, and will be able to access in the future.` ,
    },
    {
      title: 'Pay',
      content: <Stripe/>,
    },
  ]


  
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    textHeight: '40rem',
    textAlign: 'center',
    justifyContent:'center',
    color: '',
    backgroundColor: '#e1f1fe',
    borderRadius:' 5px',
    border: `1px groove e1f1fe`,
    marginTop: 16,
    // paddingBottom: 20,
    // paddingTop: 30,
    padding: 20,
    width:"100%"


  };
  return (
    <div>

    <Row style={{marginTop:30}}>
        <Col xs={4} md={8} lg={8}></Col>
        <Col xs={12} sm={8} md={8} lg={8} xl={8}>
      <Steps current={current} items={items}/>
      <div style={contentStyle}>{steps[current].content}</div>
      
      <div
        style={{
          marginTop: 24,
        }}
        >
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        
        
        {current > 0 && (
          <Button color='blue'
            style={{
              margin: '0 2px',
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </Col>
    <Col xs={6} md={8} lg={8}></Col>
        </Row>
        </div>
  );
};
export default Home;