const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');

// Define Routes
router.post('/', createOrder);
router.get('/', getOrders);

module.exports = router;
