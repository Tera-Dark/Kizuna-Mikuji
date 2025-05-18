<script setup>
import { ref, onMounted, computed, watch, onUnmounted, defineAsyncComponent, Teleport } from 'vue';
import SakuraBackground from './components/SakuraBackground.vue';
import RedThreadBackground from './components/RedThreadBackground.vue';
import Header from './components/Header.vue';
import FortuneButton from './components/FortuneButton.vue';
import FortuneResult from './components/FortuneResult.vue';
import Footer from './components/Footer.vue';
import FortuneHistory from './components/FortuneHistory.vue';
import CategorySelector from './components/CategorySelector.vue';
// import CoupleFortuneDrawing from './components/CoupleFortuneDrawing.vue';
// import NameFortune from './components/NameFortune.vue';
// import ZodiacCompatibility from './components/ZodiacCompatibility.vue';
// import DestinyBall from './components/DestinyBall.vue';
import UserProfile from './components/UserProfile.vue';
import CookieTutorial from './components/CookieTutorial.vue';
import SoundMissingHint from './components/SoundMissingHint.vue';
import { useFortuneStore } from './stores/FortuneStore';
import { useUserStore } from './stores/UserStore';
import { useAudio } from './composables/useAudio';

// 动态导入条件渲染的组件
const NameFortune = defineAsyncComponent(() => import('./components/NameFortune.vue'));
const CoupleFortuneDrawing = defineAsyncComponent(() => import('./components/CoupleFortuneDrawing.vue'));
const ZodiacCompatibility = defineAsyncComponent(() => import('./components/ZodiacCompatibility.vue'));
const DestinyBall = defineAsyncComponent(() => import('./components/DestinyBall.vue'));

// 使用状态管理
const fortuneStore = useFortuneStore();
const userStore = useUserStore();

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

// 使用音频组合式函数
const { preload } = useAudio();

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
  
  // 开发调试信息：显示localStorage中的所有缓存数据
  console.log('当前localStorage内容:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`- ${key}: ${localStorage.getItem(key)}`);
  }
  
  // 检查是否需要显示新手教程
  const hasSeenTutorial = localStorage.getItem('hasSeenTutorial') === 'true';
  console.log('用户是否已看过教程:', hasSeenTutorial);
  
  // 仅在用户未看过教程时显示
  if (!hasSeenTutorial) {
    console.log('用户第一次访问，准备显示教程');
    // 延迟时间增加，确保页面完全加载
    setTimeout(() => {
      console.log('显示教程弹窗');
      showTutorial.value = true;
    }, 1500);
  } else {
    console.log('用户已看过教程，不再显示');
  }
  
  // 记录用户访问
  userStore.recordVisit();
  
  // 加载必要的资源
  preloadSounds();
  
  // 添加全局按键事件监听，Shift+T 组合键显示教程，Shift+R 重置教程状态
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
const preloadSounds = async () => {
  try {
    // 使用audioUtils中的preloadSounds
    await preload([
      'sounds/wind-chime.mp3',
      'sounds/bells.mp3', 
      'sounds/reveal.mp3'
    ]);
    console.log('音效预加载完成');
  } catch (error) {
    console.error('音效预加载失败', error);
    // 显示音效错误提示
    showSoundError.value = true;
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
  // 保存已看过教程的标记，防止下次自动显示
  localStorage.setItem('hasSeenTutorial', 'true');
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
  console.log('准备重置教程状态');
  // 添加确认对话框，防止意外重置
  if (confirm('确定要重置教程状态吗？这将在下次刷新页面时再次显示新手教程。')) {
    console.log('已确认重置教程状态');
    localStorage.removeItem('hasSeenTutorial');
    showTutorial.value = true;
  } else {
    console.log('取消重置教程状态');
  }
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
    
    <!-- 功能按钮区域使用 Teleport 移动到 body 下 -->
    <Teleport to="body">
      <div class="function-buttons">
        <!-- 求签按钮 -->
        <div class="function-button fortune-draw" @click="handleFloatingDrawFortune" title="求签">
          <span class="button-icon">🔮</span>
        </div>
        
        <!-- 历史记录按钮 -->
        <div class="function-button history-quick" @click="handleToggleHistory" title="历史记录">
          <span class="button-icon">📜</span>
        </div>
        
        <!-- 个人信息按钮 -->
        <div class="function-button profile-quick" @click="handleToggleProfile" title="个人信息">
          <span class="button-icon">🎀</span>
        </div>
        
        <!-- 教程按钮 -->
        <div class="function-button tutorial-quick" @click="showTutorialManually" title="查看教程">
          <span class="button-icon">📖</span>
        </div>
      </div>
    </Teleport>
    
    <!-- 音效问题提示 -->
    <SoundMissingHint :is-visible="showSoundError" @close="closeSoundHint" />
    
    <!-- 新手教程 -->
    <CookieTutorial :is-visible="showTutorial" @close="closeTutorial" />
  </div>
</template>

<style scoped>
/* 主应用容器 */
#app-outer-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 内容从顶部开始排列 */
  align-items: center; /* 水平居中 #app-container */
  padding: 20px; /* 应用整体的边缘内边距 */
  box-sizing: border-box;
  position: relative; 
  /* transform: none; */ /* 之前的fixed定位辅助，现在不需要 */
  /* overflow-x: hidden; */ /* 确保没有不必要的横向滚动 */
}

/* 确保 #app-outer-container 的伪元素不设置背景，以免覆盖全局背景 */
#app-outer-container::before {
  display: none; 
}

/* 主要内容卡片 */
#app-container { 
  width: 100%; 
  min-width: 450px; /* 避免内容过于拥挤 */
  max-width: 700px; /* 内容最大宽度，保持可读性 */
  margin-top: 10px; /* 与上方元素的间距 */
  margin-bottom: 10px; /* 与下方元素的间距 */
  padding: 30px; /* 卡片内部的内边距 */
  background-color: rgba(255, 245, 245, 0.92); /* 更温暖的祈愿粉色调半透明背景 */
  border-radius: 30px; /* 更圆润的边角 */
  box-shadow: 0 10px 35px rgba(217, 84, 77, 0.2), 0 2px 8px rgba(217, 84, 77, 0.1); /* 缘结红主题色阴影 */
  border: 1.5px solid rgba(229, 109, 97, 0.45); /* 缘结红主题色边框 */
  
  display: flex;
  flex-direction: column;
  align-items: center; /* 使内部块级子元素如Header, Footer, main-content也居中 */
  gap: 25px; /* Header, main-content, Footer 之间的间距 */
  position: relative;
  z-index: 1;
  /* backdrop-filter: blur(5px); */ /* 可选：根据背景复杂程度决定是否开启更强的毛玻璃效果 */
}

/* 确保 Header, main-content, Footer 在 #app-container 内占据全部宽度 */
#app-container > .Header, 
#app-container > .main-content,
#app-container > .Footer {
  width: 100%;
  box-sizing: border-box; /* 确保padding和border不影响宽度计算 */
}


.main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px; 
  padding: 0; /* 移除此处的padding，由父级#app-container控制 */
}

/* 功能按钮容器 (保持fixed定位) */
.function-buttons {
  position: fixed;
  right: 25px; 
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999; 
  background-color: rgba(255, 235, 235, 0.85); /* 浅祈愿粉色调半透明背景 */
  padding: 15px;
  border-radius: 20px; /* 更圆润的边角 */
  box-shadow: 0 6px 18px rgba(217, 84, 77, 0.2); /* 缘结红主题色柔和阴影 */
  border: 1px solid rgba(229, 109, 97, 0.3); /* 细微的缘结红主题色边框 */
}

.function-buttons .function-button {
  width: 60px; 
  height: 60px;
  border-radius: 50%; 
  background-color: #D9544D; /* 缘结红 */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #FFF0F0; /* 极淡的粉色边框，更柔和 */
  box-shadow: 0 3px 10px rgba(178, 34, 34, 0.25); /* 调整后的阴影 */
}

.function-buttons .function-button:hover {
  background-color: #C74840; /* 深一点的缘结红 */
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 4px 15px rgba(178, 34, 34, 0.35); /* 悬浮时更明显的阴影 */
}

.function-buttons .function-button .button-icon { /* 原代码的选择器 */
  font-size: 1.8em; 
  line-height: 1; 
  margin: 0;
}

/* 日期显示样式 */
.date-display {
  position: fixed;
  top: 25px; /* 稍微向下调整 */
  left: 25px; /* 稍微向右调整 */
  padding: 10px 20px;
  background-color: rgba(253, 230, 230, 0.95); /* 柔和的祈愿粉色调背景 */
  border-radius: 30px;
  font-size: 1.05em;
  color: #C74840; /* 深缘结红色 */
  z-index: 1000; /* 确保在内容之上 */
  box-shadow: 0 4px 15px rgba(217, 84, 77, 0.18), 0 0 0 1px rgba(229, 109, 97, 0.3); /* 调整后的红色系阴影和边框感 */
  border: 1px solid rgba(229, 109, 97, 0.4); /* 调整后的边框 */
  font-family: var(--font-family-serif); /* 使用全局衬线字体 */
  text-shadow: 0 1px 2px rgba(255,255,255,0.4); /* 微弱的白色文字阴影提升对比度 */
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
  #app-outer-container {
    padding: 15px;
  }
  #app-container {
    min-width: calc(100% - 10px); /* 几乎占满外部容器，留少量边距 */
    max-width: calc(100% - 10px);
    padding: 20px 15px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .function-buttons {
    right: 15px;
    gap: 10px;
    padding: 10px;
  }
  
  .function-buttons .function-button {
    width: 48px;
    height: 48px;
  }
   .function-buttons .function-button .button-icon {
    font-size: 1.5em;
  }
  
  .date-display {
    top: 15px;
    left: 15px;
    padding: 8px 15px;
    font-size: 0.9em;
  }

  .main-content {
    gap: 20px;
  }
}

@media (max-width: 480px) {
   #app-outer-container {
    padding: 10px;
  }
  #app-container {
    padding: 15px 10px;
    border-radius: 20px;
    gap: 15px;
  }
  
  .function-buttons {
    right: 10px;
    gap: 8px;
    padding: 8px;
  }
  
  .function-buttons .function-button {
    width: 42px;
    height: 42px;
  }
  .function-buttons .function-button .button-icon {
    font-size: 1.3em;
  }
  
  .date-display {
    padding: 6px 12px;
    font-size: 0.8em;
    top: 10px;
    left: 10px;
  }
   .main-content {
    gap: 15px;
  }
}

/* 大屏幕优化 - 可以保留，但要确保不与主要宽度定义冲突 */
/* @media (min-width: 1200px) {
  #app-container {
    max-width: 850px; 
    padding: 35px;
  }
} */

/* REMOVE ALL STYLES FROM HERE DOWN TO THE END OF THE <style scoped> TAG */
/* body { ... } */ 
/* #app-container { ... } */ 
/* @media (max-width: 768px) { #app-container { ... } } */
/* .main-content { ... } */

</style>
