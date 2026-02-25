const express = require('express');
const router = express.Router();
const { upload } = require('../cloudinary');
const { getProducts, getProductById, addProduct, deleteProduct, addReview, askQuestion, answerQuestion } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts); // Public: Everyone can see products
router.get('/:id', getProductById); // Public

// PROTECTED: Only Admin can add/delete
router.post('/', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), addProduct);
router.delete('/:id', protect, admin, deleteProduct);

// PROTECTED: Any Logged in user can review
router.post('/:id/reviews', protect, addReview);
router.post('/:id/questions', protect, askQuestion);
router.put('/:id/questions', protect, admin, answerQuestion);

module.exports = router;
