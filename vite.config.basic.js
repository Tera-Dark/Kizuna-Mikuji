import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 最简化配置，禁用所有可能造成问题的功能
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080, // 使用更高的非常规端口
    strictPort: false, // 如果端口被占用，自动尝试下一个端口
    hmr: false, // 禁用热更新
    open: false, // 不自动打开浏览器
    force: true, // 强制关闭旧服务器
    middlewareMode: false // 禁用中间件模式
  }
}) 