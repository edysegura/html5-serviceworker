const cacheName = 'picture-cache'

async function precache() {
  const cache = await caches.open(cacheName)
  return cache.addAll([
    './',
    './index.html',
    './index.js'
  ])
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})
