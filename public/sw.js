self.addEventListener('push', function(event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body,
                icon: '/icon-192x192.png', // Fallback PWA Icon
                badge: '/badge-72x72.png',
                data: {
                    url: data.url || '/'
                }
            };

            event.waitUntil(
                self.registration.showNotification(data.title, options)
            );
        } catch (e) {
            console.error('Push data format not JSON', e);
        }
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Focus or open the target URL
    const targetUrl = event.notification.data.url;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If window already open, focus it
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
