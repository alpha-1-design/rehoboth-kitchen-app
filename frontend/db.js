const Datastore = require('nedb-promises');
const path = require('path');

const createDB = (dbName) => {
    return Datastore.create({
        filename: path.join(__dirname, 'data', `${dbName}.db`),
        autoload: true
    });
};

const usersDB = createDB('users');
const productsDB = createDB('products');
const bannersDB = createDB('banners');
const ordersDB = createDB('orders');
const subscriptionsDB = createDB('subscriptions');
const notificationsDB = createDB('notifications');
const videosDB = createDB('videos');
const suggestionsDB = createDB('suggestions');
const supportDB = createDB('support');

module.exports = { 
    usersDB, 
    productsDB, 
    bannersDB, 
    ordersDB, 
    subscriptionsDB,
    notificationsDB,
    videosDB,
    suggestionsDB,
    supportDB
};
