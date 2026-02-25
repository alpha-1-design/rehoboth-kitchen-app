const { usersDB } = require('../db');
const db = usersDB;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const generateReferralCode = (name) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${random}`;
};

const register = async (req, res) => {
    const { name, email, phone, password, referralCode } = req.body;
    try {
        const userExists = await db.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Check if referral code is valid
        let referredBy = null;
        if (referralCode) {
            const referrer = await db.findOne({ referralCode });
            if (referrer) {
                referredBy = { userId: referrer._id, name: referrer.name, email: referrer.email };
                await db.update({ _id: referrer._id }, { $set: { referralCount: (referrer.referralCount || 0) + 1 } });
            }
        }

        const newUser = {
            name,
            email,
            phone,
            password: hashedPassword,
            avatar: '',
            ghanaPost: '',
            momoNumber: '',
            region: 'Ashanti',
            isAdmin: false,
            referralCode: generateReferralCode(name),
            referralCount: 0,
            referredBy: referredBy,
            createdAt: new Date()
        };
        const user = await db.insert(newUser);
        res.status(201).json({
            message: 'Registration Successful',
            token: generateToken(user._id),
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                avatar: user.avatar, 
                region: user.region, 
                momoNumber: user.momoNumber, 
                ghanaPost: user.ghanaPost,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                message: 'Login Successful',
                token: generateToken(user._id),
                user: { 
                    _id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    phone: user.phone, 
                    avatar: user.avatar, 
                    region: user.region, 
                    momoNumber: user.momoNumber, 
                    ghanaPost: user.ghanaPost,
                    isAdmin: user.isAdmin || false
                }
            });
        } else { 
            res.status(401).json({ message: 'Invalid credentials' }); 
        }
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const updateProfile = async (req, res) => {
    const { _id, name, phone, ghanaPost, momoNumber, region } = req.body;
    try {
        const updateData = { name, phone, ghanaPost, momoNumber, region };
        if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

        await db.update({ _id }, { $set: updateData });
        const updatedUser = await db.findOne({ _id });
        res.json({ 
            message: 'Profile updated', 
            user: { 
                _id: updatedUser._id, 
                name: updatedUser.name, 
                email: updatedUser.email, 
                phone: updatedUser.phone, 
                avatar: updatedUser.avatar, 
                region: updatedUser.region, 
                momoNumber: updatedUser.momoNumber, 
                ghanaPost: updatedUser.ghanaPost,
                isAdmin: updatedUser.isAdmin || false
            } 
        });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with that email' });

        const newPassword = Math.random().toString(36).slice(-8) + 'A1!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.update({ email }, { $set: { password: hashedPassword } });

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.ADMIN_EMAIL, pass: process.env.APP_PASSWORD }
        });

        await transporter.sendMail({
            from: `"Rehoboth Kitchen" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: 'Your New Password - Rehoboth Kitchen',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
                    <h2 style="color: #2C5530;">Rehoboth Kitchen</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your password has been reset. Here is your new temporary password:</p>
                    <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 2px;">
                        ${newPassword}
                    </div>
                    <p style="margin-top: 20px;">Please log in and change your password immediately.</p>
                    <p style="color: #888; font-size: 12px;">If you did not request this, please contact us immediately.</p>
                </div>
            `
        });

        res.json({ message: 'New password sent to your email!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email. Try again later.' });
    }
};


const changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    try {
        const user = await db.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.update({ _id: userId }, { $set: { password: hashedPassword } });

        res.json({ message: 'Password changed successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
        const admin = require('../firebaseAdmin');
        const decoded = await admin.auth().verifyIdToken(idToken);
        const { name, email, picture } = decoded;

        let user = await db.findOne({ email });
        if (!user) {
            // Create new user from Google
            user = await db.insert({
                name,
                email,
                phone: '',
                password: '',
                avatar: picture || '',
                ghanaPost: '',
                momoNumber: '',
                region: 'Ashanti',
                isAdmin: false,
                googleAuth: true,
                createdAt: new Date()
            });
        }

        res.json({
            message: 'Login Successful',
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                region: user.region,
                momoNumber: user.momoNumber,
                ghanaPost: user.ghanaPost,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) {
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

const fixReferralCodes = async (req, res) => {
    try {
        const users = await db.find({});
        let updated = 0;
        for (const user of users) {
            if (!user.referralCode) {
                await db.update({ _id: user._id }, { $set: { 
                    referralCode: generateReferralCode(user.name),
                    referralCount: 0
                }});
                updated++;
            }
        }
        res.json({ message: `Updated ${updated} users with referral codes` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await db.find({});
        // Remove passwords before sending
        const safeUsers = users.map(u => ({ ...u, password: undefined }));
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, updateProfile, forgotPassword, changePassword, googleLogin, getUsers, fixReferralCodes };
