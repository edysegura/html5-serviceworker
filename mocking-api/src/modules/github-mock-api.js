// Mock GitHub user profiles
export const mockUsers = {
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

export function getMockUser(username) {
  return mockUsers[username];
}

export function createMockResponse(user) {
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Mocked': 'true',
    },
  });
}

export function createNotFoundResponse() {
  return new Response(
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
}

export const isGithubUserRequest = (url) =>
  url.hostname === 'api.github.com' && url.pathname.startsWith('/users/');

export const extractUsername = (url) => {
  const parts = url.pathname.split('/');
  return parts[2] || null;
};

export const createResponseForUser = (username) => {
  if (!username) {
    console.log(
      '❌ [github-mock-api.js] Invalid username in request, returning 404',
    );
    return createNotFoundResponse();
  }

  const mockUser = getMockUser(username);
  if (mockUser) {
    console.log(
      `✅ [github-mock-api.js] Returning mocked data for user: ${username}`,
    );
    return createMockResponse(mockUser);
  }

  console.log(
    `❌ [github-mock-api.js] No mock data for user: ${username}, returning 404`,
  );
  return createNotFoundResponse();
};
