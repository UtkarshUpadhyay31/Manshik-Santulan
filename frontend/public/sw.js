const CACHE_NAME = 'manshik-santulan-help-v1';
const OFFLINE_URLS = [
    '/',
    '/help',
    '/index.html',
    '/@vite/client', // Vite specific dev assets
    '/src/main.jsx',
    '/src/App.jsx',
    '/src/pages/HelpPage.jsx',
    '/src/pages/LandingPage.jsx',
    '/src/components/UI.jsx',
    '/src/styles/index.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(OFFLINE_URLS).catch(err => console.log('Pre-cache error:', err));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Pass-through for non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if found
            if (response) return response;

            // Otherwise fetch and cache
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // If both fail, return index.html for navigation requests (SPA)
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
