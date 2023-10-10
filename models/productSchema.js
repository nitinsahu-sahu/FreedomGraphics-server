const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    price: {
        type: String,
        trim: true
    },
    offer: {
        type: Number,
    },
    stock: {
        type: String,
        required: true
    },
    selling_price: {
        type: String,
        required: true
    },
    //   product_type: {
    //     type: String,
    //   },
    description: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CATEGORY',
    },
    featuredImg: {
        type: String,
        default: 'https://gbhtechnologies.com/testingwp/wp-content/uploads/woocommerce-placeholder-600x600.png'
    },
    productImg: [
        {
            img: {
                type: String,
            }
        }
    ],
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'USER'
            },
            review: String
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true
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
    updatedAt: Date,
}, { timestamps: true })

const Product = mongoose.model('PRODUCT', productSchema);
module.exports = Product;
