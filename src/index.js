'use strict'

class Index {

  constructor() {
    this.bindButtonAction()
    this.registerServiceWorker()
  }

  fetchImage() {
    const image = document.querySelector('img')
    const imageNumber = document.getElementById('image-id').value
    console.log('Image number: ' + imageNumber)
    image.src = `https://picsum.photos/id/${imageNumber}/500/500`
  }

  bindButtonAction() {
    const button = document.querySelector('button')
    button.addEventListener('click', () => {
      this.fetchImage()
    })
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