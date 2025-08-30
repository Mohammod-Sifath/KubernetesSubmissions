const express = require('express');
const { Pool } = require('pg');  // PostgreSQL client
const app = express();

let counter = 0;

// Database connection
const pool = new Pool({
  host: process.env.PGHOST || 'postgres',   // service name of postgres
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'postgres',
  port: process.env.PGPORT || 5432
});

// Root route with in-memory counter
app.get('/', (req, res) => {
  counter++;
  res.status(200).send(`pong ${counter}`);
});

// /pingpong route for log-output readiness probe
app.get('/pingpong', async (req, res) => {
  try {
    await pool.query('SELECT 1');  // check DB connection
    res.status(200).send('pong from DB ready');
  } catch (err) {
    res.status(500).send('DB not ready');
  }
});

// Health check endpoint for Kubernetes
app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT 1');  // simple DB check
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});
