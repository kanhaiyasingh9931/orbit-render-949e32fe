import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import db from './db.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure the database is loaded and has the correct shape
await db.read();
db.data ??= { todos: [] };

// ---------- API ROUTES ----------
app.get('/api/todos', (req, res) => {
  try {
    res.json(db.data.todos);
  } catch (err) {
    console.error('GET /api/todos error:', err);
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  const newTodo = {
    id: randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  try {
    db.data.todos.push(newTodo);
    await db.write();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('POST /api/todos error:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todoIndex = db.data.todos.findIndex((t) => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' });
    }
    updates.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    updates.completed = completed;
  }

  try {
    db.data.todos[todoIndex] = { ...db.data.todos[todoIndex], ...updates };
    await db.write();
    res.json(db.data.todos[todoIndex]);
  } catch (err) {
    console.error(`PUT /api/todos/${id} error:`, err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  const exists = db.data.todos.some((t) => t.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  try {
    db.data.todos = db.data.todos.filter((t) => t.id !== id);
    await db.write();
    res.status(204).end();
  } catch (err) {
    console.error(`DELETE /api/todos/${id} error:`, err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// ---------- STATIC FILE SERVING ----------
app.use(express.static(path.resolve(__dirname, '../dist')));

// For SPA routing – serve index.html for any unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

// ---------- SERVER START ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening at http://0.0.0.0:${PORT}`);
});