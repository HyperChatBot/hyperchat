import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

console.log(process.env)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true
  },
  envPrefix: ['VITE_', 'ELECTRON_'],
  build: {
    // // Tauri supports es2021
    // target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // // don't minify for debug builds
    // minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // // produce sourcemaps for debug builds
    // sourcemap: !!process.env.TAURI_DEBUG
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  }
})
