const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages, getMyMessages, replyToMessage, deleteMessage } = require('../controllers/supportController');

router.post('/', sendMessage);
router.get('/', getAllMessages);
router.get('/history', getMyMessages);
router.put('/:id/reply', replyToMessage);
router.delete('/:id', deleteMessage); // <--- NEW

module.exports = router;
