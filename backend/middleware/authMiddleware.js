const jwt = require('jsonwebtoken');
const { usersDB } = require('../db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await usersDB.findOne({ _id: decoded.id });
            if (!req.user) return res.status(401).json({ message: 'Not authorized' });
            next();
        } catch (error) { 
            res.status(401).json({ message: 'Not authorized, token failed' }); 
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    // Future-proof: Check role instead of email
    if (req.user?.isAdmin === true) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { protect, admin };
