const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if(!req.headers.authorization) {
      return res.status(401).json({message: 'Unthorized request'});
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
      return res.status(401).json({message: 'Unthorized request'});
    }
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY || "Secrect");
    req.userData = decoded;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
