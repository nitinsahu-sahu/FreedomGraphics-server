
const{check, validationResult} = require('express-validator');
exports.validaterCreateUserReq = [
    check('first_name').notEmpty().withMessage('First name is required.'),
    check('last_name').notEmpty().withMessage('Last name is required.'),
    check('email').isEmail().withMessage('Email is required.'),
    check('password').isLength({min:6}).withMessage('Password must be atleat 6 character long.'),
    check('role').notEmpty().withMessage('Role is required.'),
]

exports.validaterCreateGuestUserReq = [
    check('first_name').notEmpty().withMessage('First name is required.'),
    check('last_name').notEmpty().withMessage('Last name is required.'),
    check('email').isEmail().withMessage('Email is required.'),
    check('contact_number').notEmpty().withMessage('Mobile number is required.'),
    check('contact_number').isLength({min:10}).withMessage('Mobile number must be atleat 10 character long.'),
    check('contact_number').isLength({max:10}).withMessage('Invalid number.'),
    check('password').notEmpty().withMessage('Password is required.'),
    check('password').isLength({min:6}).withMessage('Password must be atleat 6 character long.'),
    check('confirm_pwd').notEmpty().withMessage('Confirm password is required.'),
]

exports.validaterLoginGuestUserReq = [
    check('email').isEmail().withMessage('Email is required.'),
    check('password').notEmpty().withMessage('Password is required.'),
    check('password').isLength({min:6}).withMessage('Password must be atleat 6 character long.'),
]

exports.validaterSigninReq = [
    check('email').isEmail().withMessage('Email is required.'),
    check('password').notEmpty().withMessage('Password is required.'),
    check('password').isLength({min:6}).withMessage('Password must be atleat 6 character long.'),
]

exports.validaterCreateProductReq = [
    check('name').notEmpty().withMessage('Product name is required.'),
    check('stock').notEmpty().withMessage('Stock is required.'),
    check('selling_price').notEmpty().withMessage('Selling Price is required.'),
    check('description').notEmpty().withMessage('Description is required.'),
    check('short_description').notEmpty().withMessage('Short description is required.'),
]

exports.validaterCreateCategoryReq = [
    check('name').notEmpty().withMessage('Category name is required.'),
    check('slug').notEmpty().withMessage('Slug is required.'),
]

exports.isRequestValidated = (req, res, next) =>{
    const errors = validationResult(req);
    if(errors.array().length>0){
        return res.status(400).send({errors:errors.array()[0].msg});
    }
    next()
}