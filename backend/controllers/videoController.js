	const { videosDB } = require('../db');

const getVideos = async (req, res) => {
    const videos = await videosDB.find({});
    res.json(videos.reverse());
};

const addVideo = async (req, res) => {
    const { title, description } = req.body;
    const videoPath = req.file ? `/uploads/${req.file.filename}` : '';
    if (!videoPath) return res.status(400).json({ message: 'Video required' });

    await videosDB.insert({ title, description, video: videoPath, createdAt: new Date() });
    res.status(201).json({ message: 'Video Uploaded' });
};

const deleteVideo = async (req, res) => {
    await videosDB.remove({ _id: req.params.id }, {});
    res.json({ message: 'Deleted' });
};

module.exports = { getVideos, addVideo, deleteVideo };
