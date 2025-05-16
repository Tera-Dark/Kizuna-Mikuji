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
      <div class="cylinder-sticks-container">
        <div class="stick stick-1" :class="{ 'is-drawn': drawnStickIndex === 0 && isDrawing }"><div class="stick-top-red"></div></div>
        <div class="stick stick-2" :class="{ 'is-drawn': drawnStickIndex === 1 && isDrawing }"><div class="stick-top-red"></div></div>
        <div class="stick stick-3" :class="{ 'is-drawn': drawnStickIndex === 2 && isDrawing }"><div class="stick-top-red"></div></div>
        <div class="stick stick-4" :class="{ 'is-drawn': drawnStickIndex === 3 && isDrawing }"><div class="stick-top-red"></div></div>
        <div class="stick stick-5" :class="{ 'is-drawn': drawnStickIndex === 4 && isDrawing }"><div class="stick-top-red"></div></div>
        <!-- 可以根据需要添加更多签 -->
      </div>
      <div class="cylinder-body">
        <div class="cylinder-text-background">
          <span class="cylinder-text">签</span>
        </div>
      </div>
      <div class="cylinder-bottom-rim"></div>
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
const drawnStickIndex = ref(-1); // -1表示没有签被抽出, 0-4对应签的索引 (假设5根签)

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
  
  drawnStickIndex.value = 2; 
  
  try {
    playWindChimeSound(); // 调用新的音效播放函数
    
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    fortuneStore.drawFortune();
  } catch (error) {
    console.error('抽签失败:', error);
  } finally {
    setTimeout(() => {
      isDrawing.value = false;
      drawnStickIndex.value = -1; 
      emit('animation-end');
    }, 800); 
  }
};

// 修改后的音效播放函数
const playWindChimeSound = () => {
  try {
    const audio = new Audio('/sounds/wind-chime.mp3'); // 改为播放 wind-chime.mp3
    audio.volume = 0.7; // 你可以根据需要调整音量
    audio.play().catch(err => {
      console.warn('播放音效失败 (wind-chime.mp3):', err);
      emit('sound-error');
      // 可以保留或移除Web Audio API的回退方案，如果bells.mp3不再使用
      // 如果需要为wind-chime也设计回退，这里的频率和逻辑可能需要调整
    });
  } catch (error) {
    console.warn('创建音频对象失败 (wind-chime.mp3):', error);
    emit('sound-error');
  }
};

// 粒子效果的逻辑 (保留)
const getParticleStyle = (index_in_getParticleStyle) => {
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
  width: 200px; /* 调整容器大小以适应签筒 */
  height: 250px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px; /* 为3D效果准备 */
}

.fortune-cylinder {
  width: 120px; /* 签筒宽度 */
  height: 180px; /* 签筒高度 */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform-style: preserve-3d; /* 允许子元素3D变换 */
  transition: transform 0.3s ease;
}

.fortune-cylinder.disabled {
  cursor: not-allowed;
  filter: grayscale(0.7) opacity(0.8);
}

.cylinder-top-rim,
.cylinder-bottom-rim {
  width: 100%; /* 宽度与筒身一致 */
  height: 25px; /* 筒边厚度 */
  background: linear-gradient(to bottom, #F0E68C, #DAA520 60%, #B8860B); /* 更明亮的仿古金色 */
  border-radius: 50% / 15px; /* 椭圆形成筒边效果 */
  box-shadow: 0 3px 6px rgba(0,0,0,0.25), /* 更柔和的外部阴影 */
              inset 0 2px 3px rgba(255,255,255,0.6), /* 内部高光 */
              inset 0 -1px 2px rgba(0,0,0,0.3); /* 内部下边缘细阴影 */
  z-index: 2;
}

.cylinder-top-rim {
  margin-bottom: -13px; /* 略微调整重叠 */
  z-index: 3; /* 顶边在签之上 */
}

.cylinder-bottom-rim {
  margin-top: -13px; /* 略微调整重叠 */
}

.cylinder-body {
  width: 102px; /* 略微调整，配合边框和光影 */
  height: 100%; /* 占据父元素剩余高度 */
  background: linear-gradient(170deg, #D84315, #C0392B 70%, #A02D21); /* 更丰富的红色，带光泽感 */
  background-image: 
    repeating-linear-gradient(to right, 
      rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 3px, 
      transparent 3px, transparent 6px
    ),
    linear-gradient(to right, 
      rgba(255,255,255,0.1) 0%, 
      rgba(255,255,255,0.0) 40%,
      rgba(255,255,255,0.0) 60%,
      rgba(255,255,255,0.1) 100%
    ),
    linear-gradient(170deg, #D84315, #C0392B 70%, #A02D21); /* 底色 */

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 8px 10px rgba(0,0,0,0.15), /* 筒内上部阴影 */
              inset 0 -8px 10px rgba(0,0,0,0.15); /* 筒内下部阴影 */
  /* border-left: 1px solid #8B0000; 
  border-right: 1px solid #8B0000;  */
}

.cylinder-text-background {
  width: 58px; /* 略微调整大小 */
  height: 58px;
  background: radial-gradient(circle, #FFFACD, #FFD700 55%, #F0B31A); /* 更明亮有层次的金色 */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 12px rgba(255,215,0,0.6), 
              inset 0 0 6px rgba(100,50,0,0.2), /* 内部细微阴影 */
              0 1px 2px rgba(0,0,0,0.3); /* 轻微凸起感 */
  border: 1px solid rgba(255,255,255,0.3); /* 细微高光边 */
}

.cylinder-text {
  font-size: 30px; /* 略微调整 */
  font-weight: bold;
  color: #800000; /* 深邃的红色 */
  font-family: 'Noto Serif SC', serif;
  text-shadow: 0px 0px 2px #FFEB3B, /* 金色轻微发光 */
               1px 1px 1px rgba(0,0,0,0.2);
}

.cylinder-sticks-container {
  position: absolute;
  top: 12px; /* 调整签的起始位置，使其在顶边内部 */
  width: 75%; /* 调整签的分布宽度 */
  height: 75px; /* 签露出的部分的高度 */
  display: flex;
  justify-content: center;
  align-items: flex-end; /* 签的底部对齐 */
  z-index: 1; /* 在筒身边缘之下，但在筒身之上 */
  padding-bottom: 5px; /* 避免签直接贴底 */
  transform: translateZ(-2px); /* 稍微靠后 */
}

.stick {
  background: linear-gradient(to bottom, #FDF5E6, #F5E8C0 70%, #E8D8A8); /* 更明亮的签身，带象牙白/米色 */
  width: 9px;
  height: 100%; /* 初始高度 */
  margin: 0 1.5px; /* 调整签间距 */
  border: 1px solid #D2B48C; /* 搭配的边框色 */
  border-top: none;
  border-radius: 3px 3px 0 0;
  position: relative; /* 为了定位红头 */
  box-shadow: 1px 0px 2px rgba(0,0,0,0.15);
  transform-origin: bottom center;
  transition: transform 1s ease-in-out, opacity 0.5s ease-out, box-shadow 0.3s ease;
}

.stick-top-red {
  width: 100%;
  height: 28px; /* 红色部分高度 */
  background: linear-gradient(to bottom, #FF4136, #E74C3C 60%, #C0392B); /* 更鲜艳有层次的红 */
  position: absolute;
  top: -1px; /* 盖住木色签的顶端边框 */
  left: 0;
  border-radius: 2px 2px 0 0;
  clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%); /* 调整为更像符咒头的梯形 */
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.4);
  border-bottom: 1px solid #A52A2A; /* 红色区域底部的分界线 */
}
/* 为签头添加一个极细的金色装饰线 */
.stick-top-red::before {
  content: '';
  position: absolute;
  bottom: 0px; /* 紧贴红色区域下方 */
  left: 0;
  right: 0;
  height: 1.5px; /* 金线高度 */
  background: #FFD700; /* 金色 */
  opacity: 0.8;
}

/* 签的初始错落效果 */
.stick-1 { transform: rotate(-10deg) translateY(4px); height: 92%; }
.stick-2 { transform: rotate(6deg) translateY(-2px); height: 96%; width: 10px;}
.stick-3 { transform: rotate(-2deg) translateY(0px); height: 100%; width: 10px;}
.stick-4 { transform: rotate(3deg) translateY(-1px); height: 94%;}
.stick-5 { transform: rotate(12deg) translateY(6px); height: 88%; width: 8px;}

/* 出签动画 */
.stick.is-drawn {
  animation: stick-emerge-from-cylinder 1.2s ease-in-out 0.5s forwards; /* 延迟0.5s在摇晃后出签 */
  z-index: 10 !important; /* 确保在最前 */
  box-shadow: 0 0 20px #FFD700, 0 0 30px #FF8C00; /* 更强的金色/橙色光晕 */
}

@keyframes stick-emerge-from-cylinder {
  0% {
    transform: translateY(0%) rotate(0deg) scale(1);
    opacity: 1;
  }
  30% {
    transform: translateY(-50%) rotate(0deg) scale(1.05); /* 开始向上 */
  }
  100% {
    transform: translateY(-130%) rotate(0deg) scale(1.1); /* 完全抽出并悬停 */
    opacity: 1;
  }
}

/* 签筒摇晃动画 */
.drawing-animation {
  animation: shake-cylinder-container 0.6s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake-cylinder-container {
  10%, 90% { transform: rotate3d(0,0,1, -2deg) translateX(-2px); }
  20%, 80% { transform: rotate3d(0,0,1, 3deg) translateX(3px); }
  30%, 50%, 70% { transform: rotate3d(0,0,1, -4deg) translateX(-4px); }
  40%, 60% { transform: rotate3d(0,0,1, 4deg) translateX(4px); }
}

/* 粒子效果 (保留) */
.particles-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; z-index: 0; }
.particle { position: absolute; top: 0; left: 0; width: var(--size); height: var(--size); background-color: hsl(var(--hue), 90%, 70%); border-radius: 50%; opacity: 0; transform: rotate(var(--angle)) translateY(0); animation: particle-fly 1.5s ease-out var(--delay) forwards; }
@keyframes particle-fly {0% { opacity: 0.8; transform: rotate(var(--angle)) translateY(0); } 100% { opacity: 0; transform: rotate(var(--angle)) translateY(var(--distance)); }}

</style> 