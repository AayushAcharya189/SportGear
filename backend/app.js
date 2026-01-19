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

// 1. Updated Static Files path
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 2. Updated Route for home page
app.get('/', (req, res) => {
    // We use path.resolve to ensure Render finds the absolute path
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

module.exports = app;