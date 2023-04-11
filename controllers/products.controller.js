const Product = require('../models/Product.model');
const Like = require('../models/Like.model');
const createError = require('http-errors');

module.exports.create = (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.path
  }

  const { name, description, price, photo, type } = req.body;


  Product.create({ name, description, price, owner: req.currentUserId, photo, type })
    .then(product => res.status(201).json(product))
    .catch(next);
}

module.exports.list = (req, res, next) => {
  Product.find()
    .then(products => res.json(products))
    .catch(next)
}

module.exports.buy = (req, res, next) => {
  const { id } = req.params
//   console.log('id', id)
  Product.findByIdAndUpdate(id, { boughtBy: req.currentUserId }, { new: true })
    .then(product => res.json(product))
    .catch(next)
}


module.exports.detail = (req, res, next) => {
  const { id } = req.params

  Product.findById(id)
    .then(product => res.json(product))
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const { productId } = req.params;

  Like.findOne({ user: req.currentUserId, product: productId })
    .then(existingLike => {
      if (existingLike) {
        return res.status(400).json({ message: 'Ya has dado like' });
      }

      return Like.create({ user: req.currentUserId, product: productId })
        .then(() => {
          return Product.findByIdAndUpdate(productId, { $inc: { likesCount: 1 } });
        })
        .then(() => res.status(201).json({ message: 'Te gusta' }));
    })
    .catch(next);
};

module.exports.unlike = (req, res, next) => {
  const { productId } = req.params;

  Like.findOne({ user: req.currentUserId, product: productId })
    .then(existingLike => {
      if (!existingLike) {
        return res.status(400).json({ message: 'No has dado Like' });
      }
      return Like.findByIdAndDelete(existingLike._id)
        .then(() => {
          return Product.findByIdAndUpdate(productId, { $inc: { likesCount: -1 } });
        })
        .then(() => res.status(200).json({ message: 'Ya no te gusta' }));
    })
    .catch(next);
};

module.exports.getLikedProducts = (req, res, next) => {
  const { currentUserId } = req;

  Like.find({ user: currentUserId })
    .populate('product')
    .then(likes => {
      const likedProducts = likes.map(like => like.product);
      res.status(200).json(likedProducts);
    })
    .catch(next);
};

// module.exports.like = (req, res, next) => {
//   const { id } = req.params;

//   Product.findByIdAndUpdate(
//     id,
//     { $addToSet: { likes: req.currentUserId } },
//     { new: true }
//   )
//     .then((product) => res.json(product))
//     .catch(next);
// };

// module.exports.unlike = (req, res, next) => {
//   const { id } = req.params;

//   Product.findByIdAndUpdate(
//     id,
//     { $pull: { likes: req.currentUserId } },
//     { new: true }
//   )
//     .then((product) => res.json(product))
//     .catch(next);
// };