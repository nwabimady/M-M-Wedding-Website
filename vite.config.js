import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // ... other build options
    outDir: 'dist', // Output directory for production build (optional)
  },
  dev: {
    // ... other development options
    server: {
      port: 3000, // Development server port (optional)
    },
  },
});
