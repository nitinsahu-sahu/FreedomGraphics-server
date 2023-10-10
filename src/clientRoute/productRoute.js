const express = require('express');
const { getProduct, getProductDetailsById, getProductBySlug, } = require('../../controllers/clientAPI/productController');
const router = express.Router();


router.get('/product/get-products', getProduct)
router.post('/product/get-product-by-id', getProductDetailsById)
router.post('/productCatBySlug', getProductBySlug );

module.exports = router