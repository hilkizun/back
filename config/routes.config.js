const router = require ('express').Router()
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/users.controller')
const authMiddleware = require('../middlewares/auth.middleware')

//auth
router.post('/login', authController.login)

//Users
router.post('/users', userController.create)
router.get('/users', userController.list)
router.get('/users/me', authMiddleware.isAuthenticated, userController.getCurrentUser)
router.get('/users/:id', userController.getUser)

module.exports = router;