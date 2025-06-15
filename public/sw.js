const CACHE_NAME = 'bazi-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/lunar.js',
  '/calculateBazi.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // 如果 Chart.js 已经下载到本地，比如 /libs/chart.js，则加上 '/libs/chart.js'
];

// 安装 Service Worker 并缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // 立即激活新 Service Worker
});

// 激活 Service Worker，清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // 让新 Service Worker 立即接管页面
});

// 拦截请求，优先从缓存读取，缓存未命中则走网络
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(networkResponse => {
            // 可选：动态缓存新请求的资源
            // const responseClone = networkResponse.clone();
            // caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            return networkResponse;
          })
          .catch(() => {
            // 可选：离线时兜底页面
            // if (event.request.destination === 'document') {
            //   return caches.match('/offline.html');
            // }
          });
      })
  );
});