/**
 * Error handlers
 * @module controllers/errorController
 */
const AppError = require('../utils/appError');

/**
 * Handle Cast Errors
 * @param {*} err
 * @returns {AppError}
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle duplicate value error
 * @param {*} err
 * @returns {AppError}
 */
const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate value: ${err.keyValue.name}, name must be unique`;

  return new AppError(message, 400);
};

/**
 * Handle validation error from database
 * @param {*} err
 * @returns {AppError}
 */
const handleValidationErrorDB = (err) => {
  //   let value = '';
  //   let name = '';
  //   let errorMessage = '';

  //   Object.entries(err.errors).forEach((error) => {
  //     name = error[1].properties.path;
  //     errorMessage = error[1].properties.message;
  //     value = error[1].properties.value;
  //   });

  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: '${errors.join('. ')}`;

  return new AppError(message, 400);
};

/**
 * Handle JWT Invalid token error
 * @returns {AppError}
 */
const handleJWTError = () =>
  new AppError('Invalid token, Please login again', 401);

/**
 * Handle expired JWT error
 * @returns {AppError}
 */
const handleJWTExpiredError = () =>
  new AppError('Expired token, kindly login again', 401);

/**
 * Send error in development
 * @param {*} err
 * @param {*} res
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    // status: err.status,
    error: err,
    // message: err.message,
    stack: err.stack,
  });
};

/**
 * Send error in production
 * @param {*} err
 * @param {*} res
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send details to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or unknown error
  } else {
    //   Log error to the console
    console.error('ERROR: ', err);

    // Send generic error message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

/**
 * Export error handling module
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
