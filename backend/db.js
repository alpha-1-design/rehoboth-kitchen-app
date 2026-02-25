// db.js - Connection + dotenv conditional

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('Local dev: Loaded variables from .env file');
} else {
  console.log('Production (Render): Using environment variables directly');
}

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ MONGO_URI missing from environment variables!');
  process.exit(1);
}

console.log('Attempting connection to:', uri.replace(/:.*@/, ':****@'));

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  family: 4
})
  .then(() => {
    console.log('✅ MongoDB Connected successfully! 🎉');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error message:', err.message);
    console.error('Full error:', err);
  });

// ---------------------------------------------------
// Your schemas start here (keep everything below this line unchanged)
// ---------------------------------------------------

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  avatar: String,
  ghanaPost: String,
  momoNumber: String,
  region: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: Array,
  createdAt: { type: Date, default: Date.now }
});

// Add these new schemas (adjust fields based on what data you insert)
const bannerSchema = new mongoose.Schema({
  title: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  // add your actual order fields, e.g.
  userId: String,  // or mongoose.Schema.Types.ObjectId
  items: Array,
  total: Number,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const supportSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  reply: String,
  status: { type: String, default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  recipient: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const suggestionSchema = new mongoose.Schema({
  name: String,
  email: String,
  text: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  video: String,
  createdAt: { type: Date, default: Date.now }
});

const subscriptionSchema = new mongoose.Schema({
  userId: String,
  subscription: Object,  // VAPID subscription object
  createdAt: { type: Date, default: Date.now }
});

// Export all models
module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Banner: mongoose.model('Banner', bannerSchema),
  Order: mongoose.model('Order', orderSchema),
  Support: mongoose.model('Support', supportSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Suggestion: mongoose.model('Suggestion', suggestionSchema),
  Video: mongoose.model('Video', videoSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema)
};
