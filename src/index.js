const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
require('../connction/db');
const app = express()
require('dotenv').config()
app.use(express.json());
app.use(cors())
const path = require('path');



// +++++++++++++++++++++++Routes++++++++++++++++++++++++
const razorpayGateway = require('./paymentsRoute/Razorpay');

app.use('/api', razorpayGateway)


//Admin related Routes
const adminRoutes = require('./adminRoute/authRoute');
const categoryRoutes = require('./adminRoute/categoryRoute');
const productRoutes = require('./adminRoute/productRoute');
const orderRoutes = require('./adminRoute/orderRoute');
app.use('/api', adminRoutes)
app.use('/api', categoryRoutes)
app.use('/api', orderRoutes)
app.use('/api', productRoutes)


//Customer/User related Routes
const clientRoutes = require('./clientRoute/authRoute')
const cartRoute = require('./clientRoute/cartRoute')
const productRoute = require('./clientRoute/productRoute')
const addressRoute = require('./clientRoute/addressRoute')
const orderRoute = require('./clientRoute/orderRoutes')
app.use('/api', cartRoute)
app.use('/api', clientRoutes)
app.use('/api', productRoute)
app.use('/api', addressRoute)
app.use('/api', orderRoute)

//
app.use('/public/',express.static(path.join(__dirname, 'uploads')));
// function middleware (req, res, next){
//   console.log('Request URL:', req.originalUrl);
//   next();
// }

app.use('/', (req,res)=>{
  console.log("hello");
})
app.use(bodyParser.json())
// Connection(process.env.MONGO_DB_USERNAME,process.env.MONGO_DB_PW)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})