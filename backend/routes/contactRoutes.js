const express = require('express');
const router = express.Router();

const {
  sendContactMessage
} = require('../controllers/contactController');

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post('/', sendContactMessage);

module.exports = router;
