import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Set the root directory to the client folder where index.html resides
  root: path.resolve(__dirname, 'client'),
  base: './',
  plugins: [react()],
  build: {
    // Output the bundled assets to the backend's static folder
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    // Development server port (Vite default is 5173)
    port: 5173,
    // Proxy API calls to the Express backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});