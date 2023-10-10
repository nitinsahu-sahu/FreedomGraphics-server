const express = require('express');
const router = express.Router();
const { signup, signin, editProfile, getProfile, signout } = require('../../controllers/clientAPI/authController');
const { requireSignin, userMiddleware } = require('../../middlewares/commonMiddlewares');
const { isRequestValidated, validaterCreateGuestUserReq, validaterLoginGuestUserReq } = require('../../validators/authValidate');
// ------------Multer Config--------------
const shortId = require('shortid')
const path = require('path')
const multer = require('multer')
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

router.post('/signup', validaterCreateGuestUserReq, isRequestValidated, signup)
router.post('/signin', validaterLoginGuestUserReq, isRequestValidated, signin)
router.put('/editProfile', requireSignin, userMiddleware, uploads.single('profile_pic'), editProfile)
router.get('/getProfile', requireSignin, userMiddleware, getProfile)
router.post('/signout', requireSignin, signout);

router.post('/profile', requireSignin, (req, res) => {
    res.status(200).json({ user: 'profile' })
});

module.exports = router