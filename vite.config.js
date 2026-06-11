import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/firestore-split/' : '/',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        terms: 'terms.html',
        privacy: 'privacy.html',
        refund: 'refund.html',
        cookies: 'cookies.html',
        dmca: 'dmca.html',
      },
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
