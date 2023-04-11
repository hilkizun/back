const Auction = require('../models/Auction.model');
const Like = require('../models/Like.model');
const createError = require('http-errors');

module.exports.create = (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.path
  }

  const { name, description, initialPrice, photo, type } = req.body;
  const currentPrice = initialPrice;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // Añade 7 días a la fecha actual

  Auction.create({ name, description, initialPrice, currentPrice, owner: req.currentUserId, photo, type, endDate })
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

module.exports.like = (req, res, next) => {
  const { auctionId } = req.params;

  Like.findOne({ user: req.currentUserId, auction: auctionId })
    .then(existingLike => {
      if (existingLike) {
        return res.status(400).json({ message: 'Ya has dado like' });
      }

      return Like.create({ user: req.currentUserId, auction: auctionId })
        .then(() => {
          return Auction.findByIdAndUpdate(auctionId, { $inc: { likesCount: 1 } });
        })
        .then(() => res.status(201).json({ message: 'Te gusta' }));
    })
    .catch(next);
};

module.exports.unlike = (req, res, next) => {
  const { auctionId } = req.params;

  Like.findOne({ user: req.currentUserId, auction: auctionId })
    .then(existingLike => {
      if (!existingLike) {
        return res.status(400).json({ message: 'No has dado like' });
      }
      return Like.findByIdAndDelete(existingLike._id)
        .then(() => {
          return Auction.findByIdAndUpdate(auctionId, { $inc: { likesCount: -1 } });
        })
        .then(() => res.status(200).json({ message: 'Ya no te gusta esta puja' }));
    })
    .catch(next);
};

module.exports.getLikedAuctions = (req, res, next) => {
  const { currentUserId } = req;

  Like.find({ user: currentUserId })
    .populate('auction')
    .then(likes => {
      const likedAuctions = likes.map(like => like.auction);
      res.status(200).json(likedAuctions);
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

      console.log("AQUIIIII", auction)

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
