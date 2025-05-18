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
          'fortune-data': ['./src/stores/FortuneStore.js'],
          'utils': ['./src/utils/audioUtils.js', './src/utils/storageUtils.js'],
          'composables': ['./src/composables/useAudio.js', './src/composables/useLocalStorage.js']
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
    },
    // 图像优化选项
    assetsDir: 'assets',
    // CSS压缩和优化选项
    cssCodeSplit: true,
    cssMinify: true,
    // 源码映射配置
    sourcemap: false
  },
  // 服务器配置
  server: {
    // 热更新
    hmr: { port: 24680 }, // 使用不同的WebSocket端口
    // 启用gzip压缩
    middlewareMode: 'html',
    // 设置端口
    port: 3000, // 使用3000端口避免冲突
    // 强制关闭旧服务器
    force: true
  }
})
