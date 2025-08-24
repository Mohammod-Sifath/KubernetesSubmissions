// log-output/index.js

const http = require('http');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// Read environment variable
const message = process.env.MESSAGE || 'No MESSAGE set';

// Read the file content
const filePath = path.join(__dirname, 'config', 'information.txt'); // match with volumeMount path
let fileContent = 'Could not read file';

try {
  fileContent = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  fileContent = `Error reading file: ${err.message}`;
}

// Log file content and environment variable once when app starts
console.log(`file content: ${fileContent}`);
console.log(`env variable: MESSAGE=${message}`);

const instanceId = uuid();

// Function to call pingpong service every 5 seconds
const logMessage = () => {
  const options = {
    hostname: 'pingpong-svc', // Kubernetes Service name
    port: 80,                 // Service port
    path: '/pingpong',        // Route exposed by pingpong
    method: 'GET'
  };

  const req = http.request(options, res => {
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      const timestamp = new Date().toISOString();
      console.log(`${timestamp}: ${instanceId}. Ping / Pongs: ${data}`);
    });
  });

  req.on('error', error => {
    console.error('Error calling pingpong service:', error);
  });

  req.end();
};

// Log pingpong call every 5 seconds
setInterval(logMessage, 5000);

// Expose HTTP server for Ingress / health checks
app.get('/', (req, res) => {
  res.send(`Message: ${message}\nFile content: ${fileContent}`);
});

// Listen on 0.0.0.0 for Kubernetes connectivity
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Log-output app listening on 0.0.0.0:${PORT}`);
});
