const { subscriptionsDB } = require('../db');

const subscribe = async (req, res) => {
  try {
    const { subscription, userId } = req.body;
    const existing = await subscriptionsDB.findOne({ endpoint: subscription.endpoint });
    if (existing) return res.json({ message: 'Already subscribed' });
    
    await subscriptionsDB.insert({ userId: userId || 'anonymous', subscription, createdAt: new Date() });
    res.json({ message: 'Subscription saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save subscription' });
  }
};

const sendNotification = async (req, res) => {
  try {
    const notificationData = req.body || req;
    const { title, body, icon, badge, data } = notificationData;
    const allSubs = await subscriptionsDB.find({});
    if (allSubs.length === 0) return res && res.json ? res.json({ message: 'No subscribers', sent: 0 }) : null;
    
    const webpush = require('web-push');
    webpush.setVapidDetails('mailto:chef@kitchen.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    
    const payload = JSON.stringify({ title: title || 'Rehoboth Kitchen', body: body || 'New update!', icon: icon || '/logo.png', badge: badge || '/logo.png', data: data || {} });
    
    let successCount = 0, failedCount = 0;
    for (const sub of allSubs) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        successCount++;
      } catch (error) {
        failedCount++;
        if (error.statusCode === 410) await subscriptionsDB.remove({ _id: sub._id });
      }
    }
    
    const result = { message: 'Notifications sent', sent: successCount, failed: failedCount };
    return res && res.json ? res.json(result) : result;
  } catch (error) {
    return res && res.status ? res.status(500).json({ message: 'Failed to send' }) : null;
  }
};

module.exports = { subscribe, sendNotification };
