import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsInclude: ['guests.json'],
    emptyOutDir: false,
  },
  dev: {
    server: {
      port: 3000,
    },
  },
});