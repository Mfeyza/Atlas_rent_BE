"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    // return next();

    if (req.user && req.user.isActive) {
      next();
    } else {
      res.statusCode = 403;
      throw new Error("NoPermission: You must Login");
    }
  },
  isAdmin: (req, res, next) => {
    // return next();
    if (req.user && req.user.isActive && req.user.isAdmin ) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be Admin");
    }
  },
  isLandLord: (req, res, next) => {
    // return next();
    if (req.user && req.user.isActive && req.user.isLandLord ||req.user.isAdmin ) {
      return next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermisson: You must login and to be Landlord");
    }
  },
};
