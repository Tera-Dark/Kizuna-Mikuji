<template>
  <div class="onmyoji-button-container" :class="{ 'drawing': isDrawing }">
    <!-- 主 clickable 元素，作为签筒 -->
    <div 
      class="fortune-cylinder"
      @click="drawFortune" 
      :class="{ 
        'disabled': isDrawing || props.disabled, 
        'drawing-animation': isDrawing 
      }"
      role="button"
      tabindex="0" 
      @keydown.enter="drawFortune" 
      @keydown.space="drawFortune"
    >
      <div class="cylinder-top-rim"></div>
      <div class="cylinder-body">
        <div class="cylinder-text-background">
          <span class="cylinder-text">签</span>
        </div>
      </div>
      <div class="cylinder-bottom-rim"></div>

      <!-- New Red String and Knot Animation Elements -->
      <div class="red-string-animation-container" v-if="isDrawing">
        <div class="red-string string-1"></div>
        <div class="red-string string-2"></div>
        <div class="red-string string-3"></div>
        <div class="knot-effigy">
          <span class="petal petal-1"></span>
          <span class="petal petal-2"></span>
          <span class="petal petal-3"></span>
          <span class="petal petal-4"></span>
          <span class="petal petal-5"></span>
        </div>
      </div>
    </div>
    
    <!-- 粒子效果 (保留) -->
    <div class="particles-container" v-if="isDrawing">
      <div v-for="n_in_for in 12" :key="n_in_for" class="particle" :style="getParticleStyle(n_in_for)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';
import { useAudio } from '../composables/useAudio';

const props = defineProps({
  category: {
    type: String,
    default: '爱情缘分' // 虽然按钮样式变了，但这个prop可能仍被外部使用
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'animation-start', 'animation-end', 'sound-error']);

const fortuneStore = useFortuneStore();
const isDrawing = ref(false);

// 使用音频组合式函数
const { play, hasError } = useAudio();

// 根据类别显示不同的提示文字
const buttonInstruction = computed(() => {
  const instructions = {
    '爱情缘分': '拖动铃铛或点击按钮，聆听爱情的声音',
    '前世姻缘': '摇动铃铛，窥探前世的情缘密码',
    '事业运势': '轻摇结缘铃，解读你的事业机遇',
    '人际关系': '铃声悠扬，人际关系自然畅通',
    '健康平安': '一铃一福，祈愿平安健康',
    '姓名解析': '输入姓名，解读名字的秘密',
    '姻缘配对': '填写双方姓名，测试你们的缘分',
    '每日一签': '每日一摇，吉祥如意'
  };
  
  return instructions[props.category] || '拖动铃铛，聆听缘分的声音';
});

const drawFortune = async () => {
  if (isDrawing.value || props.disabled) return;
  
  isDrawing.value = true;
  emit('animation-start');
  emit('click');
  
  try {
    await playWindChimeSound();
    
    await new Promise(resolve => setTimeout(resolve, 2200)); 
    fortuneStore.drawFortune();
  } catch (error) {
    console.error('抽签失败:', error);
  } finally {
    setTimeout(() => {
      isDrawing.value = false;
      emit('animation-end');
    }, 800); 
  }
};

const playWindChimeSound = async () => {
  try {
    await play('sounds/wind-chime.mp3', 0.7);
  } catch (error) {
    console.warn('播放音效失败:', error);
    emit('sound-error');
  }
  
  if (hasError.value) {
    emit('sound-error');
  }
};

const getParticleStyle = (index_in_getParticleStyle: number) => {
  const angle = (index_in_getParticleStyle / 12) * Math.PI * 2;
  const delay = (index_in_getParticleStyle % 5) * 0.1;
  const size = Math.random() * 8 + 4;
  const distance = Math.random() * 60 + 40;
  
  return {
    '--angle': angle + 'rad',
    '--delay': delay + 's',
    '--size': size + 'px',
    '--distance': distance + 'px',
    '--hue': (index_in_getParticleStyle * 30) % 360 + 'deg'
  };
};

// 如果需要，可以保留或修改 playShakeAnimation 用于播放声音
// const playShakeAnimation = () => { ... };

// 导出 drawFortune 方法，使其可以在父组件中调用
defineExpose({
  drawFortune
});

</script>

<style scoped>
.onmyoji-button-container {
  position: relative;
  width: 180px; /* 容器宽度调整 */
  height: 220px; /* 容器高度调整 */
  margin: 25px auto; /* 边距调整 */
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px; 
}

.fortune-cylinder {
  width: 100px; /* 签筒宽度调整 */
  height: 160px; /* 签筒高度调整 */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform-style: preserve-3d; 
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.3s ease;
  /* 添加一个微妙的初始倾斜，增加动感 */
  /* transform: rotateX(-5deg) rotateY(3deg); */
}

.fortune-cylinder:hover:not(.disabled) {
  transform: scale(1.05) rotateX(-7deg) rotateY(5deg); /* 悬浮时更明显的3D效果 */
}

.fortune-cylinder.disabled {
  cursor: not-allowed;
  filter: grayscale(0.6) opacity(0.7);
  /* transform: rotateX(0) rotateY(0) !important; */ /* 禁用时移除倾斜 */
}

.cylinder-top-rim,
.cylinder-bottom-rim {
  width: 100%; 
  height: 22px; /* 筒边厚度调整 */
  /* 主题色渐变 - 缘结红 + 祈愿粉 + 金色点缀 */
  background: linear-gradient(to bottom, #F8CACC, #E56D61 50%, #D9544D);
  border-radius: 50% / 12px; /* 调整椭圆弧度 */
  box-shadow: 0 2px 5px rgba(178, 34, 34, 0.3), /* 外部阴影 */
              inset 0 2px 2px rgba(255, 255, 255, 0.5), /* 内部高光 */
              inset 0 -1px 2px rgba(184, 67, 62, 0.4); /* 内部下边缘细阴影 */
  position: relative; /* 为了添加金色边缘 */
  z-index: 2;
}

/* 金色边缘 */
.cylinder-top-rim::before, 
.cylinder-bottom-rim::before {
  content: '';
  position: absolute;
  top: 1px; bottom: 1px; left: 1px; right: 1px; /* 微调边框位置和粗细 */
  border-radius: 50% / 11px; /* 匹配父元素圆角 */
  border: 1.5px solid rgba(229, 162, 60, 0.6); /* 流光金细边框 */
  pointer-events: none; /* 不影响点击 */
  mix-blend-mode: overlay; /* 尝试混合模式 */
  opacity: 0.8;
}

.cylinder-top-rim {
  margin-bottom: -12px; 
  z-index: 3; 
}

.cylinder-bottom-rim {
  margin-top: -12px; 
}

.cylinder-body {
  width: 88px; /* 筒身宽度调整 */
  height: 100%; 
  /* 主题色渐变 - 缘结红，可以考虑叠加和纸纹理 */
  background-color: #D9544D; /* 基础缘结红 */
  background-image: 
    /* 和纸纹理 (示意，实际使用需要合适的图片) */
    /* url('/images/washi-texture-light.png'), */ 
    /* subtle vertical lines */
    repeating-linear-gradient(to right, 
      rgba(255, 255, 255, 0.06) 0px, rgba(255, 255, 255, 0.06) 1px, 
      transparent 1px, transparent 5px
    ),
    /* subtle highlight */
    linear-gradient(to right, 
      rgba(255, 250, 250, 0.15) 0%, 
      rgba(255, 250, 250, 0.0) 40%,
      rgba(255, 250, 250, 0.0) 60%,
      rgba(255, 250, 250, 0.15) 100%
    ),
    /* base color gradient */
    linear-gradient(170deg, #E56D61, #D9544D 60%, #B8433E);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 6px 8px rgba(184, 67, 62, 0.2), 
              inset 0 -6px 8px rgba(184, 67, 62, 0.2);
  border-left: 1px solid rgba(184, 67, 62, 0.3);
  border-right: 1px solid rgba(184, 67, 62, 0.3);
  z-index: 1; /* 确保筒身在签的后面 */
}

.cylinder-text-background {
  background-color: #FFF9F0; /* 调整为更像御札的米黄色 */
  padding: 8px 15px; /* 调整内边距 */
  border-radius: 4px; /* 边角调整得更锐利一些 */
  border: 1.5px solid #B8433E; /* 深红色边框 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.15); /* 增加一点立体感 */
  transform: rotate(-3deg); /* 轻微倾斜增加趣味性 */
  z-index: 2; /* 提升层级，确保在签的上方 */
  position: relative; /* 确保z-index生效 */
  transition: opacity 0.3s ease-out; /* For fade out */
}

.fortune-cylinder.drawing-animation .cylinder-text-background {
  opacity: 0;
}

.cylinder-text {
  font-size: 40px; /* 调整字体大小 */
  font-family: 'Ma Shan Zheng', 'Noto Serif SC', serif; /* 优先使用马善政字体 */
  color: #8C3835; /* 更深的红棕色，接近墨书效果 */
  font-weight: bold;
  line-height: 1;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.3); /* 添加细微的文字高光 */
}

/* 抽签动画 */
.fortune-cylinder.drawing-animation {
  /* Intentionally left blank, specific animations will be on children */
}

/* Red String Animation */
.red-string-animation-container {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2; /* Above body, below rims */
}

.red-string {
  position: absolute;
  width: 5px; /* Thicker for visibility */
  height: 80px; /* Length of string segment */
  background: #D9544D; /*縁結びの赤*/
  border-radius: 3px;
  opacity: 0;
  transform-origin: 50% 100%; /* Rotate from bottom center */
}

.fortune-cylinder.drawing-animation .string-1 {
  animation: twirl-string-1 1.2s ease-in-out forwards;
}
.fortune-cylinder.drawing-animation .string-2 {
  animation: twirl-string-2 1.2s ease-in-out 0.15s forwards;
}
.fortune-cylinder.drawing-animation .string-3 {
  animation: twirl-string-3 1.2s ease-in-out 0.3s forwards;
}

@keyframes twirl-string-1 {
  0% { opacity: 0; transform: translate(0, -20px) rotate(-60deg) scaleY(0.5); }
  20% { opacity: 1; transform: translate(0, -10px) rotate(-30deg) scaleY(1); }
  70% { opacity: 1; transform: translate(15px, 25px) rotate(45deg) scaleY(1); } /* Move towards center knot position */
  100% { opacity: 0; transform: translate(5px, 15px) rotate(90deg) scaleY(0.5); } /* Fade out near knot */
}
@keyframes twirl-string-2 {
  0% { opacity: 0; transform: translate(-10px, -20px) rotate(0deg) scaleY(0.5); }
  20% { opacity: 1; transform: translate(0, -10px) rotate(0deg) scaleY(1); }
  70% { opacity: 1; transform: translate(0px, 25px) rotate(180deg) scaleY(1); }
  100% { opacity: 0; transform: translate(0px, 15px) rotate(220deg) scaleY(0.5); }
}
@keyframes twirl-string-3 {
  0% { opacity: 0; transform: translate(10px, -20px) rotate(60deg) scaleY(0.5); }
  20% { opacity: 1; transform: translate(0, -10px) rotate(30deg) scaleY(1); }
  70% { opacity: 1; transform: translate(-15px, 25px) rotate(315deg) scaleY(1); }
  100% { opacity: 0; transform: translate(-5px, 15px) rotate(360deg) scaleY(0.5); }
}

/* Knot Effigy Styling */
.knot-effigy {
  position: relative; 
  width: 50px; /* Increased size for a more complex knot */
  height: 50px;
  opacity: 0;
  transform: scale(0.5);
  /* display: flex; // No longer needed if petals are absolute
  align-items: center;
  justify-content: center; */
}

.fortune-cylinder.drawing-animation .knot-effigy {
  animation: form-knot-pulse 1.5s ease-out 1s forwards; /* Delay to start after strings */
}

/* Remove old knot pseudo-element styles */
/* .knot-effigy::before, .knot-effigy::after ... (all previous knot styles removed) */

.petal {
  position: absolute;
  width: 15px; /* Width of the petal loop */
  height: 28px; /* Height of the petal loop */
  border: 2.5px solid #E56D61; /* Knot petal color - slightly brighter red */
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; /* Creates an oval/teardrop shape */
  background-color: transparent;
  /* box-shadow: 0 0 3px rgba(217, 84, 77, 0.5); */ /* Optional subtle glow */
  /* Center of the knot-effigy container */
  top: 50%; 
  left: 50%;
  transform-origin: center center;
}

/* Positioning and rotation for each petal to form a 5-petal knot */
/* Angles are 360 / 5 = 72 degrees apart */

.petal-1 {
  transform: translate(-50%, -50%) rotate(0deg) translateY(-10px) rotate(0deg); 
}

.petal-2 {
  transform: translate(-50%, -50%) rotate(72deg) translateY(-10px) rotate(0deg);
}

.petal-3 {
  transform: translate(-50%, -50%) rotate(144deg) translateY(-10px) rotate(0deg);
}

.petal-4 {
  transform: translate(-50%, -50%) rotate(216deg) translateY(-10px) rotate(0deg);
}

.petal-5 {
  transform: translate(-50%, -50%) rotate(288deg) translateY(-10px) rotate(0deg);
}

@keyframes form-knot-pulse {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.2); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

/* 粒子效果调整 */
.particles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 1px;
  pointer-events: none; /* 不阻碍点击 */
  z-index: 0;
}

.particle {
  position: absolute;
  left: 0; top: 0;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  /* 主题粒子颜色：缘结红、祈愿粉、流光金、白色 */
  background-color: hsl(var(--hue), 90%, 75%); /* 使用 HSL 控制颜色 */
  opacity: 0;
  animation: particle-effect 1s var(--delay) ease-out forwards;
}

@keyframes particle-effect {
  0% {
    transform: rotate(var(--angle)) translateX(0) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateX(var(--distance)) scale(0);
    opacity: 0;
  }
}

/* 可以添加筒身装饰，例如红线 */
.cylinder-body::after {
  content: '';
  position: absolute;
  bottom: 25px; /* 红线位置调整 */
  left: -6px; /* 延伸出筒身一点 */
  right: -6px;
  height: 5px; /* 红线粗细调整 */
  background-color: #D9544D; /* 使用标准缘结红 */
  border-radius: 2.5px;
  box-shadow: 0 1px 4px rgba(178, 34, 34, 0.6); /* 加强阴影 */
  z-index: 1; /* 确保在筒身之上，但在文字背景之下 */
}
.cylinder-body::before { /* 红线上的结 */
  content: '';
  position: absolute;
  bottom: 21px; /* 结的位置，略高于红线 */
  left: 50%;
  transform: translateX(-50%);
  width: 12px; /* 结的尺寸调整 */
  height: 12px;
  background-color: #C74840; /* 使用略深的缘结红 */
  border: 1.5px solid #A52A2A; /* 更深的边框 */
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(178, 34, 34, 0.7); /* 加强阴影 */
  z-index: 2; /* 确保在红线之上，但在文字背景之下 */
}


/* 响应式调整 - 如果需要的话 */
@media (max-width: 480px) {
  .onmyoji-button-container {
    width: 150px;
    height: 190px;
  }
  .fortune-cylinder {
    width: 85px;
    height: 135px;
  }
  .cylinder-top-rim,
  .cylinder-bottom-rim {
    height: 18px;
  }
  .cylinder-body {
    width: 75px;
  }
  .cylinder-text {
    font-size: 32px;
  }
  .cylinder-text-background {
    padding: 4px 10px;
  }
   .red-string { height: 60px; width: 4px; }
  .knot-effigy { width: 10px; height: 10px; /* Smaller knot for smaller screen */ }
}

</style> 