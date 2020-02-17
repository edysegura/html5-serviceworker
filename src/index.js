'use strict'

class Index {

  constructor() {
    this.registerServiceWorker()
  }

  registerServiceWorker() {
    console.log('[Service Worker] Registring...')

    const success = () => console.log('[Service Worker] registration successful')
    const failure = () => console.log('[Service Worker] registration failed')

    navigator.serviceWorker
      .register('./sw.js')
      .then(success)
      .catch(failure)
  }

}

new Index()