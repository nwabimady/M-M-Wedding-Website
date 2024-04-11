import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  dev: {
    server: {
      port: 3000,
    },
  },
});
