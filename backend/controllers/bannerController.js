const { bannersDB } = require('../db');
const { upload } = require('../cloudinary');

const getBanners = async (req, res) => {
    try {
        const banners = await bannersDB.find({});
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addBanner = async (req, res) => {
    try {
        const { title } = req.body;
        const imageUrl = req.file ? req.file.path.replace('http://', 'https://') : null;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const banner = await bannersDB.insert({
            title,
            image: imageUrl,
            createdAt: new Date()
        });

        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        await bannersDB.remove({ _id: req.params.id });
        res.json({ message: 'Banner removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getBanners, addBanner, deleteBanner };
