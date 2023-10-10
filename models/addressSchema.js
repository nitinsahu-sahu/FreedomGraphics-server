const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50,
    },
    alternate_number: {
        type: String,
    },
    contact_number: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
    },
    locality: {
        required: true,
        type: String,
        trim: true,
        min: 10,
        max: 100,
    },
    address: {
        required: true,
        type: String,
        trim: true,
        min: 10,
        max: 100,
    },
    city_District_Town: {
        required: true,
        type: String,
        trim: true,
    },
    state: {
        type: String,
        required: true,
    },
    landmak: {
        type: String,
        min: 10,
        max: 100,
    },
    addresstype: {
        type: String,
        required: true,
        enum: ["home", "work"],
    },
});

const userAddressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "USER",
        },
        address: [addressSchema],
    },
    { timestamps: true }
);

const Useraddress = mongoose.model('USERADDRESS', userAddressSchema);
module.exports = Useraddress;