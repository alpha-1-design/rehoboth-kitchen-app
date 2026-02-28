const { ordersDB } = require('../db');
const orderDB = ordersDB;
const nodemailer = require('nodemailer');
const { sendNotification } = require('./pushController');

// Your Config
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: APP_PASSWORD
  }
});

const createOrder = async (req, res) => {
    try {
        const order = {
            ...req.body,
            status: 'Pending',
            createdAt: new Date()
        };

        // 1. Save to Database
        const newOrder = await orderDB.insert(order);

        // 2. Send push notification to admin
        sendNotification({
            body: {
                title: '🛒 New Order Received!',
                body: `${order.customer.name} placed an order for GHS ${order.totalAmount}`,
                icon: '/logo.png',
                data: { orderId: newOrder._id, type: 'new_order' }
            }
        }, { json: () => {} });

        // 3. Prepare Email
        const itemsList = order.items ? order.items.map(i => `- ${i.name} (GHS ${i.price})`).join('\n') : 'No items';

        const mailOptions = {
            from: ADMIN_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Order from ${order.customer.name}`,
            text: `
NEW ORDER RECEIVED!
-------------------
Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}
Note: ${order.customer.note || 'None'}

ITEMS:
${itemsList}

TOTAL: GHS ${order.totalAmount}
            `
        };

        // 4. Send Email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.log('Email Error:', err);
            else console.log('Email Sent Successfully');
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await orderDB.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrders };

const updateOrderStatus = async (req, res) => {
    const { status, estimatedDelivery } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    try {
        const order = await ordersDB.findOne({ _id: req.params.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        const statusHistory = order.statusHistory || [];
        statusHistory.push({ status, time: new Date(), updatedBy: req.user.name });
        
        await ordersDB.update({ _id: req.params.id }, { 
            $set: { status, statusHistory, estimatedDelivery: estimatedDelivery || '' }
        });
        
        await createNotification(order.userEmail, `Your order #${req.params.id.slice(-6)} is now ${status}`);
        
        res.json({ message: 'Status updated' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { ...module.exports, updateOrderStatus };
