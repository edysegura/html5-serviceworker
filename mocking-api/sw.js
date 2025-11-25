import {
  getMockUser,
  createMockResponse,
  createNotFoundResponse,
} from './src/modules/github-mock-api.js';

const isGithubUserRequest = (url) =>
  url.hostname === 'api.github.com' && url.pathname.startsWith('/users/');

const extractUsername = (url) => {
  const parts = url.pathname.split('/');
  return parts[2] || null;
};

const createResponseForUser = (username) => {
  if (!username) {
    console.log('❌ [sw.js] Invalid username in request, returning 404');
    return createNotFoundResponse();
  }

  const mockUser = getMockUser(username);
  if (mockUser) {
    console.log(`✅ [sw.js] Returning mocked data for user: ${username}`);
    return createMockResponse(mockUser);
  }

  console.log(`❌ [sw.js] No mock data for user: ${username}, returning 404`);
  return createNotFoundResponse();
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  console.log(`👁️ [sw.js] ${event.request.url}`);

  if (isGithubUserRequest(url)) {
    const username = extractUsername(url);
    event.respondWith(createResponseForUser(username));
    return;
  }

  // For all other requests, pass through to the network
  event.respondWith(fetch(event.request));
});
