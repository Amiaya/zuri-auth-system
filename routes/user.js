const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const userController = require('../controller/userController')

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.post('/forgetPassword', authController.forgetPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.post('/logout', authController.protect, authController.logggedout)

router.route('/updateRole/:id').patch(authController.protect,authController.restrictTo('admin'), userController.updateRole)
router.route('/AllUser').get(authController.protect,authController.restrictTo('admin'), userController.getAllUser)
 

router.route('/staff').get(authController.protect, authController.restrictTo('staff'), userController.staff)
router.route('/manager').get(authController.protect, authController.restrictTo('manager'), userController.manager)
router.route('/users').get(authController.protect, authController.restrictTo('users'), userController.user)


module.exports = router
