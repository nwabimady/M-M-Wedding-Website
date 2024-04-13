import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  plugins: [
    copy({
      targets: [
        { src: './guests.json', dest: 'dist/assets/' },
      ],
      hook: 'build'
    })
  ],
  build: {
    outDir: 'dist',
  },
  dev: {
    server: {
      port: 3000,
    },
  },
})