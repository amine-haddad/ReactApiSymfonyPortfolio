import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,  // Assurez-vous que cette option est activée
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost',  // WebSocket host
      port: 5173,         // WebSocket port
    },
    proxy: {
      '/api': {
        target: 'http://symfony_php:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})