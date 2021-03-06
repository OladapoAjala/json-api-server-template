/**
 * This file contains route handlers to:
 *    1. Update user name or email
 *    2. Delete current user
 *    3. Get current user details
 * @module controllers/userController
 */
const User = require('../models/userModels');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

/**
 * Filter request data to update only allowed user details
 * @function
 * @param {*} dataObj
 * @param  {...any} allowedFields
 * @returns {filteredObj} An object with the allowedFields as its property.
 */
const filterData = (dataObj, ...allowedFields) => {
  const filteredObj = {};
  allowedFields.forEach((field) => {
    filteredObj[field] = dataObj[field];
  });

  return filteredObj;
};

/**
 * Update user name or email
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This url is not for password update', 400));
  }

  const filteredData = filterData(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

/**
 * Delete current user
 */
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Get current user details
 */
exports.getMe = catchAsync(async (req, res, next) => {
  req.user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      data: req.user,
    },
  });
});

/**
 * Create new user (Not Available!)
 */
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: "This route hasn't been implemented yet./n Please use /signup",
  });
};

// This should only be used by admin users
/**
 * Get all users
 */
exports.getAllUsers = factory.getAll(User);

/**
 * Get user details by ID
 */
exports.getUser = factory.getOne(User);

/**
 * Update user details by ID
 */
exports.updateUser = factory.updateOne(User);

/**
 * Delete user by ID
 */
exports.deleteUser = factory.deleteOne(User);
