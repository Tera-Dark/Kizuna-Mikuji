<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import SakuraBackground from './components/SakuraBackground.vue';
import RedThreadBackground from './components/RedThreadBackground.vue';
import Header from './components/Header.vue';
import FortuneButton from './components/FortuneButton.vue';
import FortuneResult from './components/FortuneResult.vue';
import Footer from './components/Footer.vue';
import FortuneHistory from './components/FortuneHistory.vue';
import CategorySelector from './components/CategorySelector.vue';
import CoupleFortuneDrawing from './components/CoupleFortuneDrawing.vue';
import NameFortune from './components/NameFortune.vue';
import ZodiacCompatibility from './components/ZodiacCompatibility.vue';
import DestinyBall from './components/DestinyBall.vue';
import UserProfile from './components/UserProfile.vue';
import CookieTutorial from './components/CookieTutorial.vue';
import SoundMissingHint from './components/SoundMissingHint.vue';
import { useFortuneStore } from './stores/FortuneStore';

// 使用状态管理
const fortuneStore = useFortuneStore();

// 组件引用
const profileRef = ref(null);
const historyRef = ref(null);
const fortuneButtonRef = ref(null);

// 日期显示
const today = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`;
});

// 动画状态控制
const isAnimating = ref(false);

// 签种类选择
const selectedCategory = ref('爱情缘分');

// 错误和提示状态控制
const showSoundError = ref(false);
const showTutorial = ref(false);

// 强制重置教程状态，用于测试
const forceTutorial = () => {
  localStorage.removeItem('hasSeenTutorial');
  showTutorial.value = true;
};

// 点击摇铃按钮
const handleDrawFortune = () => {
  if (isAnimating.value) return;
  
  isAnimating.value = true;
  
  // 触发背景动画效果增强仪式感
  animateBackground();
  
  // 延迟获取签文结果，与摇铃动画配合
  setTimeout(() => {
    fortuneStore.drawFortune(selectedCategory.value);
  }, 2500); // 增加时间以配合新的摇铃动画
  
  // 动画状态持续时间
  setTimeout(() => {
    isAnimating.value = false;
  }, 6000); // 延长动画状态持续时间，覆盖整个抽签过程
};

// 再次抽签
const handleDrawAgain = () => {
  fortuneStore.resetFortune();
  
  setTimeout(() => {
    handleDrawFortune();
  }, 300);
};

// 页面初始化
onMounted(() => {
  console.log('App组件挂载');
  
  // 主动清除教程标记，确保每次重新加载应用都会显示教程
  localStorage.removeItem('hasSeenTutorial');
  
  // 检查是否需要显示新手教程
  const hasSeenTutorial = localStorage.getItem('hasSeenTutorial') === 'true';
  console.log('用户是否已看过教程:', hasSeenTutorial);
  
  // 不检查hasSeenTutorial，直接显示教程
  console.log('准备显示教程');
  // 延迟时间增加，确保页面完全加载
  setTimeout(() => {
    console.log('显示教程弹窗');
    showTutorial.value = true;
  }, 1500);
  
  // 加载必要的资源
  preloadSounds();
  
  // 添加全局按键事件监听，Shift+T 组合键显示教程
  window.addEventListener('keydown', handleKeydown);
});

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// 键盘事件处理函数
const handleKeydown = (e) => {
  // Shift+T 显示教程
  if (e.shiftKey && e.key === 'T') {
    console.log('按下快捷键 Shift+T，显示教程');
    showTutorialManually();
  }
  
  // Shift+R 重置教程状态
  if (e.shiftKey && e.key === 'R') {
    console.log('按下快捷键 Shift+R，重置教程状态');
    resetTutorialStatus();
  }
};

// 预加载音效
const preloadSounds = () => {
  try {
    const audio = new Audio('/sounds/wind-chime.mp3');
    audio.load();
  } catch (error) {
    console.log('音效预加载失败', error);
  }
};

// 手动触发显示教程（用于调试或用户主动查看教程）
const showTutorialManually = () => {
  console.log('手动触发显示教程');
  showTutorial.value = true;
};

// 处理铃铛声音错误
const handleSoundError = () => {
  const soundHintDismissed = localStorage.getItem('soundHintDismissed') === 'true';
  if (!soundHintDismissed) {
    showSoundError.value = true;
  }
};

// 关闭音效提示
const closeSoundHint = () => {
  showSoundError.value = false;
};

// 关闭教程
const closeTutorial = () => {
  console.log('关闭教程');
  showTutorial.value = false;
};

// 签文类型变更处理
const handleCategoryChange = (category) => {
  selectedCategory.value = category;
  fortuneStore.setCategory(category);
  fortuneStore.resetFortune();
};

// 抽签动画开始处理
const handleAnimationStart = () => {
  isAnimating.value = true;
};

// 抽签动画结束处理
const handleAnimationEnd = () => {
  isAnimating.value = false;
};

// 监视签文变化，添加到历史记录
watch(() => fortuneStore.selectedFortune, (newValue) => {
  if (newValue && historyRef.value) {
    // 延迟一下，确保签文显示完成后再添加到历史
    setTimeout(() => {
      historyRef.value.addCurrentFortuneToHistory();
    }, 1000);
  }
});

// 触发背景动画效果
const animateBackground = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 2000);
};

// 新增的函数
const handleFloatingDrawFortune = () => {
  if (fortuneButtonRef.value) {
    fortuneButtonRef.value.drawFortune();
  } else {
    // 如果组件引用不存在，则直接调用原始的抽签方法
    handleDrawFortune();
  }
};

const handleToggleHistory = () => {
  if (historyRef.value) {
    historyRef.value.toggleHistory();
  }
};

const handleToggleProfile = () => {
  if (profileRef.value) {
    profileRef.value.toggleProfile();
  }
};

// 清除localStorage中的教程标记，用于测试教程
const resetTutorialStatus = () => {
  console.log('重置教程状态');
  localStorage.removeItem('hasSeenTutorial');
  showTutorial.value = true;
};
</script>

<template>
  <div id="app-outer-container" :class="{ 'animating': isAnimating }">
    <SakuraBackground />
    <RedThreadBackground />
    
    <div class="date-display">{{ today }}</div>
    
    <FortuneHistory ref="historyRef" />
    <UserProfile ref="profileRef" />
    
    <div id="app-container">
      <Header />
      
      <main class="main-content">
        <CategorySelector :selected-category="selectedCategory" @category-change="handleCategoryChange" />
        
        <!-- 姓名占卜组件 -->
        <NameFortune v-if="fortuneStore.currentCategory === 'name'" />
        
        <!-- 双人合卦组件 -->
        <CoupleFortuneDrawing v-else-if="fortuneStore.currentCategory === 'couple'" />
        
        <!-- 星座配对组件 -->
        <ZodiacCompatibility v-else-if="fortuneStore.currentCategory === 'zodiac'" />
        
        <!-- 缘分球组件 -->
        <DestinyBall v-else-if="fortuneStore.currentCategory === 'destiny_ball'" />
        
        <!-- 标准占卜组件 -->
        <FortuneButton 
          v-else
          :category="selectedCategory"
          :disabled="isAnimating"
          @click="handleDrawFortune"
          @animation-start="handleAnimationStart"
          @animation-end="handleAnimationEnd"
          @sound-error="handleSoundError"
          ref="fortuneButtonRef"
        />
        
        <!-- 结果显示组件 - 移动到所有条件分支外面，以便任何模式都能显示结果 -->
        <FortuneResult 
          v-if="fortuneStore.selectedFortune" 
          :fortune="fortuneStore.selectedFortune"
          :typeColor="fortuneStore.fortuneTypeColor"
          @draw-again="handleDrawAgain"
        />
      </main>
      
      <Footer />
    </div>
    
    <!-- 功能按钮区域 -->
    <div class="function-buttons">
      <!-- 求签按钮 -->
      <div class="function-button fortune-draw" @click="handleFloatingDrawFortune" title="求签">
        <span class="button-icon">🥢</span>
      </div>
      
      <!-- 历史记录按钮 -->
      <div class="function-button history-quick" @click="handleToggleHistory" title="历史记录">
        <span class="button-icon">📜</span>
      </div>
      
      <!-- 个人信息按钮 -->
      <div class="function-button profile-quick" @click="handleToggleProfile" title="个人信息">
        <span class="button-icon">👤</span>
      </div>
      
      <!-- 教程按钮 -->
      <div class="function-button tutorial-quick" @click="showTutorialManually" title="查看教程">
        <span class="button-icon">❓</span>
      </div>
    </div>
    
    <!-- 音效问题提示 -->
    <SoundMissingHint :is-visible="showSoundError" @close="closeSoundHint" />
    
    <!-- 新手教程 -->
    <CookieTutorial :is-visible="showTutorial" @close="closeTutorial" />
  </div>
</template>

<style scoped>
/* 全局基础样式 */
#app-outer-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  transition: background-color 0.5s;
  background-image: url('/images/阴阳师插画1-optimized.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  overflow-x: hidden;
}

#app-outer-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(255, 248, 231, 0.4), rgba(242, 232, 203, 0.7));
  z-index: 0;
}

#app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 30px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(255, 248, 231, 0.85);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(106, 58, 46, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 40px auto;
  border: 1px solid rgba(212, 175, 55, 0.4);
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  backdrop-filter: blur(5px);
  font-family: 'STFangsong', 'FangSong', 'KaiTi', serif;
  background-image: 
    repeating-linear-gradient(
      to right,
      rgba(139, 69, 19, 0.05) 0px,
      rgba(139, 69, 19, 0.05) 1px,
      transparent 1px,
      transparent 4px
    ),
    rgba(255, 248, 231, 0.85);
}

#app-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(to right, rgba(192, 57, 43, 0.8), rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.8));
  border-radius: 8px 8px 0 0;
}

#app-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(to right, rgba(192, 57, 43, 0.8), rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.8));
  border-radius: 0 0 8px 8px;
}

#app-container:hover {
  box-shadow: 0 15px 35px rgba(106, 58, 46, 0.35), 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  position: relative;
}

/* 功能按钮区域样式 */
.function-buttons {
  position: fixed;
  bottom: 25px;
  right: 25px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 100;
}

.function-button {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: rgba(255, 248, 231, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(212, 163, 85, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 163, 85, 0.5);
  position: relative;
  overflow: hidden;
}

.function-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.function-button:hover {
  transform: scale(1.12);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25), 0 0 0 4px rgba(212, 163, 85, 0.3);
}

.function-button:hover::before {
  opacity: 0.5;
}

.function-button:active {
  transform: scale(0.95);
}

.button-icon {
  font-size: 1.7em;
  color: #8B4513;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.fortune-draw .button-icon {
  color: #C0392B;
}

.history-quick .button-icon {
  color: #8B4513;
}

.profile-quick .button-icon {
  color: #27445C;
}

.tutorial-quick .button-icon {
  color: #3498db;
  font-size: 1.5em;
}

.date-display {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: rgba(255, 248, 231, 0.9);
  border-radius: 30px;
  font-size: 1.05em;
  color: #5D4037;
  z-index: 10;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(212, 163, 85, 0.3);
  border: 1px solid rgba(212, 163, 85, 0.5);
  font-family: 'STFangsong', 'FangSong', 'KaiTi', serif;
}

/* 基础动画效果 */
@keyframes float-in {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* 动画效果 */
.animating .sakura-petal {
  animation-duration: 5s, 2s !important;
  animation-timing-function: linear, ease-in-out !important;
}

/* 媒体查询调整 */
@media (max-width: 768px) {
  #app-container {
    margin: 15px 10px;
    min-height: 0;
    max-width: calc(100% - 20px);
    padding: 20px 15px;
  }
  
  .function-buttons {
    bottom: 15px;
    right: 15px;
    gap: 10px;
  }
  
  .function-button {
    width: 40px;
    height: 40px;
  }
  
  .date-display {
    padding: 6px 12px;
    font-size: 0.85em;
  }

  .main-content {
    padding: 0 10px;
  }
}

@media (max-width: 480px) {
  #app-container {
    padding: 15px 10px;
    margin: 10px 5px;
    border-width: 1px;
  }
  
  .function-buttons {
    bottom: 10px;
    right: 10px;
    gap: 8px;
  }
  
  .function-button {
    width: 35px;
    height: 35px;
  }
  
  .date-display {
    padding: 4px 10px;
    font-size: 0.75em;
  }
  
  .main-content {
    padding: 0 10px;
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  #app-container {
    max-width: 850px;
    padding: 35px;
  }

  .main-content {
    padding: 0 30px;
  }
}

.corner-knot-decoration {
  /* position: absolute;
  top: -20px; 
  left: -30px; 
  z-index: 100;
  pointer-events: none; */
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fdf2f2;
  color: #333;
  transition: background-color 0.5s, color 0.5s;
  overflow-x: hidden;
}

#app-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 60px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  #app-container {
    padding-top: 70px;
  }
  
  .date-display {
    top: 18px;
    left: 15px;
    font-size: 0.8rem;
  }
}

.main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
</style>
