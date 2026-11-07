/* Meine bunte Welt – Offline-Shell v2.16.1 */
const CACHE = 'bunte-welt-v2.16.1';
const ASSETS = [
  ...Array.from({length:9}, (_, i) => `./audio/xylo-${i}.wav`),
  './motifs/simple-firetruck.svg','./motifs/simple-tractor.svg','./motifs/simple-rabbit.svg',
  './malkiste-coloring.js?v=2.16.1', './motifs/malkiste-pferd-fohlen.png', './motifs/malkiste-einhorn-regenbogen.png', './motifs/malkiste-pferd-pony.png', './motifs/malkiste-einhorn-baby.png', './motifs/malkiste-katze-wollknaeuel.png', './motifs/malkiste-hund-knochen.png', './motifs/malkiste-hase-karotte.png', './motifs/malkiste-kuh.png', './motifs/malkiste-huehner.png', './motifs/malkiste-traktor.png', './motifs/malkiste-feuerwehrauto.png',
  './motifs/horse-sheet.js?v=2.16.1', './motifs/unicorn-sheet.js?v=2.16.1', './motifs/pony-sheet.js?v=2.16.1',
  './worlds.js?v=2.16.1', './worlds/hof.js?v=2.16.1', './worlds/haus.js?v=2.16.1', './worlds/wald.js?v=2.16.1', './worlds/meer.js?v=2.16.1', './worlds/stadt.js?v=2.16.1', './worlds/zauber.js?v=2.16.1',
  './gestures.js?v=2.16.1', './phone.css?v=2.16.1', './', './index.html', './style.css?v=2.16.1', './v2.css?v=2.16.1', './extra.js?v=2.16.1', './v2.js?v=2.16.1', './soundboard.js?v=2.16.1', './app.js?v=2.16.1', './horse-unicorn-coloring.js?v=2.16.1', './mini-games-plus.js?v=2.16.1', './mini-games-plus.css?v=2.16.1',
  './motifs/dog.svg', './motifs/horse.svg', './motifs/unicorn.svg', './motifs/cow.svg', './motifs/mickey.svg', './motifs/minnie.svg', './motifs/lucy.svg', './motifs/whale.svg', './motifs/tractor.svg', './motifs/castle.svg', './motifs/chase.svg', './motifs/marshall.svg', './motifs/skye.svg', './motifs/peppa.svg', './motifs/miffy.svg',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
const scopeURL = new URL(self.registration.scope);
const coreURLs = new Set(ASSETS.map(path => new URL(path, scopeURL).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(ASSETS.map(path => new Request(new URL(path, scopeURL), {cache:'reload'})))));
});
self.addEventListener('activate', event => {
  // Natural activation waits for tabs controlled by the previous worker to close.
  event.waitUntil((async()=>{
    for(const key of await caches.keys()){
      if(/^bunte-welt-v[0-9.]+$/.test(key)&&key!==CACHE)await caches.delete(key);
    }
    await self.clients.claim();
  })());
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

