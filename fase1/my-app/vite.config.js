import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy request to Kaggle or TFHub server
      '/tfjs-model': {
        target: 'https://tfhub.dev', // Change this to the correct base URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tfjs-model/, ''),
      },
    },
  },
})
