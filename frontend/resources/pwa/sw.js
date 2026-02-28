const CACHE_VERSION = 'simsasukgo-v1';
const CACHE_NAME = `simsasukgo-static-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('simsasukgo-static-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const isNavigationRequest = event.request.mode === 'navigate';

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const url = new URL(event.request.url);
          const isStaticAsset =
            url.origin === self.location.origin &&
            (url.pathname.startsWith('/_next/static/') || STATIC_ASSETS.includes(url.pathname));

          if (isStaticAsset && response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }

          return response;
        })
        .catch(() => (isNavigationRequest ? caches.match('/') : Response.error()));
    })
  );
});
