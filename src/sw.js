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
  event.waitUntil(precache().then(() => self.skipWaiting()))
})
