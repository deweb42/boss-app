import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Crucial for Electron: ensures assets are loaded relatively
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});