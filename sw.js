/* Meine bunte Welt – Offline-Shell v1.3.0 */
const CACHE = 'bunte-welt-v2.0.0';
const ASSETS = [
  './', './index.html', './style.css', './v2.css', './extra.js', './v2.js', './app.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
const scopeURL = new URL(self.registration.scope);
const coreURLs = new Set(ASSETS.map(path => new URL(path, scopeURL).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(ASSETS))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('bunte-welt-') && k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== scopeURL.origin || !url.pathname.startsWith(scopeURL.pathname)) return;

  // Navigation: Aktuelle Version online laden, gespeicherte Startseite offline öffnen.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(async () =>
      (await caches.match(new URL('./index.html', scopeURL).href)) || Response.error()
    ));
    return;
  }
  // Nur eigene App-Dateien zwischenspeichern, keine beliebigen anderen Dateien.
  if (!coreURLs.has(url.href)) return;
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
    if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, response.clone())));
    return response;
  })));
});
