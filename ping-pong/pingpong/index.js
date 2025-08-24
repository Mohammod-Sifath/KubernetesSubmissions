const express = require('express');
const app = express();
let counter = 0;

// Health check for Ingress
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Pingpong counter
app.get('/pingpong', (req, res) => {
  counter++;
  res.status(200).send(`pong ${counter}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});
