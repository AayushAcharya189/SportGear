const express = require('express');
const router = express.Router();

const {
  getAllGears,
  addGear,
  updateGear,
  deleteGear
} = require('../controllers/gearController');

const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Public route – anyone can view products
router.get('/', getAllGears);

// Admin-only routes
router.post('/', authenticateToken, isAdmin, addGear);
router.put('/:id', authenticateToken, isAdmin, updateGear);
router.delete('/:id', authenticateToken, isAdmin, deleteGear);

module.exports = router;
