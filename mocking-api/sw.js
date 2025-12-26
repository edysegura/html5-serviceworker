import {
  isGithubUserRequest,
  extractUsername,
  createResponseForUser,
} from './src/modules/github-mock-api.js';

self.addEventListener('fetch', (event) => {
  console.log(`👁️ [sw.js] ${event.request.url}`);
  const url = new URL(event.request.url);
  const username = extractUsername(url);

  if (username !== 'edysegura' && isGithubUserRequest(url)) {
    event.respondWith(createResponseForUser(username));
    return;
  }

  event.respondWith(fetch(event.request));
});
