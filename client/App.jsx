import { useState, useEffect } from 'react';
import TodoList from './components/TodoList.jsx';
import AddTodoForm from './components/AddTodoForm.jsx';

/**
 * Main application component.
 * Handles fetching, creating, updating and deleting todos via the backend API.
 */
export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API calls – Vite proxy will forward /api/* to the backend.
  const API_BASE = '/api/todos';

  /** Fetch all todos from the server */
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Create a new todo */
  const addTodo = async (title) => {
    setError(null);
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add todo: ${response.statusText}`);
      }
      const newTodo = await response.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  };

  /** Toggle completed status of a todo */
  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.statusText}`);
      }
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  /** Delete a todo */
  const deleteTodo = async (id) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.statusText}`);
      }
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>

      {loading && <p>Loading todos...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <AddTodoForm onAdd={addTodo} />
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </>
      )}
    </div>
  );
}

/** Simple inline styling – replace with CSS modules or Tailwind as needed */
const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Arial, Helvetica, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
};