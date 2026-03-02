const express = require('express');
const passport = require('passport');
require('../config/passport');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { resetUserPassword, register, login, updateProfile, forgotPassword, changePassword, getUsers, fixReferralCodes } = require('../controllers/authController');
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

router.get('/users', protect, admin, getUsers);
router.post('/fix-referrals', protect, admin, fixReferralCodes);
router.post('/change-password', changePassword);

router.post('/reset-user-password', protect, admin, resetUserPassword);
// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL + '/login?error=google_failed' }),
    async (req, res) => {
        try {
            const jwt = require('jsonwebtoken');
            const userId = req.user._id || req.user.id;
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.redirect(process.env.FRONTEND_URL + '/login?token=' + token + '&name=' + encodeURIComponent(req.user.name) + '&email=' + encodeURIComponent(req.user.email));
        } catch (err) {
            console.error('Callback error:', err);
            res.redirect(process.env.FRONTEND_URL + '/login?error=' + encodeURIComponent(err.message));
        }
    }
);

module.exports = router;
