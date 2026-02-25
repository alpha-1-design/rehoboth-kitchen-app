const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getVideos, addVideo, deleteVideo } = require('../controllers/videoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.get('/', getVideos);
router.post('/', upload.single('video'), addVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
