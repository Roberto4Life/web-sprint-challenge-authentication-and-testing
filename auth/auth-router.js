const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const Users = require('../users/users-model.js');

router.post('/register', async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;
  try {
    const saved = await Users.add(user);cd
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findBy({ username: username });
    console.log(user)
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: 'welcome to the api', token: token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ message: 'working on it' });
  }
});

function generateToken(user) {
  const secret = process.env.JWT_SECRET || "secret";
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "24h"
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;
