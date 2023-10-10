const express = require('express');
const {  createProudct, getProduct, updateProductsStatusById, updateProductIsDeleteById, getProductBySlug } = require('../../controllers/adminAPI/productController');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../middlewares/commonMiddlewares');
const multer = require('multer')
const shortId = require('shortid')
const path = require('path');
const { validaterCreateProductReq, isRequestValidated } = require('../../validators/authValidate');

// ------------Multer Config--------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, shortId.generate() + '-' + file.originalname)
    }
})

const uploads = multer({ storage })

const cpUpload = uploads.fields([{ name: 'featuredImg' }, { name: 'productImg', maxCount: 5 }])
router.post('/product/create-product', requireSignin, adminMiddleware, cpUpload, createProudct)
router.get('/product/get-products', getProduct)
router.post('/product/status' , updateProductsStatusById)
router.post('/product/softdelete' , updateProductIsDeleteById)
// router.get('/:slug', getProductBySlug )

module.exports = router