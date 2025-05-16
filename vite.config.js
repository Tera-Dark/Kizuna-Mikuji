import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // 添加基础路径配置，适配GitHub Pages
  // 在本地开发时使用'/'，在生产环境根据环境变量或默认使用仓库名称
  base: process.env.NODE_ENV === 'production' ? '/Kizuna-Mikuji/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'fortune-data': ['./src/stores/FortuneStore.js']
        }
      }
    },
    // 启用gzip压缩
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
