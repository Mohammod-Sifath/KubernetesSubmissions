const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();

const STORAGE_DIR = '/app/storage';
const IMAGE_PATH = path.join(STORAGE_DIR, 'random.jpg');
let cacheExpiry = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

async function downloadImage(url, destPath) {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer',
    });

    fs.writeFileSync(destPath, response.data);
    console.log('✅ Image downloaded successfully');
    cacheExpiry = Date.now() + CACHE_DURATION;
  } catch (error) {
    console.error('❌ Error downloading image:', error.message);
  }
}

app.get('/image-file', async (req, res) => {
  const now = Date.now();
  const imageExists = fs.existsSync(IMAGE_PATH) && fs.statSync(IMAGE_PATH).size > 0;

  if (!imageExists || now > cacheExpiry) {
    await downloadImage('https://picsum.photos/600/400', IMAGE_PATH);
  }

  if (fs.existsSync(IMAGE_PATH) && fs.statSync(IMAGE_PATH).size > 0) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(IMAGE_PATH);
  } else {
    res.status(500).send('Image not available');
  }
});

app.get('/', (req, res) => {
  const html = `
    <html>
      <head><title>Todo App</title></head>
      <body>
        <h1>THE PROJECT APP</h1>
        <img src="/image-file" alt="Random Cached Image" />
        <input type="text" maxlength="140" placeholder="Enter a todo (max 140 chars)" />
        <button>Send</button>
        <ul>
          <li>Buy groceries</li>
          <li>Learn Kubernetes</li>
          <li>Push to GitHub</li>
        </ul>
        <div class="description">DevOps with Kubernetes 2025</div>
      </body>
    </html>
  `;
  res.send(html);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}`);
});
