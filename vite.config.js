import { defineConfig } from 'vite'

export default defineConfig({
  base: '/firestore-split/',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
