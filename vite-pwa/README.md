# Vite PWA Todo

A complete offline-ready todo app built with Vite and `vite-plugin-pwa`.

## Features

- Add, complete, delete, filter, and clear todos
- Local persistence with `localStorage`
- Web app manifest and install prompt support
- Generated service worker with Workbox through `vite-plugin-pwa`
- Offline-ready app shell with update prompt handling

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

PWA behavior is easiest to verify from a production build:

```bash
npm run build
npm run preview
```
