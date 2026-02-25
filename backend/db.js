if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI missing!');
  process.exit(1);
}

mongoose.connect(uri).then(() => console.log('MongoDB Connected!')).catch(err => console.error('MongoDB Error:', err));

// Schemas
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, phone: String, password: String, avatar: String, ghanaPost: String, momoNumber: String, region: String, isAdmin: { type: Boolean, default: false }, referralCode: String, referralCount: { type: Number, default: 0 }, referredBy: Object, googleAuth: Boolean, createdAt: { type: Date, default: Date.now } });
const productSchema = new mongoose.Schema({ name: String, price: Number, description: String, category: String, image: String, video: String, watts: String, recipes: String, rating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 }, reviews: Array, questions: Array, createdAt: { type: Date, default: Date.now } });
const bannerSchema = new mongoose.Schema({ title: String, image: String, createdAt: { type: Date, default: Date.now } });
const orderSchema = new mongoose.Schema({ userId: String, userName: String, userEmail: String, userPhone: String, items: Array, total: Number, status: { type: String, default: 'Pending' }, region: String, ghanaPost: String, momoNumber: String, momoName: String, paymentMethod: String, createdAt: { type: Date, default: Date.now } });
const supportSchema = new mongoose.Schema({ name: String, email: String, message: String, reply: String, status: { type: String, default: 'Open' }, userId: String, createdAt: { type: Date, default: Date.now } });
const notificationSchema = new mongoose.Schema({ userId: String, message: String, type: String, read: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } });
const suggestionSchema = new mongoose.Schema({ name: String, email: String, text: String, reply: String, createdAt: { type: Date, default: Date.now } });
const videoSchema = new mongoose.Schema({ title: String, description: String, video: String, createdAt: { type: Date, default: Date.now } });
const subscriptionSchema = new mongoose.Schema({ userId: String, subscription: Object, createdAt: { type: Date, default: Date.now } });

// Models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);
const Order = mongoose.model('Order', orderSchema);
const Support = mongoose.model('Support', supportSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Suggestion = mongoose.model('Suggestion', suggestionSchema);
const Video = mongoose.model('Video', videoSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// NeDB-style wrapper
const createDB = (Model) => ({
  findOne: (query) => Model.findOne(query).lean(),
  find: (query = {}) => Model.find(query).lean(),
  insert: (data) => Model.create(data),
  update: (query, update) => Model.updateOne(query, update),
  remove: (query) => Model.deleteOne(query),
});

module.exports = {
  usersDB: createDB(User),
  productsDB: createDB(Product),
  bannersDB: createDB(Banner),
  ordersDB: createDB(Order),
  supportDB: createDB(Support),
  notificationsDB: createDB(Notification),
  suggestionsDB: createDB(Suggestion),
  videosDB: createDB(Video),
  subscriptionsDB: createDB(Subscription),
};
