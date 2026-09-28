import React from 'react';
import PropTypes from 'prop-types';

function TodoItem({ todo, onToggle, onDelete }) {
  const { title, completed, createdAt } = todo;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <li className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
        />
        <span className={completed ? 'line-through text-gray-500' : 'text-gray-800'}>
          {title}
        </span>
        {formattedDate && (
          <span className="text-xs text-gray-400 ml-2">{formattedDate}</span>
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 focus:outline-none"
        aria-label={`Delete ${title}`}
      >
        &times;
      </button>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoItem;