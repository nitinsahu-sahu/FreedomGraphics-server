const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../../middlewares/commonMiddlewares');
const { addAddress, getAddress } = require('../../controllers/clientAPI/addressController');


router.post('/addAddress', requireSignin, userMiddleware, addAddress)
router.post('/getAddress', requireSignin, userMiddleware, getAddress)

module.exports = router;
