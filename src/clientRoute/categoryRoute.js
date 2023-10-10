const express = require('express');
const router = express.Router();
const { getCategory } = require('../../controllers/adminAPI/categoryController');

// ------------Multer Config--------------

router.get('/category/get-category', getCategory)

module.exports = router