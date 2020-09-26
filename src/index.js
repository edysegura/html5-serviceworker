'use strict'

class Index {

  constructor() {
    this.registerServiceWorker()
    this.bindFormAction()
  }

  fetchImage(imageNumber) {
    console.log('Image number: ' + imageNumber)
    const image = document.querySelector('img')
    image.src = `http://lorempixel.com/500/500/animals/${imageNumber}`
  }

  bindFormAction() {
    const form = document.querySelector('form')
    const input = form.imageId

    input.select()

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      this.fetchImage(input.value)
      input.select()
    })
  }

  registerServiceWorker() {
    console.log('[Service Worker] registring sw.js ...')

    const success = () => console.log('[Service Worker] registration successful')
    const failure = () => console.log('[Service Worker] registration failed')

    navigator.serviceWorker
      .register('./sw.js')
      .then(success)
      .catch(failure)
  }

}

new Index()