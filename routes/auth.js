const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register page
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    User.findOne({ username: username }).then(user => {
      if (user) {
        res.status(400).json({ msg: 'Username already exists' });
      } else {
        const newUser = new User({
          username,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.json({ msg: 'You are now registered and can log in' });
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login page
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ msg: 'You are logged out' });
});

module.exports = router;
