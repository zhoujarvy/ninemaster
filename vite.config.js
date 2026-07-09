import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [vue(), cloudflare()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})