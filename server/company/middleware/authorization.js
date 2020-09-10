const AppError = require('../../utils/app-error-handler');
var CompanyUser = require("../models/company-user");


exports.checkRole = (role) => async function (req, res, next) {
  let user = await CompanyUser.findById(req.user.id);
  if (user.role  == role) {
    next();
  } else {
    return next(new AppError("You do not have permission to perform this action.", 403))
  }
};


exports.checkRights = (accessRight) => async function (req, res, next) {
  let user = await CompanyUser.findById(req.user.id);
  if (user.authorizations && user.authorizations.length > 0) {
    let userRights = user.authorizations;
    // console.log('userRights', userRights)
    if (!userRights.includes(accessRight)) {
      return next(new AppError("you are not authorized to perform this operation", 403))
    } else {
      next();
    }

  } else {
    return next(new AppError("you are not authorized to perform this operation", 403))
  }

};
