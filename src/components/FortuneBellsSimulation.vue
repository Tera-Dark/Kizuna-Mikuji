<template>
  <div class="bells-container" @click="shakeBells">
    <div class="fortune-bells" :class="{ 'shaking': isShaking }">
      <!-- 红线装饰 -->
      <div class="red-threads">
        <div class="thread thread-1"></div>
        <div class="thread thread-2"></div>
        <div class="thread thread-3"></div>
      </div>
      
      <!-- 铃铛emoji -->
      <div class="bell-emoji">🔔</div>
      
      <!-- 光效 -->
      <div class="bell-glow"></div>
    </div>
    
    <!-- 粒子效果 -->
    <div class="particles-container" v-if="isShaking">
      <div v-for="n in 12" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- 波纹效果 -->
    <div class="ripple-container" v-if="isShaking">
      <div class="ripple"></div>
      <div class="ripple" style="animation-delay: 0.3s"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isShaking = ref(false);

// 摇晃铃铛
const shakeBells = () => {
  if (isShaking.value) return;
  
  isShaking.value = true;
  
  // 播放铃铛音效
  playBellSound();
  
  // 3秒后结束震动
  setTimeout(() => {
    isShaking.value = false;
  }, 3000);
};

// 播放铃铛音效
const playBellSound = () => {
  try {
    const audio = new Audio('/sounds/bells.mp3');
    audio.volume = 0.7;
    audio.play().catch(error => {
      console.error('音频播放失败:', error);
      emit('sound-error');
    });
  } catch (error) {
    console.error('音频播放失败:', error);
    emit('sound-error');
  }
};

// 获取随机粒子样式
const getParticleStyle = (index) => {
  const angle = (index / 12) * Math.PI * 2;
  const delay = (index % 5) * 0.1;
  const size = Math.random() * 8 + 4;
  const distance = Math.random() * 60 + 40;
  
  return {
    '--angle': angle + 'rad',
    '--delay': delay + 's',
    '--size': size + 'px',
    '--distance': distance + 'px',
    '--hue': (index * 30) % 360 + 'deg'
  };
};

// 定义事件
const emit = defineEmits(['sound-error']);

// 将方法暴露给父组件
defineExpose({
  shakeBells
});
</script>

<style scoped>
.bells-container {
  position: relative;
  width: 80px;
  height: 90px;
  margin: 20px auto;
  cursor: pointer;
  z-index: 2;
}

.fortune-bells {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
}

/* 铃铛emoji样式 */
.bell-emoji {
  font-size: 42px;
  position: relative;
  z-index: 3;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
  transform-origin: center top;
}

/* 红线装饰 */
.red-threads {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.thread {
  position: absolute;
  background-color: #e74c3c;
  border-radius: 2px;
}

.thread-1 {
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
}

.thread-2 {
  top: 20px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 40px;
  height: 2px;
}

.thread-3 {
  top: 20px;
  left: 50%;
  transform: translateX(-50%) rotate(-45deg);
  width: 40px;
  height: 2px;
}

/* 光效 */
.bell-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0) 70%);
  border-radius: 50%;
  opacity: 0;
  z-index: 0;
  transition: opacity 0.3s ease;
}

/* 震动效果 */
.fortune-bells.shaking .bell-emoji {
  animation: shake 0.1s ease-in-out infinite alternate;
}

.fortune-bells.shaking .bell-glow {
  opacity: 0.7;
  animation: pulse 1s ease-in-out infinite;
}

/* 粒子效果 */
.particles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  z-index: 0;
}

.particle {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  background-color: hsl(var(--hue), 90%, 70%);
  border-radius: 50%;
  opacity: 0;
  transform: rotate(var(--angle)) translateY(0);
  animation: particle-fly 1.5s ease-out var(--delay) forwards;
}

/* 波纹效果 */
.ripple-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  z-index: 0;
}

.ripple {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  animation: ripple 1.5s ease-out infinite;
  opacity: 0;
}

@keyframes shake {
  0% { transform: rotate(-10deg); }
  100% { transform: rotate(10deg); }
}

@keyframes pulse {
  0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
  100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
}

@keyframes particle-fly {
  0% { 
    opacity: 0.8; 
    transform: rotate(var(--angle)) translateY(0);
  }
  100% { 
    opacity: 0; 
    transform: rotate(var(--angle)) translateY(var(--distance));
  }
}

@keyframes ripple {
  0% { 
    opacity: 0.8; 
    transform: scale(0);
  }
  100% { 
    opacity: 0; 
    transform: scale(1.5);
  }
}

/* 鼠标悬停效果 */
.fortune-bells:hover {
  transform: scale(1.1);
}

/* 深色主题适配 */
:deep(.dark-theme) .thread {
  background-color: #ff5e62;
}

:deep(.dark-theme) .bell-glow {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0) 70%);
}
</style> 