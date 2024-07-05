const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions
const cors = require('cors');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/notes'); // Import the routes for notes
const connectDB = require('./config/db'); // Import the database connection

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

mongoose.set('strictQuery', true); // Set strictQuery option for mongoose

// Connect to MongoDB
connectDB();

// Use the routes for handling /api requests
app.use('/api', noteRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
