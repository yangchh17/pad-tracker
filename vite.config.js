import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the built app works when deployed at a GitHub Pages
  // subpath (yangchh17.github.io/pad-tracker/) instead of domain root
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'PAD Tracker',
        short_name: 'PAD',
        description: 'A personal mood tracker mapping your emotions through Valence, Arousal, and Dominance.',
        // relative for the GitHub Pages subpath deploy
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#14171C',
        theme_color: '#14171C',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // precache the built app shell; runtime-cache Google Fonts so the
        // installed PWA still renders its typography offline. Vite hashes
        // filenames, so a content change busts the cache automatically -
        // no more hand-bumped CACHE_VERSION string.
        globPatterns: ['**/*.{js,css,html,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
