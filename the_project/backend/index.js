import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan'; // <-- ADD THIS
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// Use morgan to log every request
app.use(morgan('combined')); // <-- ADD THIS

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// DB init
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text VARCHAR(140) NOT NULL
    )
  `);
}
initDB().catch(err => {
  console.error('Error initializing DB:', err);
  process.exit(1);
});

// Routes
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text || text.length > 140) {
    console.warn(`❌ Rejected todo: "${text}"`); // <-- log rejected todos
    return res.status(400).json({ error: 'Todo must be between 1 and 140 characters' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO todos(text) VALUES($1) RETURNING *',
      [text]
    );
    console.log(`✅ Added todo: "${text}"`); // <-- log successful todos
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ todo-backend listening on port ${PORT}`);
});
