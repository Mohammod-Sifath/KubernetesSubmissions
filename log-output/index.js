// log-output/index.js

const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Pool } = require('pg');   // Postgres client
const http = require('http');
const app = express();

const message = process.env.MESSAGE || 'No MESSAGE set';

// File reading logic
const filePath = path.join(__dirname, 'config', 'information.txt');
let fileContent = 'Could not read file';
try {
  fileContent = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  fileContent = `Error reading file: ${err.message}`;
}

console.log(`file content: ${fileContent}`);
console.log(`env variable: MESSAGE=${message}`);

const instanceId = uuid();

// --- Postgres connection ---
const pool = new Pool({
  host: process.env.PGHOST || 'postgres-svc',
  user: process.env.PGUSER || 'pingpong',
  password: process.env.PGPASSWORD || 'sp123',
  database: process.env.PGDATABASE || 'pingpong',
  port: process.env.PGPORT || 5432
});

// Every 5s → query the counter directly
const logMessage = async () => {
  try {
    const result = await pool.query('SELECT counter FROM pingpong LIMIT 1');
    const counter = result.rows[0]?.counter ?? 0;
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${instanceId}. Ping / Pongs: ${counter}`);
  } catch (err) {
    console.error('Error querying database:', err.message);
  }
};
setInterval(logMessage, 5000);

// Root endpoint
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT counter FROM pingpong LIMIT 1');
    const counter = result.rows[0]?.counter ?? 0;
    res.send(`Message: ${message}\nFile content: ${fileContent}\nPingpong counter: ${counter}`);
  } catch (err) {
    res.status(500).send('Error reading counter from database');
  }
});

// --- New health endpoint for readiness probe ---
app.get('/healthz', async (req, res) => {
  const options = {
    hostname: 'pingpong-svc',
    port: 80,
    path: '/pingpong',
    method: 'GET'
  };
  const request = http.request(options, response => {
    if (response.statusCode === 200) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
  request.on('error', () => res.sendStatus(500));
  request.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Log-output app listening on 0.0.0.0:${PORT}`);
});
