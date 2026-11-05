/* Meine bunte Welt – Offline-Shell v2.9.1 */
const CACHE = 'bunte-welt-v2.9.1';
const ASSETS = [
  './', './index.html', './style.css?v=2.9.1', './v2.css?v=2.9.1', './extra.js?v=2.9.1', './v2.js?v=2.9.1', './soundboard.js?v=2.9.1', './app.js?v=2.9.1',
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
    event.respondWith((async () => {
      try {
        const response = await fetch(req, {cache: 'no-cache'});
        if (response.ok) {
          event.waitUntil(caches.open(CACHE).then(cache =>
            cache.put(new URL('./index.html', scopeURL).href, response.clone())
          ));
        }
        return response;
      } catch {
        return (await caches.match(new URL('./index.html', scopeURL).href)) || Response.error();
      }
    })());
    return;
  }
  // Nur eigene App-Dateien zwischenspeichern, keine beliebigen anderen Dateien.
  if (!coreURLs.has(url.href)) return;
  // Online zuerst frische Dateien laden; offline auf gespeicherte Dateien zurückfallen.
  event.respondWith((async () => {
    try {
      const response = await fetch(req, {cache: 'no-cache'});
      if (response.ok) {
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, response.clone())));
      }
      return response;
    } catch {
      return (await caches.match(req)) || Response.error();
    }
  })());
});
