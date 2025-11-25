import {
  getMockUser,
  createMockResponse,
  createNotFoundResponse,
} from './src/modules/github-mock-api.js';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  console.log(`👁️ [sw.js] ${event.request.url}`);

  // Check if this is a GitHub API user request
  if (url.hostname === 'api.github.com' && url.pathname.startsWith('/users/')) {
    const username = url.pathname.split('/')[2];
    const mockUser = getMockUser(username);

    if (mockUser) {
      console.log(`✅ [sw.js] Returning mocked data for user: ${username}`);
      event.respondWith(createMockResponse(mockUser));
      return;
    }

    console.log(`❌ [sw.js] No mock data for user: ${username}, returning 404`);
    event.respondWith(createNotFoundResponse());
    return;
  }

  // For all other requests, pass through to the network
  event.respondWith(fetch(event.request));
});
