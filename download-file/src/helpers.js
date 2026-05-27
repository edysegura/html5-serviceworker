export async function handleDownload(request) {
  console.log('[Service Worker] handling download request:', request.url);

  const url = new URL(request.url);
  const fileType = url.searchParams.get('type');
  const filename = url.searchParams.get('filename') || `download-${Date.now()}`;

  try {
    const fileContent = generateFileContent(fileType);
    const blob = createBlob(fileContent, fileType);

    // Create response with download headers
    const response = new Response(blob, {
      status: 200,
      statusText: 'OK',
      headers: new Headers({
        'Content-Type': getMimeType(fileType),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': blob.size,
      }),
    });

    console.log('[Service Worker] file prepared for download:', filename);
    return response;
  } catch (error) {
    console.error('[Service Worker] download error:', error);
    return new Response('Download failed', { status: 500 });
  }
}

export function generateFileContent(fileType) {
  const timestamp = new Date().toISOString();

  switch (fileType) {
    case 'text':
      return generateTextContent(timestamp);
    case 'json':
      return generateJsonContent(timestamp);
    case 'csv':
      return generateCsvContent(timestamp);
    case 'image':
      return generateImageContent();
    default:
      return 'Unknown file type';
  }
}

function generateTextContent(timestamp) {
  return `Download Example - Text File\nGenerated: ${timestamp}\n\nThis is a sample text file downloaded through a Service Worker.`;
}

function generateJsonContent(timestamp) {
  return JSON.stringify(
    {
      name: 'Download Example',
      type: 'json',
      timestamp: timestamp,
      message:
        'This file was generated and downloaded through a Service Worker',
    },
    null,
    2,
  );
}

function generateCsvContent(timestamp) {
  return `id,name,value,timestamp\n1,Item 1,100,${timestamp}\n2,Item 2,200,${timestamp}\n3,Item 3,300,${timestamp}`;
}

function generateImageContent() {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#667eea"/>
    <circle cx="100" cy="100" r="50" fill="#764ba2"/>
    <text x="100" y="110" font-size="18" fill="white" text-anchor="middle">Service Worker</text>
    <text x="100" y="130" font-size="12" fill="white" text-anchor="middle">Download Demo</text>
  </svg>`;
}

export function createBlob(content, fileType) {
  const mimeType = getMimeType(fileType);
  return new Blob([content], { type: mimeType });
}

export function getMimeType(fileType) {
  const mimeTypes = {
    text: 'text/plain',
    json: 'application/json',
    csv: 'text/csv',
    image: 'image/svg+xml',
  };
  return mimeTypes[fileType] || 'application/octet-stream';
}
