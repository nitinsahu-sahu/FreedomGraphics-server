const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    required: true
  },
  cartItems:[
    {
      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PRODUCT',
        required: true
      },
      quantity:{
        type: Number,
        default: 1
      },
    }
  ]
}, {timestamps:true})

const Cart = mongoose.model('CART', cartSchema);
module.exports = Cart;
