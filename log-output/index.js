const express = require('express');
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

// New /status route
app.get('/status', (req, res) => {
    res.json({
        id: id,
        startedAt: startedAt
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

