# 缘结良缘 - 爱情占卜应用

这是一个使用Vue 3和Pinia构建的现代化爱情占卜应用。用户可以摇铃抽签，获取关于缘分和感情的占卜结果。

## 特性

- 美观的传统东方风格UI
- 飘落的樱花花瓣动画效果
- 流畅的抽签和结果展示动画
- 响应式设计，适配各种屏幕尺寸
- 使用Pinia进行状态管理
- 浅色/深色主题模式切换
- 抽签历史记录保存
- 用户个人资料设置
- 本地数据持久化存储
- 社交分享功能

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 快速启动

项目提供了两个快速启动脚本：

- `start-app.bat`: 简单启动脚本，启动开发服务器并打开浏览器
- `start-app-advanced.bat`: 高级启动脚本，具有端口检查和智能启动功能

## 项目结构

- `src/components/` - Vue组件
  - `Header.vue` - 页面头部
  - `SakuraBackground.vue` - 樱花背景动画
  - `FortuneButton.vue` - 抽签按钮
  - `FortuneResult.vue` - 签文结果显示
  - `Footer.vue` - 页脚和分享功能
  - `UserProfile.vue` - 用户个人资料管理
  - `FortuneHistory.vue` - 抽签历史记录
- `src/stores/` - Pinia存储
  - `FortuneStore.js` - 签文数据和状态管理
- `public/image/` - 图片资源

## 功能亮点

1. **主题切换**：支持浅色和深色两种主题，满足不同用户的使用习惯
2. **个人资料**：用户可以记录个人信息，系统会根据生日计算星座并生成幸运数字
3. **历史记录**：自动保存每次抽签的结果，方便用户回顾
4. **动画特效**：精美的樱花飘落效果，以及丰富的UI动画
5. **社交分享**：支持将抽签结果分享到社交媒体
6. **响应式设计**：完美适配各种屏幕尺寸，从手机到桌面设备

## 技术栈

- Vue 3 (Composition API)
- Pinia (状态管理)
- Vite (构建工具)
- LocalStorage (本地数据持久化)

## 注意

本应用仅供娱乐，占卜结果不具有科学依据。

## 音效资源

请在 `public/sounds` 目录下添加以下音效文件：

你可以从以下途径获取免费的风铃音效:
1. Freesound: https://freesound.org/search/?q=wind+chime
2. Pixabay音效库: https://pixabay.com/sound-effects/search/wind-chime/
3. Zapsplat: https://www.zapsplat.com/sound-effect-categories/
