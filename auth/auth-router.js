const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const Users = require('../users/users-model.js');
const {jwtSecret} = require('../config/secrets');

router.post('/register', async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;
  try {
    const saved = await Users.add(user);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
  // Users.add(user).then((saved) => {
  //   res.status(201).json(saved)
  // })
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findBy({ username: username });
    console.log(user)
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: 'welcome to the api', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ message: 'working on it' });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "24h"
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
