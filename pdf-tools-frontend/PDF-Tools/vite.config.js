import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'PDF Tools',
      short_name: 'PDFTools',
      description: 'A comprehensive tool for PDF operations',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: 'Logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'Logo.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
})
