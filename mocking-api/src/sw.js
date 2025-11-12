self.addEventListener('fetch', (event) => {
  console.log(`👁️ [sw.js] ${event.request.url}`);
  return fetch(event.request.url);
});
