const User = require('../../models/userSchema');
var randomstring = require("randomstring");
const bcrypt = require('bcryptjs');

// Customer Register API
exports.signup = (req, res) => {
    const { first_name, last_name, email, contact_number, occupation, password, confirm_pwd } = req.body;
    if (!first_name || !last_name || !email || !contact_number || !password || !confirm_pwd) {
        return res.status(400).send({ errors: "plz filled the field properly" });
    }
    User.findOne({ email: email }).then((userExist) => {
        if (userExist) {
            return res.status(400).send({ errors: "Email Already registerd." });
        } else if (password !== confirm_pwd) {
            return res.status(400).send({ errors: "Your password and confirmation password do not match." });
        } else {
            const user = new User({ first_name, last_name, user_name: first_name + "_" + randomstring.generate(4), email, contact_number, occupation, password });
            user.save().then(() => {
                res.status(200).send({ message: "User registerd successfully." });
            }).catch((errors) => res.status(400).send({ errors: "Failed to registerd." }));
        }
    }).catch((error) => { res.status(400).send(error.message) });
}

// Customer Login API
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ errors: "Please fill the field properly" });
        }
        const user_info = await User.findOne({ email: email });
        if (user_info && user_info.role === 'customer') {
            const isMatch = await bcrypt.compare(password, user_info.pass_word);
            const token = await user_info.generateAuthToken();
            const user_id = user_info._id;
            res.cookie('user_token', token, { expiresIn: '5h' })
            res.cookie('user_id', user_id, { expiresIn: '5h' })
            const { _id, first_name, last_name, fullname, email, contact_number, role, profile_pic } = user_info;
            if (!isMatch) {
                res.status(400).json({ errors: "Invalid email and password." });
            } else {
                res.status(200).json({ _id, token, data: { _id, first_name, contact_number, last_name, fullname, role, email, profile_pic }, message: "Signin successfully" });
            }
        } else {
            res.status(400).json({ errors: "User not found." });
        }
    } catch (errors) {
        res.status(400).json(errors.message);
    }
}

exports.editProfile = (req, res) => {
    const { first_name, last_name, email, contact_number, password } = req.body
    if (req.file) {
        profile_pic = req.file.filename;
    }
    const update = {
        $set: {
            first_name,
            last_name,
            email,
            contact_number,
            profile_pic,
            password
        }
    }
    User.findByIdAndUpdate(
        { _id: req.user._id },
        update,
        {
            new: true,
            useFindAndModify: false
        }
    ).then((data) => {
        const { _id, first_name, last_name, fullname, email, contact_number, role, profile_pic } = data;
        res.status(200).json({ data: { _id, first_name, contact_number, last_name, fullname, role, email, profile_pic }, message: "Update profile successfully" });
    }).catch((error) =>
        res.status(400).send({ errors: error.message })
    );
}

// exports.editProfilePicture = (req, res) => {
//     console.log(req.file);
// try {
//     if (req.file) {
//         pic = process.env.BASE_URL + '/public/' + req.file.filename;
//     }
//     User.findByIdAndUpdate(
//         { _id: req.user._id },
//         {
//             $set: {
//                 profile_pic: pic,
//             }
//         },
//         {
//             new: true,
//             useFindAndModify: false
//         }
//     ).then((data) => {
//         const { _id, first_name, last_name, fullname, email, contact_number, role, profile_pic } = data;
//         res.status(200).json({ data: { _id, first_name, contact_number, last_name, fullname, role, email, profile_pic }, message: "Pic update successfully" });
//     }).catch((error) =>
//         res.status(400).send({ errors: error.message })
//     );
// } catch (errors) {
//     res.status(400).send({ errors: errors.message })
// }

// }

exports.getProfile = (req, res) => {
    User.findOne(
        { _id: req.user._id },
    ).then((data) => {
        res.status(200).send({ message: "Get profile successfully." });
    }).catch((error) =>
        res.status(400).send({ errors: error.message })
    );
}

// -----------------signout--------------
exports.signout = async (req, res) => {
    try {
        res.clearCookie('user_token');
        res.status(200).json({ message: "Logout successfully." });
    } catch (error) {
        res.status(400).json(error.message);
    }
}