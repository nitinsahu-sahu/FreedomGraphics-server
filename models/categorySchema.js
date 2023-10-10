const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true
  },
  featuredImg:{
    type:String
  },
  type:{
    type:String
  },
  parentId: {
    type: String
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
}, {timestamps:true})

const Category = mongoose.model('CATEGORY', categorySchema);
module.exports = Category;
