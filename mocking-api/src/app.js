import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/+esm';

const buttons = document.querySelectorAll('button');
buttons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    console.log(`👁️ [app.js] ${btn.dataset.user} button clicked`);
    const profile = await getUserProfile(btn.dataset.user);
    showProfile(profile);
  });
});

async function getUserProfile(username) {
  const endpoint = `https://api.github.com/users/${username}`;
  const response = await fetch(endpoint);
  if (response.ok) return response.json();
  return null;
}

function showProfile(profile) {
  const pre = document.querySelector('pre');
  const code = document.createElement('code');
  pre.innerHTML = '';
  pre.appendChild(code);
  code.textContent = JSON.stringify(profile, null, 2);
  hljs.highlightElement(code);
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
