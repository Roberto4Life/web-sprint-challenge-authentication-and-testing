const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/secrets.js');

module.exports = (req, res, next) => {

  const {authorization} = req.headers
  if(authorization){
    jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
      if (err){
        res.status(401).json({ message: 'The user is not logged in' });
      } else {
        req.decodedToken = decodedToken
        next();
      }
    })
  } else {
    res.status(401).json({ message: 'The user is not logged in' });
  }
}