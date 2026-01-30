// Service Worker for Push Notifications
console.log('Service Worker: Script loaded');

self.addEventListener('install', function(event) {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('Service Worker: Push received!', event);
  
  let data = {
    title: 'Rehoboth Kitchen',
    body: 'New notification!',
    icon: '/logo.png',
    badge: '/logo.png'
  };
  
  if (event.data) {
    try {
      data = event.data.json();
      console.log('Push data:', data);
    } catch (e) {
      console.error('Failed to parse push data:', e);
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    vibrate: [200, 100, 200],
    tag: 'rehoboth-notification',
    requireInteraction: false,
    data: data.data || {},
    actions: [
      { action: 'open', title: 'View', icon: '/logo.png' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => console.log('Notification shown successfully'))
      .catch(err => console.error('Failed to show notification:', err))
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.action);
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
