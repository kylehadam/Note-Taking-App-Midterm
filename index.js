const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const responseTime = require('response-time');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Dynamic CORS configuration based on the PORT variable
const corsOrigin = `http://127.0.0.1:${process.env.PORT || 3000}`;
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json()); // Add body-parser middleware
app.use(morgan('dev'));
app.use(responseTime());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 43200000 // Set cookie expiry time (12 hours)
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
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
app.use('/api', noteRoutes); // Ensure this is correctly set up for /api routes
app.use('/auth', authRoutes);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
