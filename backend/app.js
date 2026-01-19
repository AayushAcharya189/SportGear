const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/authRoutes');
const gearRoutes = require('./routes/gearRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// 1. ADD THIS: Serve static files from the "frontend" folder
// This makes sure your CSS, JS, and Images load correctly
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. ADD THIS: Route for the home page
// This replaces the "API is running" message with your actual site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('SportsGearStore API is running');
});

module.exports = app;