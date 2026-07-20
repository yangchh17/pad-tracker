import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the built app works when deployed at a GitHub Pages
  // subpath (yangchh17.github.io/pad-tracker/) instead of domain root
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
