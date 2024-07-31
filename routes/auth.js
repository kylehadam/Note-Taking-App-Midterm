const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const crypto = require('crypto');

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const salt = crypto.randomBytes(16).toString('base64');
    crypto.pbkdf2(password, Buffer.from(salt, 'base64'), 310000, 32, 'sha256', async (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      const newUser = new User({
        username,
        passwordSalt: salt,
        passwordHash: hashedPassword.toString('base64')
      });

      await newUser.save();
      res.json({ msg: 'You are now registered and can log in' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ msg: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error logging in user:', err);
        return next(err);
      }
      res.json({ msg: 'You are logged in', user });
    });
  })(req, res, next);
});

// Logout user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ msg: 'Something broke', error: err.message });
    }
    res.json({ msg: 'You are logged out' });
  });
});

module.exports = router;
