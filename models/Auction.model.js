const mongoose = require('mongoose');
const { REQUIRED_FIELD } = require('../config/errorMessages');

const AuctionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, REQUIRED_FIELD],
    unique: true,
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
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  endDate: {
    type: Date,
    required: true,
  },
  finalPrice: {
    type: Number
  },
  image: {
    type: [String],
    required: [true, REQUIRED_FIELD],    
  },
  type: {
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
  likesCount: {
    type: Number,
    default: 0,
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

const Auction = mongoose.model('Auction', AuctionSchema);

module.exports = Auction;