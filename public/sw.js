const CACHE_NAME = 'bazi-calculator-v1'; // 缓存版本名称
const urlsToCache = [
  '/', // 缓存首页
  '/index.html',
  '/style.css', // 现在 CSS 是一个独立文件了
  '/script.js',
  '/lunar.js',
  '/calculateBazi.js',
  '/manifest.json',
  '/sw.js', // Service Worker 自己也需要被缓存
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/chart.js' // 缓存 Chart.js 库
];

// 安装 Service Worker 并缓存所有文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求，优先从缓存中获取资源
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，则返回缓存的资源
        if (response) {
          return response;
        }
        // 否则，从网络获取
        return fetch(event.request);
      })
  );
});

// 激活 Service Worker，清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 删除旧版本缓存
          }
        })
      );
    })
  );
});