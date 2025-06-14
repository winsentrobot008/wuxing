// public/sw.js

// 这个是缓存的名称，如果你的网站更新了，可以修改这里的版本号 (例如 'bazi-calculator-v2')
// 这样浏览器就会重新下载新的内容，而不是使用旧的缓存
const CACHE_NAME = 'bazi-calculator-v1'; 

// 这里列出了你希望 Service Worker 缓存的所有文件
// 这样即使用户离线了，也能加载这些文件
const urlsToCache = [
  '/', // 网站的根目录，通常会加载 index.html
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json', // manifest.json 文件也需要缓存
  '/icons/icon-192x192.png', // 你的图标文件
  '/icons/icon-512x512.png'  // 你的图标文件
  // 如果你本地还引用了 Chart.js 文件，或者其他图片、字体文件等，也要加到这里
  // 例如：'/path/to/your/chart.js'
];

// 当 Service Worker 第一次安装时，它会在这里缓存所有列出的文件
self.addEventListener('install', event => {
  console.log('Service Worker: install event');
  event.waitUntil(
    caches.open(CACHE_NAME) // 打开或创建名为 CACHE_NAME 的缓存
      .then(cache => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache); // 将所有列出的文件添加到缓存中
      })
      .catch(error => {
        console.error('Service Worker: Cache addAll failed', error);
      })
  );
});

// 当浏览器请求一个资源时，Service Worker 会拦截这个请求
// 它会先检查缓存中是否有这个资源，如果有就直接返回缓存中的，否则再去网络上获取
self.addEventListener('fetch', event => {
  // 只处理 GET 请求，不拦截 POST 等请求，因为我们的 API 请求是 POST
  // Service Worker 默认不会缓存 API 请求，这是符合我们需求的
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request) // 尝试在缓存中匹配请求
        .then(response => {
          // 如果缓存中有，就返回缓存的响应
          if (response) {
            console.log('Service Worker: Fetching from cache:', event.request.url);
            return response;
          }
          // 否则，从网络获取资源，并可以考虑将其添加到缓存中
          console.log('Service Worker: Fetching from network:', event.request.url);
          return fetch(event.request).then(
            networkResponse => {
              // 检查响应是否有效
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }
              // 如果是新的有效资源，克隆一份响应并放入缓存
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return networkResponse;
            }
          );
        })
    );
  } else {
    // 对于非 GET 请求 (如 POST API 请求)，直接发送到网络
    event.respondWith(fetch(event.request));
  }
});


// 当 Service Worker 更新时，清理旧的缓存
self.addEventListener('activate', event => {
  console.log('Service Worker: activate event');
  const cacheWhitelist = [CACHE_NAME]; // 只保留当前版本的缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除不在白名单中的旧缓存
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});