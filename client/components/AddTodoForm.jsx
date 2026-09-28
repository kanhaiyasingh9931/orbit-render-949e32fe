import { useState } from 'react';

/**
 * AddTodoForm
 *
 * Renders a simple form that allows the user to create a new todo item.
 * On successful creation it calls the `onAdd` callback with the newly
 * created todo object returned from the backend.
 *
 * Props
 * -----
 * @param {function} onAdd - Callback invoked with the newly created todo.
 *
 * The component handles its own loading and error states and disables the
 * submit button while a request is in progress.
 */
export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles form submission.
   * Sends a POST request to the backend API and forwards the created todo
   * to the parent via the `onAdd` prop.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim title and guard against empty submissions
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create todo (status ${response.status})`
        );
      }

      const newTodo = await response.json();

      // Notify parent component about the new todo
      if (typeof onAdd === 'function') {
        onAdd(newTodo);
      }

      // Reset form
      setTitle('');
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err.message ?? 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        style={styles.input}
        aria-label="Todo title"
      />
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </form>
  );
}

/**
 * Inline styling for the component. In a real‑world app you might extract
 * these to a CSS/SCSS module or use a CSS‑in‑JS solution.
 */
const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '0.5rem',
  },
  input: {
    flexGrow: 1,
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    minWidth: '80px',
  },
  error: {
    marginTop: '0.5rem',
    color: '#d9534f',
    fontSize: '0.9rem',
  },
};