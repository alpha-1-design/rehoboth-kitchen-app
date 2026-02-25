import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    minify: 'esbuild',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 70 * 1024 * 1024,
        swDest: 'dist/sw.js',
        inlineWorkboxRuntime: true,
      },
      includeAssets: ['logo.png'],
      manifest: {
        name: 'Rehoboth Kitchen',
        short_name: 'Rehoboth',
        description: 'Culinary Excellence',
        theme_color: '#2C5530',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'logo.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
})
