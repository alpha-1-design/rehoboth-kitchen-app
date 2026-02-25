const { notificationsDB } = require('../db');
const config = require('../config');

const createNotification = async (recipient, message) => {
    try {
        await notificationsDB.insert({ recipient, message, read: false, createdAt: new Date() });
    } catch (e) { console.error(e); }
};

const getNotifications = async (req, res) => {
    const { email } = req.query;
    const query = email === config.ADMIN_EMAIL ? { recipient: 'ADMIN' } : { recipient: email };
    const notifs = await notificationsDB.find(query);
    res.json(notifs.reverse());
};

const clearNotifications = async (req, res) => {
    const { email } = req.query;
    const query = email === config.ADMIN_EMAIL ? { recipient: 'ADMIN' } : { recipient: email };
    await notificationsDB.remove(query, { multi: true });
    res.json({ message: 'Cleared' });
};

const markAsRead = async (req, res) => {
    try {
        await notificationsDB.update({ _id: req.params.id }, { $set: { read: true } });
        res.json({ message: 'Marked as read' });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { createNotification, getNotifications, clearNotifications, markAsRead };
