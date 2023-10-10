const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../middlewares/commonMiddlewares');
const { updateOrder, getCustomerOrders } = require('../../controllers/adminAPI/orderController');

router.post('/admin/updateOrdersStatus',requireSignin, adminMiddleware, updateOrder)
router.post('/admin/getOrders',requireSignin, adminMiddleware, getCustomerOrders)

module.exports = router 