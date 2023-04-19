const Auction = require('../models/Auction.model');
const Like = require('../models/Like.model');
const createError = require('http-errors');

module.exports.create = (req, res, next) => {
  let image =[];
  console.log(req.files, 'files');
  if (req.files) {
    image = req.files.map((file) => file.path)
  }

  const { name, description, initialPrice, category, type } = req.body;
  const currentPrice = initialPrice;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // Añade 7 días a la fecha actual

  Auction.create({ name, description, initialPrice, currentPrice, category, owner: req.currentUserId, image, type, endDate })
    .then(auction => res.status(201).json(auction))
    .catch(next);
}

module.exports.list = (req, res, next) => {
  Auction.find()
    .then(auctions => res.json(auctions))
    .catch(next)
}

module.exports.detail = (req, res, next) => {
  const { id } = req.params

  Auction.findById(id)
    .then(auction => res.json(auction))
    .catch(next)
}


module.exports.getLikes = (req, res, next) => {
  const { currentUserId } = req;

  Like.find({ user: currentUserId })
    .populate('auction product')
    .then(likes => {
      const allLikes = likes.map(like => like);
      res.status(200).json(allLikes);
    })
    .catch(next);
};

module.exports.placeBid = (req, res, next) => {
  const { auctionId } = req.params;
  const { bidAmount } = req.body;
  const userId = req.currentUserId;
  const currentDate = new Date();

  Auction.findById(auctionId)
    .then(auction => {
      if (!auction) {
        return next(createError(404, 'Subasta no encontrada.'));
      }

      if (auction.endDate <= currentDate) {
        return next(createError(400, 'La puja ha terminado.'));
      }

      if (bidAmount <= auction.currentPrice) {
        return next(createError(400, 'La puja debe ser mayor de la actual'));
      }

      auction.bids.push({ bidder: userId, amount: bidAmount });
      auction.currentPrice = bidAmount;
      return auction.save();
    })
    .then(auction => {
      res.status(200).json({ message: 'Has pujado.', auction });
    })
    .catch(error => {
      console.error('Error:', error);
      next(createError(500, 'Error placing bid.'));
    });
};
