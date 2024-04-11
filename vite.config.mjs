import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    assetsInclude: ['guests.json'],
  },
  dev: {
    server: {
      port: 3000,
    },
  },
});
