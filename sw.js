/* ===== VERSION ===== */
const CACHE_PREFIX = "ww-calculator-cache-";
const CACHE_VERSION = "v1.0.1"; // ⬅️ ĐỔI KHI UPDATE
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

/* ===== FILE CACHE ===== */
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

/* ===== INSTALL ===== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // ❌ KHÔNG skipWaiting ở đây
});

/* ===== ACTIVATE ===== */
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

/* ===== FETCH ===== */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

/* ===== UPDATE MESSAGE ===== */
self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
