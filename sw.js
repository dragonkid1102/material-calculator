const CACHE_VERSION = "v1.0.5"; // 🔥 PHẢI TRÙNG meta app-version
const CACHE_PREFIX = "ww-material-calculator-";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate – dọn cache cũ
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.url.includes("index.html")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// Nhận lệnh update
self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
