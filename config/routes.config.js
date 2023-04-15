const router = require ('express').Router()
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/users.controller')
const productsController = require('../controllers/products.controller')
const auctionController = require('../controllers/auction.controller')
const upload = require('../config/storage.config')

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
router.patch('/products/:id', authMiddleware.isAuthenticated, productsController.buy)
router.get('/products/:id', productsController.detail)

//Auctions
router.post('/auction', authMiddleware.isAuthenticated, upload.any(), auctionController.create);
router.get('/auction', authMiddleware.isAuthenticated, auctionController.list);
router.get('/auction/:id', authMiddleware.isAuthenticated, auctionController.detail)
router.post('/:auctionId/bid',  authMiddleware.isAuthenticated, auctionController.placeBid);

//Likes
router.post('/:productId/like', authMiddleware.isAuthenticated, productsController.like);
router.delete('/:productId/unlike', authMiddleware.isAuthenticated, productsController.unlike);
router.get('/liked', authMiddleware.isAuthenticated, auctionController.getLikes);
// router.post('/:auctionId/like', authMiddleware.isAuthenticated, auctionController.like);
// router.delete('/:auctionId/unlike', authMiddleware.isAuthenticated, auctionController.unlike);

module.exports = router;