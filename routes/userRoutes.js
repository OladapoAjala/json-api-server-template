const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);
// These routers update/delete users who are already logged in
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);
router.get('/me', userController.getMe);

router.use(authController.restrictTo('admin'));

/**********
 * API router for:
 *    get all user
 *    create user
 * **********/
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

/**********
 * API router for:
 *    get user by ID
 *    update user using ID
 *    delete user using ID
 * **********/
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
