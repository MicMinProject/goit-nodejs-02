const passport = require('passport');

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt",{session: false}, (err,user) => {
    if(!user || err) {res.status(401).json({message: "Unauthorized"})};
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authMiddleware
