const jwt = require("jsonwebtoken");



exports.requireSignin = (req, res, next) =>{
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
    }else {
      return res.status(400).send({message:"authorization require."});
    }
    next();
}

// -----------------------admin middleware----------------------------
exports.adminMiddleware = (req, res, next) =>{
    if (req.user.role !== 'administrator') {
      return res.status(400).send({message:"Guest user access Denied."});
    }
    next();
}


// -----------------------requireSignin middleware----------------------------

exports.userMiddleware = (req, res, next) =>{
  if (req.user.role !== 'customer') {
    return res.status(400).send({message:"Admin Access Denied."});
  }
  next();
}
