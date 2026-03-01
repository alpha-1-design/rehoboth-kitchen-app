const express = require('express');
const router = express.Router();
const { updateOrderStatus, createOrder, getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Define Routes
router.post('/', createOrder);
router.get('/', getOrders);

router.put('/:id/status', protect, admin, updateOrderStatus);
module.exports = router;
