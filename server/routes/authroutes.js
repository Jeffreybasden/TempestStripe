const router = require('express').Router()
const auth = require('../controllers/authctrl')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

// async function authToken(req,res,next){
//     const token = req.headers.authorization.split(' ')[1]
//     console.log("Token ONe ",token)
    
//     try{
//         const customer = await stripe.customers.search({query: `metadata["jwt"]:"${token}"`})
//         console.log('first try customer++++++++++++++++++++++',customer)
//         if(customer.data[0] === undefined){
//             return  res.status(400).json({message:"Not authorized"})
//         }else{
//             return next()
//         }
        
//     }catch(e){
//         console.log(e)
//         res.status(400).json({message:"Not authorized"})
//     }
// }




router.post('/login',auth.Login)
router.get('/get-user',auth.GetUser)
router.post('/register',auth.Register)
router.post('/logout',auth.LogOut)
router.post('/coinbase-user',auth.Coinbase)
router.post('/coinbase-transactions',auth.CoinbaseHistory)
router.post('/add-wallet',auth.AddWallet)
router.post('/change-password',auth.changePassword)



module.exports = router