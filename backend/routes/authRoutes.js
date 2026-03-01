const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { resetUserPassword, register, login, updateProfile, forgotPassword, changePassword, googleLogin, getUsers, fixReferralCodes } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Configure Image Storage (Same as products)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

router.post('/register', register);
router.post('/login', login);

// NEW: Update Profile with Image
router.put('/profile', upload.single('avatar'), updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/google', googleLogin);
router.get('/users', protect, admin, getUsers);
router.post('/fix-referrals', protect, admin, fixReferralCodes);
router.post('/change-password', changePassword);

router.post('/reset-user-password', protect, admin, resetUserPassword);
module.exports = router;
