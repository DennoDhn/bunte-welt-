/* Meine bunte Welt – Offline-Shell v2.14.3 */
const CACHE = 'bunte-welt-v2.14.3';
const ASSETS = [
  './malkiste-coloring.js?v=2.14.3', './motifs/malkiste-pferd-fohlen.png', './motifs/malkiste-einhorn-regenbogen.png',
  './motifs/horse-sheet.js?v=2.14.3', './motifs/unicorn-sheet.js?v=2.14.3', './motifs/pony-sheet.js?v=2.14.3',
  './worlds.js?v=2.14.3', './worlds/hof.js?v=2.14.3', './worlds/haus.js?v=2.14.3', './worlds/wald.js?v=2.14.3', './worlds/meer.js?v=2.14.3', './worlds/stadt.js?v=2.14.3', './worlds/zauber.js?v=2.14.3',
  './gestures.js?v=2.14.3', './phone.css?v=2.14.3', './', './index.html', './style.css?v=2.14.3', './v2.css?v=2.14.3', './extra.js?v=2.14.3', './v2.js?v=2.14.3', './soundboard.js?v=2.14.3', './app.js?v=2.14.3', './horse-unicorn-coloring.js?v=2.14.3', './mini-games-plus.js?v=2.14.3', './mini-games-plus.css?v=2.14.3',
  './motifs/dog.svg', './motifs/horse.svg', './motifs/unicorn.svg', './motifs/horse-color.svg', './motifs/unicorn-color.svg', './motifs/cow.svg', './motifs/mickey.svg', './motifs/minnie.svg', './motifs/lucy.svg', './motifs/whale.svg', './motifs/tractor.svg', './motifs/castle.svg', './motifs/chase.svg', './motifs/marshall.svg', './motifs/skye.svg', './motifs/peppa.svg', './motifs/miffy.svg',
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
  // Open tabs may still need their previous version's assets.
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== scopeURL.origin || !url.pathname.startsWith(scopeURL.pathname)) return;
  if (req.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(new URL('./index.html', scopeURL).href)).then(saved => saved || fetch(req)));
    return;
  }
  const versionedAsset = /\.(js|css)$/.test(url.pathname) && url.searchParams.has('v');
  if (!coreURLs.has(url.href) && !versionedAsset) return;
  event.respondWith((async () => {
    const current = await caches.open(CACHE);
    const saved = await current.match(req) || await caches.match(req);
    return saved || fetch(req);
  })());
});

