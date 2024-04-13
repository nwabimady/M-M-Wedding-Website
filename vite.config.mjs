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
    rollupOptions: {
      input: {
        main: './index.js',
        class1: './classes/InvitationThanks.js',
        class2: './classes/FindChildren.js',
        class3: './classes/GuestManager.js'
      }
    }
  },
  dev: {
    server: {
      port: 3000,
    },
  },
})