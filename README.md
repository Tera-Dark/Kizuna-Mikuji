# 缘结良缘 - 爱情占卜应用

这是一个使用Vue 3和Pinia构建的现代化爱情占卜应用。用户可以抽签获取关于缘分和感情的占卜结果，提供多种占卜类型。

## 特性

- 精美的传统东方风格UI
- 樱花飘落和红线背景动画效果
- 流畅的抽签和结果展示动画
- 响应式设计，适配各种屏幕尺寸
- 使用Pinia进行状态管理
- 丰富的占卜类型选择
- 抽签历史记录保存
- 用户个人资料设置
- 本地数据持久化存储
- 支持多种占卜模式：爱情缘分、前世姻缘、双人合卦、星座配对等

## 占卜类型

应用提供多种占卜类型，包括：
- 爱情缘分：解读当前感情运势
- 前世姻缘：探索前世的缘分联系
- 双人合卦：结合两人信息进行缘分占卜
- 星座配对：分析不同星座间的契合度
- 缘分球：类似于"魔法8球"的趣味占卜
- 姓名解析：通过姓名分析缘分特性
- 事业运势：职场和事业发展预测
- 学业考试：学习和考试相关占卜
- 日常运势：日常生活运势解读

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

项目提供了快速启动脚本：

- `start-app.bat`: 简单启动脚本，启动开发服务器并打开浏览器

## GitHub Pages 部署

本项目配置了GitHub Actions自动部署到GitHub Pages：

1. 推送代码到main分支会自动触发构建和部署
2. 手动触发：在GitHub仓库页面的Actions选项卡中点击"部署到GitHub Pages"工作流，然后点击"Run workflow"

部署完成后，可以通过 `https://<你的用户名>.github.io/Kizuna-Mikuji/` 访问应用。

## 项目结构

- `src/components/` - Vue组件
  - `Header.vue` - 页面头部
  - `SakuraBackground.vue` - 樱花背景动画
  - `RedThreadBackground.vue` - 红线背景
  - `FortuneButton.vue` - 抽签按钮
  - `FortuneResult.vue` - 签文结果显示
  - `Footer.vue` - 页脚和分享功能
  - `UserProfile.vue` - 用户个人资料管理
  - `FortuneHistory.vue` - 抽签历史记录
  - `CategorySelector.vue` - 占卜类型选择器
  - `CoupleFortuneDrawing.vue` - 双人合卦组件
  - `NameFortune.vue` - 姓名解析组件
  - `ZodiacCompatibility.vue` - 星座配对组件
  - `DestinyBall.vue` - 缘分球组件
  - `CookieTutorial.vue` - 新手教程组件
  - `SoundMissingHint.vue` - 音效缺失提示
- `src/stores/` - Pinia存储
  - `FortuneStore.js` - 签文数据和状态管理
- `public/` - 静态资源目录
  - `images/` - 图片资源
  - `sounds/` - 音效资源
- `.github/workflows/` - GitHub Actions工作流配置
  - `deploy.yml` - 自动部署到GitHub Pages的工作流配置

## 功能亮点

1. **多种占卜类型**：提供爱情、事业、学业等多种类型的占卜，满足用户不同需求
2. **个人资料**：用户可以记录个人信息，系统根据生日计算星座并生成幸运数字
3. **历史记录**：自动保存每次抽签的结果，方便用户回顾
4. **动画特效**：精美的樱花飘落和红线背景效果，丰富的UI动画
5. **双人合卦**：支持输入两个人的信息进行缘分配对
6. **响应式设计**：完美适配各种屏幕尺寸，从手机到桌面设备

## 技术栈

- Vue 3 (Composition API)
- Pinia (状态管理)
- Vite (构建工具)
- LocalStorage (本地数据持久化)
- Matter.js (物理引擎效果)

## 注意

本应用仅供娱乐，占卜结果不具有科学依据。

## 音效资源

请在 `public/sounds` 目录下添加以下音效文件：

- `wind-chime.mp3`: 摇铃音效（主要音效）

你可以从以下途径获取免费的风铃音效:
1. Freesound: https://freesound.org/search/?q=wind+chime
2. Pixabay音效库: https://pixabay.com/sound-effects/search/wind-chime/
3. Zapsplat: https://www.zapsplat.com/sound-effect-categories/
