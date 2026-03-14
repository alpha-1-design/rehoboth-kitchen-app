// Service Worker for Push Notifications + Auto Update
const CACHE_VERSION = 'v1.0.1';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('message', function(event) {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('push', function(event) {
  let data = { title: 'Rehoboth Kitchen', body: 'New notification!', icon: '/logo.png', badge: '/logo.png' };
  if (event.data) {
    try { data = event.data.json(); } catch (e) {}
  }
  const options = {
    body: data.body, icon: data.icon || '/logo.png', badge: data.badge || '/logo.png',
    vibrate: [200, 100, 200], tag: 'rehoboth-notification', requireInteraction: false,
    data: data.data || {},
    actions: [{ action: 'open', title: 'View', icon: '/logo.png' }, { action: 'close', title: 'Dismiss' }]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow('/'));
  }
});
