const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  let url = req.originalUrl;
  if (url !== '/login' && url !== '/favicon.ico') {
    try{
      req.decoded = jwt.verify(req.headers.authorization, 'warehousemanagement');
    } catch (error) {
      error.status = 401;
      return next(error);
    }
  } 
  next()
}