const express = require('express');
const { subscribe, sendNotification } = require('../controllers/pushController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/subscribe', subscribe);
router.post('/send', sendNotification); // Testing - remove auth temporarily

module.exports = router;

