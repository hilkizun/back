const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { REQUIRED_FIELD, INVALID_EMAIL, INVALID_LENGTH } = require('../config/errorMessages');

const ROUNDS = 10;

const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, REQUIRED_FIELD]
    },
    lastName: {
      type: String,
      required: [true, REQUIRED_FIELD]
    },
    email: {
      type: String,
      required: [true, REQUIRED_FIELD],
      match: [EMAIL_PATTERN, INVALID_EMAIL],
      trim: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      required: [true, REQUIRED_FIELD],
      minlength: [8, INVALID_LENGTH]
    },
    location: {
      address: {
      },
      type: String,
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
  },
  {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => { // Sirve para cambiar el output de los endpoints cuando hago res.json
        delete ret.__v;
        delete ret._id;
        delete ret.password;
        }
    }
  }
)

UserSchema.virtual('productsOwned', {
  ref: 'Product',
  foreignField: 'owner',
  localField: '_id',
  justOne: false
})

UserSchema.virtual('productsBought', {
  ref: 'Product',
  foreignField: 'boughtBy',
  localField: '_id',
  justOne: false
})

UserSchema.virtual('productsLiked', {
  ref: 'Product',
  foreignField: 'likes',
  localField: '_id',
  justOne: false
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, ROUNDS)
      .then(hash => {
        this.password = hash
        next()
      })
      .catch(next)
  } else {
    next()
  }
})

UserSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;