const express = require('express');
const fs = require('fs');
const axios = require('axios'); // We'll use axios for HTTP requests to backend
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';

app.use(express.json());
app.use(express.static('public')); // If you want to serve static files (optional)

// Your cached image stuff remains the same (adjust if needed)
const IMAGE_PATH = path.resolve(__dirname, 'storage', 'cached.jpg');
let cacheExpiry = 0;

// ✅ Function to download image from the internet and save it
async function downloadImage(url, dest) {
  try {
    const writer = fs.createWriteStream(dest);
    const response = await axios.get(url, { responseType: 'stream' });

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Failed to download image:', error);
  }
}

// ✅ Endpoint to serve cached image, refreshing every 10 minutes
app.get('/image-file', async (req, res) => {
  try {
    if (!fs.existsSync(IMAGE_PATH) || Date.now() > cacheExpiry) {
      console.log('Downloading new image...');
      await downloadImage('https://picsum.photos/600', IMAGE_PATH);
      cacheExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    }

    res.sendFile(IMAGE_PATH);
  } catch (error) {
    console.error('Failed to serve image:', error);
    res.status(500).send('Error loading image');
  }
});

// Serve main HTML with embedded JS that fetches and posts todos:
app.get('/', (req, res) => {
  const html = `
  <html>
  <head>
    <title>Todo App</title>
    <style>
      body { font-family: Arial, sans-serif; }
      input, button { font-size: 16px; padding: 8px; }
      ul { padding-left: 20px; }
      li { margin: 5px 0; }
    </style>
  </head>
  <body>
    <h1>THE PROJECT APP</h1>
    <img src="/image-file" alt="Random Cached Image" style="max-width:600px;"/>
    
    <input type="text" id="todoInput" maxlength="140" placeholder="Enter a todo (max 140 chars)" />
    <button id="addBtn">Send</button>
    
    <ul id="todoList"></ul>

    <script>
      const backendUrl = "${BACKEND_URL}"; // Kubernetes service name

      async function fetchTodos() {
        try {
          const res = await fetch(\`\${backendUrl}/todos\`);
          const todos = await res.json();
          const list = document.getElementById('todoList');
          list.innerHTML = '';
          todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            list.appendChild(li);
          });
        } catch (e) {
          console.error('Failed to fetch todos:', e);
        }
      }

      async function addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        if (!text) return alert('Please enter a todo');
        try {
          const res = await fetch(\`\${backendUrl}/todos\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          });
          if (!res.ok) {
            const errorData = await res.json();
            alert('Error: ' + errorData.error);
            return;
          }
          input.value = '';
          fetchTodos(); // Refresh list
        } catch (e) {
          alert('Failed to add todo');
          console.error(e);
        }
      }

      document.getElementById('addBtn').addEventListener('click', addTodo);

      // Fetch todos when page loads
      fetchTodos();
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Todo frontend app listening on port ${PORT}`);
});
