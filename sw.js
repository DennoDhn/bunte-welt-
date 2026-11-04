/* Meine bunte Welt – Offline-Shell v2.8.0 */
const CACHE = 'bunte-welt-v2.8.0';
const ASSETS = [
  './', './index.html', './style.css?v=2.8.0', './v2.css?v=2.8.0', './extra.js?v=2.8.0', './v2.js?v=2.8.0', './soundboard.js?v=2.8.0', './app.js?v=2.8.0',
  './motifs/whale.svg', './motifs/tractor.svg', './motifs/castle.svg', './motifs/chase.svg', './motifs/marshall.svg', './motifs/skye.svg', './motifs/peppa.svg', './motifs/miffy.svg',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
const scopeURL = new URL(self.registration.scope);
const coreURLs = new Set(ASSETS.map(path => new URL(path, scopeURL).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(ASSETS.map(path => new Request(new URL(path, scopeURL), {cache:'reload'}))))
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
    event.respondWith(fetch(req, {cache:'no-cache'}).catch(async () =>
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
