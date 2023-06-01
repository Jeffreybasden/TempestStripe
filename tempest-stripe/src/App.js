import { Button, message, Steps, theme, Row, Col, Image } from 'antd';
import { useState } from 'react';
import Stripe from './stripe'
import Success from './success';


const App = () => {
  const [current, setCurrent] = useState(0);
  
  
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const success = async () =>{
    steps.append({
      title: 'Success',
      content: <Success/>
    })
  }
  var steps = [
    {
      title: 'Email',
      content:`The email you provide will be used in order for you to receive your Tempest tokens. \n 
      Ensure this email address is one you use, and will be able to access in the future.` ,
    },
    {
      title: 'Pay',
      content: <Stripe set={success}/>,
    },
  ];

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
    <Row>
      <Image src='https://tmpsttest.net/assets/tempest-logo1.17e3eb35.png' style={{maxWidth:200, margin:30}}/>
    </Row>
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
export default App;