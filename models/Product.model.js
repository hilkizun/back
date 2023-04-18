const mongoose = require('mongoose');
const { REQUIRED_FIELD } = require('../config/errorMessages');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, REQUIRED_FIELD],
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, REQUIRED_FIELD],
  },
  image: {
    type: [String],
    required: [true, REQUIRED_FIELD],    
  },
  type: {
    type: String,
    default: 'product',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, REQUIRED_FIELD],
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  boughtBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;