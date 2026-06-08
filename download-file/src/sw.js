import { handleDownload } from './helpers.js';

const downloadCacheName = 'file-downloads-v1';

self.addEventListener('install', (event) => {
  console.log('[Service Worker] installing service worker...', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept download requests
  if (url.pathname === '/download' && url.searchParams.has('type')) {
    event.respondWith(handleDownload(event.request));
    return;
  }

  // For other requests, fetch normally
  event.respondWith(fetch(event.request));
});
