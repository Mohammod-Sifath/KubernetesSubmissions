import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3002;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

let todos = [];

// GET /todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos
app.post('/todos', (req, res) => {
  const { text } = req.body;

  if (!text || text.length > 140) {
    return res.status(400).json({ error: 'Todo must be between 1 and 140 characters' });
  }

  const newTodo = {
    id: todos.length + 1,
    text,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(PORT, () => {
  console.log(`✅ todo-backend listening on port ${PORT}`);
});

