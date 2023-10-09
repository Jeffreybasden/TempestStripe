import {useStripe, useElements, PaymentElement ,AddressElement} from '@stripe/react-stripe-js';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    
    let body
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    // gets input amount to charge 
    elements._commonOptions.amount = props.amount
    elements.submit()
    try{
    const jwt = localStorage.getItem('jwt') 
    const employeeId = localStorage.getItem('employeeId')
    if(employeeId === undefined){
       body = {amount:props.amount,}
    }else{
       body = {amount:props.amount, employeeId}
    }
    const headers = {
    'Authorization': `Bearer ${jwt}`,
    "Content-Type":"application/json"
    }
    
   let res = await fetch(`http://localhost:4000/payment`,
    {
    method:"POST",
    headers,
    body:JSON.stringify(body)
    })

     if(res.ok){
        const data = await res.json()
        
        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret:data.client_secret,
            redirect: "if_required",
            confirmParams: {
                return_url: "https://contribute.tmpst.io/dashboard",
            },
        });
        //  props.setLoading(true)
        
        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message)
            return props.openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,result.error.message, 'Try Again')
        } else {
            props.notification("pay")
            return navigate('/dashboard')
        }

    }else{
      props.setLoading(false)
      let data = await res.json()
      return props.openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,data.error, 'Try Again')
    } 
  }catch(e){
      props.setLoading(false)
      console.log(e.message)
      return props.openNotification('left',<CloseOutlined style={{color: 'red',}} /> ,e.message, 'Try Again')
  }
    
};

  return (
    <form onSubmit={handleSubmit}>
      <AddressElement options={{mode:'billing',}}/>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  )
};

export default CheckoutForm;
