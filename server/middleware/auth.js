const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/app-error-handler');

module.exports = allowedRole => async function (req, res, next) {
  // Get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // Verify token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
      if(process.env.ENV == "development"){
        console.log('jwt decoded',decoded)
      }
    if (decoded.user.app === allowedRole) {
      req.user = decoded.user;
      next();
    } else {
      return next(new AppError("You don't have required permissions", 403))
      // return res.status(403).json({ msg: "You don't have required permissions" });
    }
  } catch (error) {
    return next(new AppError("Token is not valid, authorization denied", 401))
    // return res.status(401).json({ msg: 'Token is not valid, authorization denied' });
  }
};
