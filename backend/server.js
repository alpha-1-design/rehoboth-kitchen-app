const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supportRoutes = require('./routes/supportRoutes');
const extraRoutes = require('./routes/extraRoutes');
const videoRoutes = require('./routes/videoRoutes');
const pushRoutes = require('./routes/pushRoutes'); // <--- NEW: Push notifications

dotenv.config();
const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // Relax helmet to allow loading videos from blobs/local
  contentSecurityPolicy: false
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(cors({
  origin: ['https://rehoboth-kitchen-app.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/extras', extraRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/push', pushRoutes); // <--- NEW: Push notification endpoints

app.get('/', (req, res) => res.send('Rehoboth API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
