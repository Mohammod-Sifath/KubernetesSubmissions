const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client
const app = express();

// Environment variables from Kubernetes Deployment
const PGHOST = process.env.PGHOST || 'postgres-svc';
const PGUSER = process.env.PGUSER || 'pingpong';
const PGPASSWORD = process.env.PGPASSWORD || 'sp123';
const PGDATABASE = process.env.PGDATABASE || 'pingpong';
const PGPORT = process.env.PGPORT || 5432;

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: PGPORT,
});

// Ensure table exists on startup
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ping_counter (
        name TEXT PRIMARY KEY,
        value INTEGER NOT NULL
      )
    `);
    await pool.query(`
      INSERT INTO ping_counter (name, value)
      VALUES ('counter', 0)
      ON CONFLICT (name) DO NOTHING
    `);
    console.log("Database is ready.");
  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1);
  }
})();

app.get('/pingpong', async (req, res) => {
  try {
    await pool.query(`UPDATE ping_counter SET value = value + 1 WHERE name = 'counter'`);
    const result = await pool.query(`SELECT value FROM ping_counter WHERE name = 'counter'`);
    const counter = result.rows[0].value;
    res.send(`pong ${counter}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Pingpong app running on port ${PORT}`);
});

