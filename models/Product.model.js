const mongoose = require('mongoose');
const { REQUIRED_FIELD } = require('../config/errorMessages');

const categoryEnum = [
  "amigurumis",
  "complementos",
  "jerseys",
  "camisetas",
  "gorros",
  "calcetines",
  "manoplas",
  "chales",
  "bastidores",
];

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
  category: {
    type: String,
    enum: categoryEnum,
    required: [true, REQUIRED_FIELD],
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
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  boughtBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  sellOut: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
  toJSON: {
      virtuals: true,
      transform: (doc, ret) => { 
      delete ret.__v;
      delete ret.password;
      }
  }
}
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;