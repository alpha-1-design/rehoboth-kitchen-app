// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller functions
// Make sure your controller file is named 'authController.js' (no spaces!)
const { login, register } = require('../controllers/authController');

// Define Routes
router.post('/register', register);
router.post('/login', login);

// --- THIS WAS MISSING OR WRONG ---
module.exports = router;