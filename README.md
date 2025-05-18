# 缘结神签

一个基于Vue 3的在线抽签应用，精美的UI设计和流畅的动画，为用户提供爱情缘分、事业运势等多种类型的占卜体验。

## ✨ 功能特性

*   **多样化的签文主题**：
    *   **缘分探索**：爱情缘分、前世姻缘、双人合卦、星座配对、缘分球（特殊占卜）、姓名解析
    *   **个人成长**：事业运势、学业考试
    *   **生活指引**：日常运势、每日一签、人际关系、健康平安
*   **渐进式签文等级**：通过不断抽签，解锁更高级别的签文（初级、中级、高级、神级），揭示更深层次的指引。
*   **丰富的签文类型**：包含从"上上大吉"到"大凶"等多种传统签文类型，以及针对不同主题的特色签文（如"缘初现"、"事业顺遂"、"学业精进"等），并有对应的颜色标识。
*   **个性化占卜体验**：
    *   **姓名解析**：输入姓名，获取基于姓名学分析的专属运势解读、个性特点、缘分指数及幸运色。
    *   **星座配对**：选择两个星座，查看详细的元素相性分析、配对解读、箴言诗句和相处建议。
*   **智能转运机制**：当连续抽到不佳签文时，有机会触发特殊的"转机签文"，为你带来新的希望。
*   **抽签历史记录**：自动保存你的每一次抽签结果（包括签文类型、等级、分类、日期和内容），方便回顾。
*   **沉浸式体验**：包含抽签动画和音效（如摇铃、结果揭示音效），增加仪式感和趣味性。
*   **数据持久化**：抽签历史和用户等级进度将保存在浏览器本地存储中。
*   **精美的日式神社风格UI设计**。
*   **流畅的动画效果**。
*   **响应式布局**，支持移动端和桌面设备。

## 🔮 签文分类一览

| 图标 | 名称         | 描述                     |
| :---: | :-----------: | :-----------------------: |
|  ❤️  | 爱情缘分     | 探索你的浪漫情缘         |
|  🔮  | 前世姻缘     | 揭示轮回中的羁绊         |
|  💞  | 双人合卦     | 分析你与TA的匹配度       |
|  ⭐  | 星座配对     | 查看星座间的化学反应     |
|  🔮  | 缘分球       | (特殊占卜机制)           |
|  📝  | 姓名解析     | 从名字看你的命运走向     |
|  💼  | 事业运势     | 指引你的职业发展方向     |
|  📚  | 学业考试     | 助力你的学习与考试之路   |
|  🍀  | 日常运势     | 获取每日的生活小提示     |
|  🌞  | 每日一签     | 每日专属运势提醒         |
|  👥  | 人际关系     | 改善你的社交互动         |
|  🏥  | 健康平安     | 关注你的身心健康状态     |

## 技术栈

- Vue 3 (Composition API)
- Vite
- Pinia (状态管理)
- 原生CSS (自定义动画和样式)

## 目录结构

```
src/
├── assets/         # 静态资源
├── components/     # 组件
├── composables/    # 组合式函数
├── constants/      # 常量定义
├── data/           # 签文数据
├── stores/         # Pinia状态管理
├── utils/          # 工具函数
├── App.vue         # 根组件
└── main.js         # 入口文件
```

## 项目优化

### 代码结构优化

- 拆分了大型Store文件为多个职责单一的Store
- 抽离常量数据到单独的constants目录
- 使用composables目录存放可复用的组合式函数
- 使用utils目录存放工具函数

### 性能优化

- 添加了音频缓存机制，减少重复加载
- 实现音频预加载功能，提升用户体验
- 优化组件渲染逻辑，减少不必要的重渲染

### 代码质量

- 添加ESLint和Prettier配置，统一代码风格
- 完善注释和文档
- 优化错误处理逻辑

## 运行项目

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署

项目已配置GitHub Pages部署，可通过以下命令部署：

```bash
npm run deploy
```

## 许可

[MIT](LICENSE)

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

## 注意

本应用仅供娱乐，占卜结果不具有科学依据。

## 音效资源

请在 `public/sounds` 目录下添加以下音效文件：

- `wind-chime.mp3`: 摇铃音效（主要音效）
- `reveal.mp3`: 签文揭示音效

你可以从以下途径获取免费的风铃音效:
1. Freesound: https://freesound.org/search/?q=wind+chime
2. Pixabay音效库: https://pixabay.com/sound-effects/search/wind-chime/
3. Zapsplat: https://www.zapsplat.com/sound-effect-categories/
