import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'canvas-qr': ['html2canvas', 'qrcode'],
          'capacitor-vendor': ['@capacitor/app', '@capacitor/filesystem', '@capacitor/share'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/blog': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true,
      }
    }
  }
})
