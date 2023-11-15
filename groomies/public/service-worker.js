// service-worker.js

// Cache name
const CACHE_NAME = 'groomies-cache-v1';

// Files you want to cache
const urlsToCache = [
    '/',
    '/index.html',
    // Add other URLs you want to cache, such as CSS, JavaScript, and image files
];

// Install service worker and cache all static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch cached assets on network request
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Return cached asset
                    return response;
                }
                // Fetch and cache the request
                return fetch(event.request).then(
                    response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Update service worker and remove old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches not in the whitelist
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
