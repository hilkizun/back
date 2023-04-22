const router = require ('express').Router()
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/users.controller')
const productsController = require('../controllers/products.controller')
const auctionController = require('../controllers/auction.controller')
const upload = require('../config/storage.config')
const productPurchaseController = require('../controllers/productpurchase.controller');

const authMiddleware = require('../middlewares/auth.middleware')


//auth
router.post('/login', authController.login)

//Users
router.post('/users', userController.create)
router.get('/users', userController.list)
router.get('/users/me', authMiddleware.isAuthenticated, userController.getCurrentUser)
router.get('/users/:id', userController.getUser)

//Product
router.post('/products', authMiddleware.isAuthenticated, upload.any(), productsController.create);
router.get('/products', productsController.list);
router.get('/products/:id', productsController.detail)
router.get('/userproducts', authMiddleware.isAuthenticated, productsController.getUserProducts);
router.get('/winnerproducts', authMiddleware.isAuthenticated, productsController.getUserAuctionWinner);
router.get('/userpurchase', authMiddleware.isAuthenticated, productsController.getUserPurchases);


//Auctions
router.post('/auction', authMiddleware.isAuthenticated, upload.any(), auctionController.create);
router.get('/auction', auctionController.list);
router.get('/auction/:id', auctionController.detail)
router.post('/:auctionId/bid',  authMiddleware.isAuthenticated, auctionController.placeBid);
router.get('/auction/:id/highest-bid', auctionController.getHighestBid);
router.get('/userauctions', authMiddleware.isAuthenticated, auctionController.getUserAuctions);

//Likes
router.post('/:productId/like', authMiddleware.isAuthenticated, productsController.like);
router.delete('/:productId/unlike', authMiddleware.isAuthenticated, productsController.unlike);
router.get('/liked', authMiddleware.isAuthenticated, auctionController.getLikes);

//Purchase
router.post('/purchase', authMiddleware.isAuthenticated, productPurchaseController.createPurchase);
router.get('/purchase/:id', authMiddleware.isAuthenticated, productPurchaseController.detail);
router.patch('/purchase/:id', authMiddleware.isAuthenticated, productPurchaseController.update);

module.exports = router;