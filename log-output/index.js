const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const id = uuidv4();
const startedAt = new Date().toISOString();

// Log to console every 5 seconds
setInterval(() => {
    const now = new Date().toISOString();
    console.log(`${now}: ${id}`);
}, 5000);

// /status route (for checking uptime and ID)
app.get('/status', (req, res) => {
    res.json({
        id: id,
        startedAt: startedAt
    });
});

// ✅ /logs route: reads from the shared log file
app.get('/logs', (req, res) => {
    try {
        const data = fs.readFileSync('/usr/src/app/shared/log.txt', 'utf-8');
        res.send(`<pre>${data}</pre>`);
    } catch (err) {
        res.status(500).send('Error reading log file: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Log-output app listening at http://localhost:${PORT}`);
});

