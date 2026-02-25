const { supportDB } = require('../db');
const { createNotification } = require('./notificationController');
const { sendNotification } = require('./pushController');

const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await supportDB.insert({ name, email, message, reply: '', status: 'Open', createdAt: new Date() });
        await createNotification('ADMIN', `New Support Msg from ${name}`);
        
        // Send push notification to admin
        sendNotification({
            body: {
                title: '💬 New Support Message',
                body: `${name}: ${message.substring(0, 50)}...`,
                icon: '/logo.png',
                data: { email, type: 'support_message' }
            }
        }, { json: () => {} });
        
        res.status(201).json({ message: 'Sent' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllMessages = async (req, res) => {
    try {
        const msgs = await supportDB.find({});
        res.json(msgs);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getMyMessages = async (req, res) => {
    try {
        const msgs = await supportDB.find({ email: req.query.email });
        res.json(msgs);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const replyToMessage = async (req, res) => {
    const { reply } = req.body;
    try {
        const msg = await supportDB.findOne({ _id: req.params.id });
        await supportDB.update({ _id: req.params.id }, { $set: { reply: reply, status: 'Replied' } });
        if (msg) await createNotification(msg.email, `Support replied: "${reply}"`);
        res.json({ message: 'Reply sent' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteMessage = async (req, res) => {
    await supportDB.remove({ _id: req.params.id }, {});
    res.json({ message: 'Deleted' });
};

module.exports = { sendMessage, getAllMessages, getMyMessages, replyToMessage, deleteMessage };
