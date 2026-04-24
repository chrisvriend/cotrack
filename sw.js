// Service Worker — Groene Stroom PWA
// Beheert caching en offline ondersteuning

const CACHE_NAME = 'groene-stroom-v1';
const CACHE_STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap',
];

// Installatie: cache statische bestanden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_STATIC.filter(url => !url.startsWith('http') || url.includes('fonts.googleapis'))))
      .catch(() => {})
  );
  self.skipWaiting();
});

// Activatie: verwijder oude caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategie:
// - Statische assets: Cache First
// - NED.nl API: Network First (met cache fallback)
// - Open-Meteo: Network First
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NED.nl en Open-Meteo: probeer netwerk, val terug op cache
  if (url.hostname === 'api.ned.nl' || url.hostname === 'api.open-meteo.com') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          // Sla succesvolle API-respons op in cache
          if (resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          }
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts: Cache First
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Lokale bestanden: Cache First met netwerk fallback
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(resp => {
          if (resp.ok && event.request.method === 'GET') {
            caches.open(CACHE_NAME).then(c => c.put(event.request, resp.clone()));
          }
          return resp;
        })
      )
  );
});

// Achtergrond sync (voor toekomstig gebruik)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    // Hier kan data gesynchroniseerd worden op de achtergrond
  }
});
