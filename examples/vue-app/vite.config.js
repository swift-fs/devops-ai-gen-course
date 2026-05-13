import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 二级目录部署：base 设为 /vue/
export default defineConfig({
  plugins: [vue()],
  base: '/vue/',
})
