const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    user_name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    contact_number: {
        type: String,
        trim: true,
        max: 10,
        
    },
    occupation: {
        type: String,
    },
    pass_word: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'shopmanager', 'guest', 'administrator'],
        default: 'customer'
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    is_delete: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    profile_pic: {
        type: String,
        default: 'j8mm6qJwE-common-profile.jpg'
    }

}, { timestamps: true });

//vertual set full lastname
userSchema.virtual('fullname').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

//vertual set pwd
userSchema.virtual('password').set(function (password) {
    this.pass_word = bcrypt.hashSync(password, 10)
});
userSchema.methods = {
    authenticate: function (password) {
        return bcrypt.compare(password, this.pass_word)
    }
}

//   fp_token:{
//     type: String,
//     default:''
//   },
//   

// we are generating generateAuthToken
userSchema.methods.generateAuthToken = async function(){
  try {
    let tokenvar = jwt.sign({_id:this._id,role: this.role}, process.env.SECRET_KEY, {expiresIn: '1D'});
    this.tokens = this.tokens.concat({token:tokenvar});
    await this.save();
    return tokenvar;
  } catch (error) {
    res.status(400).json( error.message);
  }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;


// {
//     user: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     rating: {
//         type: Number,
//         required: true
//     },
//     comment: {
//         type: String,
//         required: true
//     }
// }