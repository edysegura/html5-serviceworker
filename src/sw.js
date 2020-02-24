const cacheName = 'picture-cache-v1'

const preCachedAssets = [
  './',
  './index.html',
  './index.js'
]

async function precache() {
  const cache = await caches.open(cacheName)
  return cache.addAll(preCachedAssets)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    precache().then(() => self.skipWaiting())
  )
})

async function fetchFromCache(request) {
  const cache = await cache.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    console.log('[Service Worker] fetched from cache...')
    return cachedResponse
  }

  return addRequestToCache(request)
}

async function addRequestToCache(request) {
  console.log('[Service Worker] saving to cache...')

  const cache = await cache.open(cacheName)
  const clonedRequest = request.clone()
  const response = fetch(clonedRequest)
  cache.put(request, response.clone())

  return response
}