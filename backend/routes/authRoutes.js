const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', loginUser);

// @route   PUT /api/auth/profile
// @desc    Update logged-in user's profile
// @access  Private
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
