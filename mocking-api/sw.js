import {
  isGithubUserRequest,
  extractUsername,
  createResponseForUser,
} from './src/modules/github-mock-api.js';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  console.log(`👁️ [sw.js] ${event.request.url}`);

  if (isGithubUserRequest(url)) {
    const username = extractUsername(url);
    event.respondWith(createResponseForUser(username));
    return;
  }

  event.respondWith(fetch(event.request));
});
