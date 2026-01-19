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

// 1. Point to the root frontend folder for static assets (CSS/JS)
const frontendPath = path.join(process.cwd(), 'frontend');
app.use(express.static(frontendPath));

// 2. Point specifically to the 'pages' subfolder for the HTML file
app.get('/', (req, res) => {
    // We add 'pages' here because that's where index.html lives in your project
    res.sendFile(path.join(frontendPath, 'pages', 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

module.exports = app;