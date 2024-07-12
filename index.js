const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const responseTime = require('response-time');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// CORS configuration for a single origin
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json()); // Add body-parser middleware
app.use(morgan('dev'));
app.use(responseTime());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Set to false to ensure sessions are not saved unless modified
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Helps prevent cross-site scripting attacks
    maxAge: 600000 // Set cookie expiry time (10 minutes)
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport);

mongoose.set('strictQuery', true);

// Connect to MongoDB
connectDB();

// Middleware and Routes
app.use('/api', noteRoutes);
app.use('/auth', authRoutes);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Set the port (default to 3000 if not set in environment variables)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
