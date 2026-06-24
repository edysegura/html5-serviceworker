const cacheName = 'image-fallback-v2';

const preCachedAssets = ['./images/fallback.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(preCachedAssets)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== cacheName)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetchFromCache(event.request));
});

async function fetchFromCache(request) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;
  try {
    const response = await fetch(request);
    if (
      !response.ok &&
      response.type !== 'opaque' &&
      request.destination === 'image'
    ) {
      return cache.match('./images/fallback.webp');
    }
    return response;
  } catch {
    if (request.destination === 'image') {
      return cache.match('./images/fallback.webp');
    }
    throw new Error(`Unable to fetch ${request.url}`);
  }
}
