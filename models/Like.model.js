const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  },
}, {
  timestamps: true,
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
