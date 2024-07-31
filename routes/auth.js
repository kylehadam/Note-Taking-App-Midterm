const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const newUser = new User({ username });
    newUser.setPassword(password);
    await newUser.save();

    res.json({ msg: 'You are now registered and can log in' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard', // Change to your success redirect URL
    failureRedirect: '/',
    failureFlash: true
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
