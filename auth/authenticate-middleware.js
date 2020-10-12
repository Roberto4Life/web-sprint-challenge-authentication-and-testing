const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization ?
      req.headers.authorization.split(' ')[1] :
      '';
    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: 'The user is not logged in' });
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      res.status(401).json({ message: 'The user is not logged in' });
    }
  } catch (err) {
    res.status(500).json(error);
  }
}