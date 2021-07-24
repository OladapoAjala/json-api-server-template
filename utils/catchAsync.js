/**
 * Async error handling function
 * @module utils/catchAsync
 * @returns {function}
 */
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
