'use strict'

class Index {

  constructor() {
    this.registerServiceWorker()
  }

  registerServiceWorker() {
    console.log('Registring Service Worker...')

    const success = () => console.log('Service registration successful')
    const failure = () => console.log('Service registration failed')

    navigator.serviceWorker
      .register('./sw.js')
      .then(success)
      .catch(failure)
  }

}

new Index()