const express = require('express');
const fs = require('fs');
const app = express();
const path = '/usr/src/app/shared/logs.txt';

app.get('/logs', (req, res) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return res.send('No logs yet or error reading file.');
    res.send(`<pre>${data}</pre>`);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reader app listening on port ${PORT}`);
});
