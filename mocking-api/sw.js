// Mock GitHub user profiles
const mockUsers = {
  edysegura: {
    login: 'edysegura',
    id: 1234567,
    avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4',
    url: 'https://api.github.com/users/edysegura',
    name: 'Edy Segura',
    company: 'Tech Company',
    blog: 'https://edysegura.com',
    location: 'Brazil',
    email: null,
    bio: 'Web Developer & Open Source Enthusiast',
    twitter_username: 'edysegura',
    public_repos: 45,
    followers: 250,
    following: 100,
    created_at: '2010-05-15T00:00:00Z',
    updated_at: '2024-11-13T00:00:00Z',
  },
  torvalds: {
    login: 'torvalds',
    id: 1,
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    url: 'https://api.github.com/users/torvalds',
    name: 'Linus Torvalds',
    company: 'Linux Foundation',
    location: 'Portland, OR',
    bio: 'Creator of Linux',
    public_repos: 100,
    followers: 50000,
    following: 0,
    created_at: '2005-05-16T00:00:00Z',
    updated_at: '2024-11-13T00:00:00Z',
  },
  gvanrossum: {
    login: 'gvanrossum',
    id: 2,
    avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
    url: 'https://api.github.com/users/gvanrossum',
    name: 'Guido van Rossum',
    company: 'Python Software Foundation',
    location: 'United States',
    bio: 'Creator of Python',
    public_repos: 50,
    followers: 30000,
    following: 10,
    created_at: '2007-09-03T00:00:00Z',
    updated_at: '2024-11-13T00:00:00Z',
  },
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  console.log(`👁️ [sw.js] ${event.request.url}`);

  // Check if this is a GitHub API user request
  if (url.hostname === 'api.github.com' && url.pathname.startsWith('/users/')) {
    const username = url.pathname.split('/')[2];

    // Check if we have mock data for this user
    if (mockUsers[username]) {
      console.log(`✅ [sw.js] Returning mocked data for user: ${username}`);
      const mockResponse = new Response(JSON.stringify(mockUsers[username]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Mocked': 'true',
        },
      });
      event.respondWith(mockResponse);
      return;
    } else {
      console.log(
        `❌ [sw.js] No mock data for user: ${username}, returning 404`,
      );
      const notFoundResponse = new Response(
        JSON.stringify({
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'X-Mocked': 'true',
          },
        },
      );
      event.respondWith(notFoundResponse);
      return;
    }
  }

  // For all other requests, pass through to the network
  event.respondWith(fetch(event.request));
});
