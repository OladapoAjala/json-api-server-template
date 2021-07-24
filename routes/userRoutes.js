/**
 * This file contains middlewares for all routes related to a User
 */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
/**
 * Routes for user:
 *    1. Sign Up
 *    2. Login
 *    3. Forgot password
 *    4. Reset password
 */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

/**
 * Protect all routes after this middleware from
 * unauthorized users
 */
router.use(authController.protect);

/**
 * Routes for users who are logged in.
 * Includes routes for:
 *    1. Updating user passowrd
 *    2. Updating user details
 *    3. Deleting user
 *    4. Get all user details
 */
router.patch('/update-password', authController.updatePassword);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);
router.get('/me', userController.getMe);

/**
 * Protect all routes after this middleware from
 * unauthorized users (restrict to admins only)
 */
router.use(authController.restrictTo('admin'));

/**
 * Routes for:
 *    1. getting all user
 *    2. creating a new user
 */
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

/**
 * Routes for:
 *    1. getting user by ID
 *    2. updating user using ID
 *    3. deleting user using ID
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
