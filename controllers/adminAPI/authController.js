const User = require('../../models/userSchema');
var randomstring = require("randomstring");
const bcrypt = require('bcryptjs');

// Admin customer Register API
exports.createUser = (req, res) => {
    const { first_name, last_name, email, contact_number, occupation, password, role } = req.body;
    if (!first_name || !last_name || !email || !password || !role) {
        return res.status(400).send({ message: "Enter required fields" });
    }
    User.findOne({ email: email }).then((adminExist) => {
        if (adminExist) {
            return res.status(400).send({ message: "Email Already registerd" });
        } else {
            const user = new User({ first_name, last_name, user_name: first_name + "_" + randomstring.generate(4), email, contact_number, occupation, password, role });
            user.save().then(() => {
                res.status(200).send({ message: "Admin registerd successfully" });
            }).catch((error) => res.status(400).send({ message: "Failed to registerd" }));
        }
    }).catch((error) => { res.status(400).send(error.message) });
}

// Admin Login API
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill the field properly" });
        }
        const admin_info = await User.findOne({ email: email });
        if (admin_info && admin_info.role === 'administrator') {
            const isMatch = await bcrypt.compare(password, admin_info.pass_word);
            const token = await admin_info.generateAuthToken();
            const user_id = admin_info._id;
            res.cookie('admin_token', token, { expiresIn: '5h' })
            res.cookie('admin_id', user_id, { expiresIn: '5h' })
            const { _id, first_name, last_name, fullname, email, role, profile_pic, contact_number } = admin_info;
            if (!isMatch) {
                res.status(400).json({ message: "Invalid email and password." });
            } else {
                res.status(200).json({ _id, token, data: { _id, first_name, last_name, fullname, role, email, profile_pic, contact_number }, message: "Admin Signin Successfully" });
            }
        } else {
            res.status(400).json({ message: "Invalid Credential..." });
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// Admin Signout API
exports.signout = async (req, res) => {
    try {
        res.clearCookie('admin_token');
        res.status(200).json({ message: "Logout successfully." });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// -------------------Find all users API--------------------
exports.findAllUsersData = async (req, res) => {
    await User.find({}).then((findAllUser) => {
        res.status(200).send({ message: " Get all User successfully...", findAllUser });
    }).catch((error) =>
        res.status(400).send({ error: "No Userry in database...", error })
    )
}

//-------------------Maintain Status--------------
exports.updateStatusById = (req, res) => {
    const { _id, current_status } = req.body;
    User.findOneAndUpdate(
        { _id: _id },
        { status: current_status },
        { new: true },
    ).then((result) => {
        res.status(200).json({ message: "Update user status Successfully." });
    }).catch((error) => {
        res.status(400).json({ error: "Cannot update user status", error });
    })
};

//-------------------Maintain is_Delete--------------
exports.updateIsDeleteById = (req, res) => {
    const { _id, current_status } = req.body;
    User.findOneAndUpdate(
        { _id: _id },
        { is_delete: current_status },
        { new: true },
    ).then((result) => {
        res.status(200).json({ result });
    }).catch((error) => {
        res.status(400).json(error.message);
    })
};
//-----------------------User Profile update-------------
exports.updateProfile = (req, res) => {
    const { first_name, last_name, email, contact_number } = req.body
    if (req.file) {
        profile_pic = req.file.filename;
    }
    const update = {
        $set: {
            first_name,
            last_name,
            email,
            contact_number,
            profile_pic
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
};
// --------------------GetProfile--------
exports.getProfile = (req, res) => {
    User.findOne(
        { _id: req.user._id },
    ).then((data) => {
        res.status(200).send({ message: "Get profile successfully.", data });
    }).catch((error) =>
        res.status(400).send({ errors: error.message })
    );
}