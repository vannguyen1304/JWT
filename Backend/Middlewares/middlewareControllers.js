const jwt = require("jsonwebtoken");

const middlewareController = {
  // verify
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token;
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not sign in");
    }
  },

  // verifyAuthDelete
  verifyAuthDelete: (req, res, next) => {
    if (req.user.id == req.params.id || req.user.admin) {
      next();
    } else {
      return res.status(401).json("You are not allowed");
    }
  },
};

module.exports = middlewareController;
