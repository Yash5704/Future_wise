import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Optional: Alias for clean imports
      '@': '/src',
    },
  },
  build: {
    outDir: 'build',
  },
  server: {
    host: "0.0.0.0", // This makes it accessible on the network
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // your backend port
        changeOrigin: true,
      },
    },
  },
});
