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
  const requestUrl = new URL(event.request.url);

  // Intercept download requests
  if (
    requestUrl.pathname === '/download' &&
    requestUrl.searchParams.has('type')
  ) {
    event.respondWith(handleDownload(requestUrl));
    return;
  }

  // For other requests, fetch normally
  event.respondWith(fetch(event.request));
});
