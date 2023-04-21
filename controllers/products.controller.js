const Product = require('../models/Product.model');
const Like = require('../models/Like.model');
const Auction = require('../models/Auction.model');
const createError = require('http-errors');
const ProductPurchase = require('../models/ProductPurchase.model');


module.exports.create = (req, res, next) => {
  let image =[];
  console.log(req.files, 'files');
  if (req.files) {
    image = req.files.map((file) => file.path)
  }

  const { name, description, price, type, category } = req.body;


  Product.create({ name, description, price, owner: req.currentUserId, image, category, type })
    .then(product => res.status(201).json(product))
    .catch(next);
}

module.exports.list = (req, res, next) => {
  const user = req.currentUserId;
  Product.find({ $or: [{ winner: user }, { winner: null }] })
    .then(products => res.json(products))
    .catch(next);
};

module.exports.detail = (req, res, next) => {
  const { id } = req.params

  Product.findById(id)
    .then(product => res.json(product))
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const { productId } = req.params;
  const { likeType } = req.query;

  let model;
  if (likeType === 'product') {
    model = Product;
  } else if (likeType === 'auction') {
    model = Auction;
  } else {
    return res.status(400).json({ message: 'Tipo de like no válido' });
  }

  const criteria = {
    user: req.currentUserId,
  }
  if (likeType === 'product') {
    criteria.product = productId
  } 

  if (likeType === 'auction') {
    criteria.auction = productId
  }
  
  Like.findOne(criteria)
    .then(existingLike => {
      if (existingLike) {
        return res.status(400).json({ message: 'Ya has dado like' });
      }

      return Like.create(criteria)
        .then(() => {
          return model.findByIdAndUpdate(productId, { $inc: { likesCount: 1 } });
        })
        .then(() => res.status(201).json({ message: 'Te gusta' }));
    })
    .catch(next);
};

module.exports.unlike = (req, res, next) => {
  const { productId } = req.params;
  const { likeType } = req.query;

  let model;
  if (likeType === 'product') {
    model = Product;
  } else if (likeType === 'auction') {
    model = Auction;
  } else {
    return res.status(400).json({ message: 'Tipo de unlike no válido' });
  }

  const criteria = {
    user: req.currentUserId,
  }
  if (likeType === 'product') {
    criteria.product = productId
  } 

  if (likeType === 'auction') {
    criteria.auction = productId
  }

  Like.findOne(criteria)
    .then(existingLike => {
      if (!existingLike) {
        return res.status(400).json({ message: 'No has dado like' });
      }

      return Like.findByIdAndDelete(existingLike._id)
        .then(() => {
          return model.findByIdAndUpdate(productId, { $inc: { likesCount: -1 } });
        })
        .then(() => res.status(200).json({ message: 'Ya no te gusta' }));
    })
    .catch(next);
};

module.exports.getUserProducts = (req, res, next) => {
  const { currentUserId } = req;

  Product.find({ owner: currentUserId })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(next);
};

module.exports.getUserAuctionWinner = (req, res, next) => {
  const { currentUserId } = req;

  Product.find({ winner: currentUserId })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(next);
};
