/* Service Worker for RizeX Web Push Notifications */

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'RizeX Notification';
    const options = {
      body: data.body || 'You have a new update in RizeX',
      icon: data.icon || '/favicon.ico',
      badge: data.badge || '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        linkUrl: data.data?.linkUrl || '/',
        id: data.data?.id,
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Error handling push event in SW:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const linkUrl = event.notification.data?.linkUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(linkUrl);
          }
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(linkUrl);
      }
    })
  );
});
