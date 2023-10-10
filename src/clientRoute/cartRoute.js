const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../../middlewares/commonMiddlewares');
const { addItemToCart, getCartItems } = require('../../controllers/clientAPI/cartController');

router.post('/addToCart',requireSignin, userMiddleware, addItemToCart)
router.post('/getCartItems',requireSignin, userMiddleware, getCartItems)

module.exports = router 