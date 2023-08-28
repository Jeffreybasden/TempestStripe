import React from "react";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "./confirmcheckout";

const Element = (props)=>{

    const stripePromise = loadStripe(
        process.env.REACT_APP_OPEN_KEY
        );

          const options = {
            mode: 'payment',
            amount:1944,
            currency: 'usd',
            paymentMethodCreation: 'manual',
            // Fully customizable with appearance API.
            appearance: {/*...*/},
          };
        
          return (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm amount={props.amount} openNotification={props.openNotif} setLoading={props.setLoad} notification={props.notification}/>
            </Elements>
          );
        

}

export default Element