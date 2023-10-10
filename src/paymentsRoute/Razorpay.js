const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../../middlewares/commonMiddlewares');
const { paymentOrders, paymentVerify } = require('../../controllers/clientAPI/RazorpayController');


//Admin related Routes
router.post('/payment/orders', requireSignin, userMiddleware, paymentOrders)
router.post('/payment/verify', requireSignin, userMiddleware, paymentVerify)

module.exports = router