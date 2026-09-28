import { Low } from 'lowdb';
import { JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { randomUUID } from 'crypto';

// Resolve the directory of the current file (server/) and locate db.json beside it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbFile = resolve(__dirname, 'db.json');

// Configure LowDB to use a JSON file for persistence
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

// Ensure the database has a default structure
async function init() {
  await db.read();
  db.data ??= { todos: [] };
  await db.write();
}

// Initialise immediately so the file exists before any route handler runs
await init();

/**
 * Retrieve all todos.
 * @returns {Promise<Array>} Array of todo objects.
 */
export async function getTodos() {
  await db.read();
  return db.data?.todos ?? [];
}

/**
 * Create a new todo.
 * @param {Object} payload - Object containing at least a `title` property.
 * @returns {Promise<Object>} The created todo item.
 */
export async function createTodo(payload) {
  const { title } = payload;
  const newTodo = {
    id: randomUUID(),
    title: title?.trim() ?? '',
    completed: false,
    createdAt: new Date().toISOString(),
  };
  await db.read();
  db.data.todos.push(newTodo);
  await db.write();
  return newTodo;
}

/**
 * Update an existing todo.
 * @param {string} id - Todo identifier.
 * @param {Object} updates - Fields to update (e.g., title, completed).
 * @returns {Promise<Object|null>} Updated todo or null if not found.
 */
export async function updateTodo(id, updates) {
  await db.read();
  const todo = db.data.todos.find((t) => t.id === id);
  if (!todo) return null;

  // Only allow known fields to be updated
  if (typeof updates.title === 'string') {
    todo.title = updates.title.trim();
  }
  if (typeof updates.completed === 'boolean') {
    todo.completed = updates.completed;
  }

  await db.write();
  return todo;
}

/**
 * Delete a todo by its ID.
 * @param {string} id - Todo identifier.
 * @returns {Promise<boolean>} True if deletion succeeded, false otherwise.
 */
export async function deleteTodo(id) {
  await db.read();
  const index = db.data.todos.findIndex((t) => t.id === id);
  if (index === -1) return false;

  db.data.todos.splice(index, 1);
  await db.write();
  return true;
}

/**
 * Export the raw LowDB instance for any advanced usage.
 */
export default db;
