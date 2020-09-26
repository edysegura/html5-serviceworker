const cacheName = 'picture-cache-v1'

const preCachedAssets = [
  './',
  './index.html',
  './index.js',
  './no-photo.svg',
  './css/style.css',
]

async function precache() {
  const cache = await caches.open(cacheName)
  return cache.addAll(preCachedAssets)
}

function removeOldCache(key) {
  if (key !== cacheName) {
    console.log('[Service Worker] removing old cache')
    return caches.delete(key)
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys()
  return Promise.all(keyList.map(removeOldCache))
}

self.addEventListener('install', (event) => {
  console.log('[Service Worker] installing service worker...', event)
  event.waitUntil(precache())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event)
  event.waitUntil(cacheCleanup())
  return self.clients.claim()
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

  try {
    const networkResponse = await fetchFromNetwork(request)
    return networkResponse
  } catch (error) {
    return cache.match('no-photo.svg')
  }
}

async function fetchFromNetwork(request) {
  console.log('[Service Worker] saving to cache...')

  const cache = await caches.open(cacheName)
  const clonedRequest = request.clone()
  const response = await fetch(clonedRequest)
  cache.put(request, response.clone())

  return response
}
