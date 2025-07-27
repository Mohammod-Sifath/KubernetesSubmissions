const http = require('http');
const { v4: uuid } = require('uuid');

const instanceId = uuid();

const logMessage = () => {
  const options = {
    hostname: 'pingpong-svc',  // pingpong Service name
    port: 3001,                // must match pingpong's service port
    path: '/ping',             // pingpong app should have this endpoint
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

// Log every 5 seconds
setInterval(logMessage, 5000);

