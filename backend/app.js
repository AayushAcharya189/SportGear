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

// 1. Define the correct frontend path using process.cwd()
const frontendPath = path.join(process.cwd(), 'frontend');

// 2. Serve static files (CSS, JS, Images)
app.use(express.static(frontendPath));

// 3. Update the root route to send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

module.exports = app;