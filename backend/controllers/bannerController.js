const { Banner } = require('../db');  // Import the Banner model from db.js

const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 }); // optional: newest first
        res.json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addBanner = async (req, res) => {
    try {
        const { title } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !imagePath) {
            return res.status(400).json({ message: 'Title and image are required' });
        }

        const banner = await Banner.create({
            title,
            image: imagePath,
            createdAt: new Date()   // optional – Mongoose already has default, but explicit is fine
        });

        res.status(201).json(banner);
    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        res.json({ message: 'Banner removed', deletedBanner: banner });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getBanners, addBanner, deleteBanner };
