require('dotenv').config()
const  express = require("express")
const app = express()
const cors = require('cors')
const paymentRoutes = require('./routes/paymentroutes')
const authRoutes = require('./routes/authroutes')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require('bcrypt')

//middleware
app.use(cors())
app.use(express.json())

//routes
app.use(paymentRoutes)
app.use(authRoutes)





app.listen(4000, ()=> console.log('server started',process.env.STRIPE_PRIVATE_KEY ))