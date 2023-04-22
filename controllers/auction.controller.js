const Auction = require('../models/Auction.model');
const Like = require('../models/Like.model');
const createError = require('http-errors');
const Product = require('../models/Product.model');

const checkAuctionStatus = async () => {
  const currentDate = new Date();
  const auctions = await Auction.find({ endDate: { $lte: currentDate }, isProductGenerated: false });

  for (const auction of auctions) {
    let highestBid = { amount: 0 };

    if (auction.bids.length === 1) {
      highestBid = auction.bids[0];
    } else if (auction.bids.length > 1) {
      highestBid = auction.bids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), { amount: 0 });
    }
    console.log('XXXX', highestBid)

    if (highestBid.amount > 0) {
      const product = {
        name: auction.name + ' PUJA',
        description: auction.description,
        price: auction.currentPrice,
        owner: auction.owner,
        winner: highestBid.bidder,
        image: auction.image,
        category: auction.category,
        type: auction.type,
      };

      await Product.create(product);

      await Auction.findByIdAndUpdate(auction.id, { isProductGenerated: true, auctionWinner: highestBid.bidder });
    }
  }
};




module.exports.create = (req, res, next) => {
  let image =[];
  console.log(req.files, 'files');
  if (req.files) {
    image = req.files.map((file) => file.path)
  }  
  
  const { name, description, initialPrice, category, type } = req.body;
  const currentPrice = initialPrice;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); 
  
  Auction.create({ name, description, initialPrice, currentPrice, category, owner: req.currentUserId, image, type, endDate })
  .then(auction => res.status(201).json(auction))
  .catch(next);
}  

module.exports.list = (req, res, next) => {
  checkAuctionStatus();
  Auction.find()
  .then(auctions => res.json(auctions))
  .catch(next)
};  

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

module.exports.getHighestBid = (req, res, next) => {
  const { id } = req.params;
  
  Auction.findById(id)
  .then(auction => {
    if (!auction) {
      return next(createError(404, 'Subasta no encontrada.'));
    }  
    
    const highestBid = auction.bids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), { amount: 0 });
    res.json(highestBid);
  })  
  .catch(next);
};  

module.exports.getUserAuctions = (req, res, next) => {
  const { currentUserId } = req;
  checkAuctionStatus();
  Auction.find({ owner: currentUserId })
    .then(auctions => {
      res.status(200).json(auctions);
    })
    .catch(next);
};

