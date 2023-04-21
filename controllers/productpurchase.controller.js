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

module.exports.detail = (req, res, next) => {
  const { id } = req.params

  ProductPurchase.findById(id)
    .populate('product')
    .populate('buyer')
    .then(purchase => res.json(purchase))
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const { id } = req.params;
  const updatedFields = req.body;

  console.log('purchase', id, updatedFields);

  ProductPurchase.findByIdAndUpdate(id, updatedFields, { new: true })
    .populate('product')
    .populate('buyer')
    .then(updatedPurchase => {
      if (!updatedPurchase) {
        throw new Error('Product purchase not found');
      }

      res.status(200).json(updatedPurchase);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;

  ProductPurchase.findByIdAndDelete(id)
    .then(() => res.status(204).send())
    .catch(next);
};