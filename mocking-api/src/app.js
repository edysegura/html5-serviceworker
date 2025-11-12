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

async function registerSW() {
  navigator.serviceWorker
    .register('sw.js', { type: 'module' })
    .then(() => console.log(`👁️ [app.js] service worker registered`))
    .catch(() =>
      console.log(`👁️ [app.js] failed to register the service worker`),
    );
}
registerSW();
