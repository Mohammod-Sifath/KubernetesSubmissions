const fs = require('fs');
const path = '/usr/src/app/shared/logs.txt';

const randomString = Math.random().toString(36).substring(7);

setInterval(() => {
  const logLine = `${new Date().toISOString()} - ${randomString}\n`;
  fs.appendFile(path, logLine, err => {
    if (err) console.error('Error writing to log file:', err);
  });
  console.log('Wrote log line:', logLine.trim());
}, 5000);
