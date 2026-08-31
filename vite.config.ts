import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 1. Import the plugin
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add it to the array
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
