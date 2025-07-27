const express = require('express');
const app = express();

let counter = 0;

app.get('/pingpong', (req, res) => {
  counter += 1;
  res.send(`pong ${counter}`);
});

// Increment counter here too, so log-output gets updated pong counts
app.get('/ping', (req, res) => {
  counter += 1;
  res.send(`pong ${counter}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Pingpong app running on port ${PORT}`);
});

