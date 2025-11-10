const button = document.querySelector('button');
button.addEventListener('click', async () => {
  console.log(`👁️ [app.js] button clicked`);
  console.log(await getUserProfile());
});

async function getUserProfile(username = 'edysegura') {
  const endpoint = `https://api.github.com/users/${username}`;
  const response = await fetch(endpoint);
  if (response.ok) return response.json();
  return null;
}
