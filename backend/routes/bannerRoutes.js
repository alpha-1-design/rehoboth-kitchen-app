const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getBanners, addBanner, deleteBanner } = require('../controllers/bannerController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.get('/', getBanners);
router.post('/', upload.single('image'), addBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
