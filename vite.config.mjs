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
        class1: './InvitationThanks.js',
        class2: './FindChildren.js',
        class3: './GuestManager.js'
      }
    }
  },
  dev: {
    server: {
      port: 3000,
    },
  },
})