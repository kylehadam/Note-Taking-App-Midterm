const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', (err, hashedPassword) => {
          if (err) {
            console.error('Error in pbkdf2:', err);
            return done(err);
          }

          if (!crypto.timingSafeEqual(Buffer.from(user.passwordHash, 'base64'), hashedPassword)) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }

          return done(null, user);
        });
      } catch (err) {
        console.error('Error finding user:', err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, user.id);
    });
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, null);
    }
  });
};
