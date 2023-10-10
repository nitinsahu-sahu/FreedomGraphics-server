const express = require('express');
const router = express.Router();
const { createUser, signin, signout, findAllUsersData, updateStatusById, updateIsDeleteById, updateProfile, getProfile } = require('../../controllers/adminAPI/authController');
const { isRequestValidated, validaterSigninReq, validaterCreateUserReq } = require('../../validators/authValidate');
const { requireSignin, adminMiddleware } = require('../../middlewares/commonMiddlewares');
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
router.post('/admin/create-user', validaterCreateUserReq, isRequestValidated, createUser)
router.post('/admin/signin', validaterSigninReq, isRequestValidated, signin)
router.post('/admin/signout', requireSignin, signout)
router.get('/admin/findAllUsers', findAllUsersData)
router.post('/admin/status', updateStatusById)
router.post('/admin/softdelete', updateIsDeleteById)
router.post('/admin/editprofile', requireSignin, adminMiddleware, uploads.single('profile_pic'), updateProfile)
router.get('/admin/getProfile', requireSignin, adminMiddleware, getProfile)

// router.post('/admin/profile',  (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

module.exports = router