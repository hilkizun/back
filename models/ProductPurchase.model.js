const mongoose = require('mongoose');
const { REQUIRED_FIELD } = require('../config/errorMessages');

const ProductPurchaseSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, REQUIRED_FIELD],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, REQUIRED_FIELD],
  },
  location: {
    address: {
      type: String,
    },
    number: {
      type: Number,
    },
    floor: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    city: {
      type: String,
    }
  },
  phone: {
    type: String,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const ProductPurchase = mongoose.model('ProductPurchase', ProductPurchaseSchema);

module.exports = ProductPurchase;
