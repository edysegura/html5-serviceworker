const cacheName = 'image-fallback-v1';
const IMAGE_FALLBACK = './images/fallback.webp';
const preCachedAssets = [IMAGE_FALLBACK];

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
  event.respondWith(imageFallbackProxy(event.request));
});

async function imageFallbackProxy(request) {
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
      return cache.match(IMAGE_FALLBACK);
    }
    return response;
  } catch {
    if (request.destination === 'image') {
      return cache.match(IMAGE_FALLBACK);
    }
    throw new Error(`Unable to fetch ${request.url}`);
  }
}
