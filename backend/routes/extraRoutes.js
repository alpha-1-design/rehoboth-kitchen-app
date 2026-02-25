const express = require('express');
const router = express.Router();
const { getNotifications, clearNotifications, markAsRead } = require('../controllers/notificationController');
const { addSuggestion, getSuggestions, replySuggestion } = require('../controllers/suggestionController');

// Notification Routes
router.get('/notifications', getNotifications);
router.put('/notifications/:id', markAsRead);
router.delete('/notifications', clearNotifications);

// Suggestion Routes
router.post('/suggestions', addSuggestion);
router.get('/suggestions', getSuggestions);
router.put('/suggestions/:id/reply', replySuggestion);

module.exports = router;
