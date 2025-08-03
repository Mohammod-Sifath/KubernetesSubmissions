const http = require('http');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');

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

const logMessage = () => {
  const options = {
    hostname: 'pingpong-svc',  // pingpong Service name
    port: 3001,                // must match pingpong's service port
    path: '/ping',
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

