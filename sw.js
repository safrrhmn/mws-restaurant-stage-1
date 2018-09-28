var cacheName = 'v1';
var cacheFiles = [
        './',
        './index.html',
        './css/*',
        './data/*',
        './img/*',
        './js/*',
];

self.addEventListener('install', function (e) {
        var staticCache = new Cache();
        e.waitUntil(
                Promise.all([
                        caches.add(cacheName, staticCache),
                        staticCache.addAll(cacheFiles)
                ])
        );
})

self.addEventListener('activate', function (e) {
        console.log('[ServiceWorker] Activated');

        e.waitUntil(

                // Get all the cache keys (cacheName)
                caches.keys().then(function (cacheNames) {
                        return Promise.all(cacheNames.map(function (thisCacheName) {

                                // If a cached item is saved under a previous cacheName
                                if (thisCacheName !== cacheName) {

                                        // Delete that cached file
                                        console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
                                        return caches.delete(thisCacheName);
                                }
                        }));
                })
        ); // end e.waitUntil

})

self.addEventListener('fetch', function (e) {
        console.log('[ServiceWorker] Fetch', e.request.url);
        e.respondWith(
                caches.match(e.request).catch(function () {
                        return event.default();
                }).catch(function () {
                        return caches.match('./jezz.html');
                })
        );


})