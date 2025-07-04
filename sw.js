const CACHE_NAME = '5elements-cache-v1';
const urlsToCache = [
  '/',
  '/wuxing-theme/index.html',
  '/wuxing-theme/style.css',
  '/wuxing-theme/script.js',
  '/wuxing-theme/manifest.json',
  '/wuxing-theme/images/icon-192x192.png',
  '/wuxing-theme/images/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
}); 