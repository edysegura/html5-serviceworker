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

async function addRequestToCache(request) {
  console.log('[Service Worke] saving to cache...')

  const cache = await cache.open(cacheName)
  const clonedRequest = request.clone()
  const response = fetch(clonedRequest)
  cache.put(request, response.clone())

  return response
}