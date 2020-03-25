const cacheName = 'picture-cache-v0'

const preCachedAssets = [
  './',
  './index.html',
  './index.js',
  './no-photo.svg'
]

async function precache() {
  const cache = await caches.open(cacheName)
  return cache.addAll(preCachedAssets)
}

self.addEventListener('install', (event) => {
  console.log('[Service Worker] installing service worker...', event)
  event.waitUntil(precache())
})

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetchFromCache(event.request))
})

async function fetchFromCache(request) {
  console.log('[Service Worker] checking cached assets...')

  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    console.log('[Service Worker] fetched from cache...')
    return cachedResponse
  }

  return addRequestToCache(request)
}

async function addRequestToCache(request) {
  console.log('[Service Worker] saving to cache...')

  const cache = await caches.open(cacheName)
  const clonedRequest = request.clone()
  const response = await fetch(clonedRequest)
  cache.put(request, response.clone())

  return response
}
