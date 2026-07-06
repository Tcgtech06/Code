import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: []
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'EVAL') return;
        warn(warning);
      }
    }
  }
});