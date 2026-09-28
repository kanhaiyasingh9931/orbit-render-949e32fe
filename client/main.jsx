import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Optional: import global styles if you have any
// import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure there is a <div id="root"></div> in index.html');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);