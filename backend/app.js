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

// --- PING ROUTE HERE 
app.get('/ping', (req, res) => {
  res.status(200).send('Server is alive!');
});

const frontendPath = path.join(process.cwd(), 'frontend');

// 1. Serve static files from the 'frontend' root (for CSS/JS/Assets)
app.use(express.static(frontendPath));

// 2. ALSO serve static files from 'frontend/pages' 
// This allows you to visit /products.html directly!
app.use(express.static(path.join(frontendPath, 'pages')));

// 3. Keep your root route for the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages', 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

module.exports = app;