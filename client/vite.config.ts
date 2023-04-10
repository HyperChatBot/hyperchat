import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
