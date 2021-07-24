/**********
 * Async error handling function
 **********/
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
