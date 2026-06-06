const CACHE_NAME = 'groene-stroom-v4';
const BASE = '/cotrack';
const CACHE_STATIC = [BASE+'/',BASE+'/index.html',BASE+'/manifest.json',BASE+'/icons/icon-192.png',BASE+'/icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CACHE_STATIC).catch(()=>{}))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname==='api.ned.nl'||url.hostname==='api.open-meteo.com') {
    e.respondWith(fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match(e.request)));
    return;
  }
  if (url.hostname.includes('fonts.goog')||url.hostname.includes('fonts.gstat')) {
    e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request))); return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok&&e.request.method==='GET')caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r;})));
});
