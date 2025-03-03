import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 监听所有地址
    port: 5173,
    watch: {
      usePolling: true, // 在 Docker 中使用轮询以确保文件更改能被检测到
    }
  }
})
