const mongoose = require('mongoose');
const { REQUIRED_FIELD } = require('../config/errorMessages');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, REQUIRED_FIELD],
  },
  description: {
    type: String,
  },
  initialPrice: {
    type: Number,
    required: [true, REQUIRED_FIELD],
  },
  currentPrice: {
    type: Number,
    default: initialPrice,
  },
  finalPrice: {
    type: Number
  },
  photo: {
    type: String,
    required: [true, REQUIRED_FIELD],
  },
  photo2: {
    type: String,
  },
  photo3: {
    type: String,
  },
  photo4: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, REQUIRED_FIELD],
  },
  actionerWin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
},
{
  timestamps: true,
  toJSON: {
      virtuals: true,
      transform: (doc, ret) => { 
      delete ret.__v;
      delete ret._id;
      delete ret.password;
      }
  }
}
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;