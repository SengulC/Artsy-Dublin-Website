import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": "http://localhost:3005",
      "/genres": "http://localhost:3005",
      "/api": "http://localhost:3005",
    },
  },
});