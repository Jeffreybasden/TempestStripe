require('dotenv').config()
const  express = require("express")
const coinbase = require('coinbase-commerce-node')
const app = express()
const cors = require('cors')
const paymentRoutes = require('./routes/paymentroutes')
const authRoutes = require('./routes/authroutes')
const adminRoutes = require('./routes/admin')
const mongoose = require('mongoose')
var Client = coinbase.Client;
Client.init(process.env.E_TEMPEST);



//middleware
app.use(cors())
app.use(express.json())

//routes
app.use(paymentRoutes)
app.use(authRoutes)
app.use(adminRoutes)





mongoose.connect(process.env.INFO_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    app.listen(4000, ()=> console.log('server started',process.env.STRIPE_PRIVATE_KEY, process.env.E_TEMPEST, process.env.INFO_LINK ))
}).catch((e)=>{
    console.log(e)
})
