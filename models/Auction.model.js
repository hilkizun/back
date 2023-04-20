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
    default: 'auction',
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
  auctionWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  isProductGenerated: {
    type: Boolean,
    default: false
  }
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

const Auction = mongoose.model('Auction', AuctionSchema);

module.exports = Auction;