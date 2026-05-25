class FileDownloader {
  constructor() {
    this.downloads = [];
    this.registerServiceWorker();
    this.bindDownloadButtons();
  }

  registerServiceWorker() {
    console.log('[Service Worker] registering sw.js ...');

    const success = () =>
      console.log('[Service Worker] registration successful');
    const failure = (err) =>
      console.log('[Service Worker] registration failed', err);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js', { module: true })
        .then(success)
        .catch(failure);
    } else {
      console.log('[Service Worker] not supported in this browser');
    }
  }

  bindDownloadButtons() {
    const buttons = document.querySelectorAll('button[data-type]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const fileType = btn.dataset.type;
        this.handleDownload(fileType);
      });
    });
  }

  async handleDownload(fileType) {
    console.log(`[File Downloader] Requesting ${fileType} file download`);
    this.updateStatus(`Downloading ${fileType} file...`, 'info');

    try {
      const filename = this.generateFilename(fileType);
      const response = await fetch(
        `/download?type=${fileType}&filename=${filename}`,
      );

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // The service worker handles the actual download trigger
      this.recordDownload(filename, fileType);
      this.updateStatus(`✓ Downloaded: ${filename}`, 'success');
    } catch (error) {
      console.error('[File Downloader] Error:', error);
      this.updateStatus(`✗ Error: ${error.message}`, 'error');
    }
  }

  generateFilename(fileType) {
    const timestamp = new Date().toISOString().slice(0, 10);
    const extensions = {
      text: 'txt',
      json: 'json',
      csv: 'csv',
      image: 'png',
    };
    const ext = extensions[fileType] || fileType;
    return `download-${timestamp}.${ext}`;
  }

  recordDownload(filename, type) {
    const timestamp = new Date().toLocaleTimeString();
    this.downloads.push({ filename, type, timestamp });
    this.updateHistory();
  }

  updateHistory() {
    const historyList = document.getElementById('history');
    historyList.innerHTML = this.downloads
      .map(
        (item) =>
          `<li>${item.timestamp} - <strong>${item.filename}</strong> (${item.type})</li>`,
      )
      .reverse()
      .join('');
  }

  updateStatus(message, type = 'info') {
    const statusBox = document.getElementById('status');
    statusBox.innerHTML = `<p class="status-${type}">${message}</p>`;
  }
}

new FileDownloader();
