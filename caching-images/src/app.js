"use strict";

class Index {
  constructor() {
    this.registerServiceWorker();
    this.bindFormAction();
  }

  fetchImage(imageNumber) {
    console.log("Image number: " + imageNumber);
    const image = document.getElementById("photo");
    const current = document.getElementById("currentId");
    image.src = `https://picsum.photos/id/${imageNumber}/500/500`;
    current.textContent = imageNumber;
  }

  bindFormAction() {
    const form = document.getElementById("imageForm");
    const input = document.getElementById("imageId");

    // Friendly focus for quick changes
    input.focus();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      this.fetchImage(val);
      input.select();
    });
  }

  registerServiceWorker() {
    console.log("[Service Worker] registering sw.js ...");

    const success = () =>
      console.log("[Service Worker] registration successful");
    const failure = (err) =>
      console.log("[Service Worker] registration failed", err);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").then(success).catch(failure);
    } else {
      console.log("[Service Worker] not supported in this browser");
    }
  }
}

new Index();
