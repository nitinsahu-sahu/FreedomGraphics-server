const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../../middlewares/commonMiddlewares');
const { addOrder, getOrders, getOrder } = require('../../controllers/clientAPI/orderController');

router.post('/addOrder',requireSignin, userMiddleware, addOrder)
router.post('/getOrders',requireSignin, userMiddleware, getOrders)
router.post('/getOrder',requireSignin, userMiddleware, getOrder)

module.exports = router 