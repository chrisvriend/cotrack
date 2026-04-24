// Service Worker — Groene Stroom PWA
const CACHE_NAME = 'groene-stroom-v2';
const BASE = '/cotrack';
const CACHE_STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_STATIC).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NED.nl en Open-Meteo: Network First, cache als fallback
  if (url.hostname === 'api.ned.nl' || url.hostname === 'api.open-meteo.com') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          if (resp.ok) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, resp.clone()));
          }
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts: Cache First
  if (url.hostname.includes('fonts.goog') || url.hostname.includes('fonts.gstat')) {
    event.respondWith(
      caches.match(event.request).then(c => c || fetch(event.request))
    );
    return;
  }

  // Lokale bestanden: Cache First
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(resp => {
        if (resp.ok && event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(c => c.put(event.request, resp.clone()));
        }
        return resp;
      })
    )
  );
});
