import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/viewer/',
  // 仅放 catalog.json；图片音视频走站点根路径 /photos /videos /audio
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5180,
    fs: {
      allow: ['..'],
    },
  },
})
