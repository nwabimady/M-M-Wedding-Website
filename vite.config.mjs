import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  plugins: [
    copy({
      targets: [
        { src: './guests.json', dest: 'dist/assets/' },
        { src: './FindChildren.js', dest: 'dist/assets/' }
      ],
      hook: 'writeBundle'
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