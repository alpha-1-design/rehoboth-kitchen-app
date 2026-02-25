const { suggestionsDB } = require('../db');
const { createNotification } = require('./notificationController');

const addSuggestion = async (req, res) => {
    const { name, email, text } = req.body;
    await suggestionsDB.insert({ name, email, text, reply: '', createdAt: new Date() });
    await createNotification('ADMIN', `Suggestion from ${name}`);
    res.status(201).json({ message: 'Sent' });
};

const getSuggestions = async (req, res) => {
    const items = await suggestionsDB.find({});
    res.json(items);
};

const replySuggestion = async (req, res) => {
    const { id } = req.params;
    const { reply, userEmail } = req.body;
    await suggestionsDB.update({ _id: id }, { $set: { reply } });
    await createNotification(userEmail, `Reply to suggestion: ${reply}`);
    res.json({ message: 'Replied' });
};

module.exports = { addSuggestion, getSuggestions, replySuggestion };
