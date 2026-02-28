const { ordersDB } = require('../db');
const { createNotification } = require('./notificationController');
const { sendNotification } = require('./pushController');
const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: ADMIN_EMAIL, pass: APP_PASSWORD }
});

const createOrder = async (req, res) => {
    try {
        const order = { ...req.body, status: 'Pending', statusHistory: [], createdAt: new Date() };
        const newOrder = await ordersDB.insert(order);

        sendNotification({
            body: {
                title: '🛒 New Order Received!',
                body: `${order.userName} placed an order for GHS ${order.total}`,
                icon: '/logo.png',
                data: { orderId: newOrder._id, type: 'new_order' }
            }
        }, { json: () => {} });

        const itemsList = order.items ? order.items.map(i => `- ${i.name} x${i.quantity} (GHS ${i.price})`).join('\n') : 'No items';

        const mailOptions = {
            from: ADMIN_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Order from ${order.userName}`,
            text: `
NEW ORDER RECEIVED!
-------------------
Customer: ${order.userName}
Email: ${order.userEmail}
Phone: ${order.userPhone}
Region: ${order.region}

ITEMS:
${itemsList}

TOTAL: GHS ${order.total}
Payment: ${order.paymentMethod}
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) console.log('Email Error:', err);
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await ordersDB.find({});
        res.json(orders.reverse());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status, estimatedDelivery } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    try {
        const order = await ordersDB.findOne({ _id: req.params.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const statusHistory = order.statusHistory || [];
        statusHistory.push({ status, time: new Date() });

        await ordersDB.update({ _id: req.params.id }, {
            $set: { status, statusHistory, estimatedDelivery: estimatedDelivery || '' }
        });

        await createNotification(order.userEmail, `Your order #${req.params.id.slice(-6).toUpperCase()} is now ${status}`);

        res.json({ message: 'Status updated' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
