const CACHE_NAME = 'pronunciation-master-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.pathname.startsWith('/api/ontology')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (APP_SHELL.includes(url.pathname) || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request).then((res) => {
    if (res.ok) {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(request, clone));
    }
    return res;
  });
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(request, clone));
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ offline: true, error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
