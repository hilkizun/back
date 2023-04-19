const ProductPurchase = require('../models/ProductPurchase.model');
const Product = require('../models/Product.model');

module.exports.createPurchase = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      return ProductPurchase.create({
        product: productId,
        buyer: req.currentUserId,
      });
    })
    .then(purchase => res.status(201).json(purchase))
    .catch(next);
};
