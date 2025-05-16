<template>
  <div id="sakura-container-vue">
    <div 
      v-for="(petal, index) in petals" 
      :key="index" 
      class="sakura-petal" 
      :class="petal.type"
      :style="petalStyle(petal)"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 使用响应式数组来存储花瓣信息
const petals = ref([]);
let animationInterval = null;

// 创建花瓣样式
const petalStyle = (petal) => {
  return {
    left: petal.left + 'vw',
    animationDuration: `${petal.fallDuration}s, ${petal.swayDuration}s`,
    animationDelay: `${petal.fallDelay}s, ${petal.swayDelay}s`,
    opacity: petal.opacity,
    transform: `scale(${petal.scale}) rotate(${petal.rotation}deg)`,
    filter: `hue-rotate(${petal.hue}deg)`
  };
};

const createSakuraPetals = () => {
  const baseCount = getOptimalPetalCount();
  const numberOfPetals = baseCount + Math.floor(Math.random() * 10); // 动态调整花瓣数量
  const petalTypes = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6'];
  
  // 清空现有花瓣数组
  petals.value = [];
  
  // 创建新的花瓣数据
  for (let i = 0; i < numberOfPetals; i++) {
    petals.value.push({
      type: petalTypes[Math.floor(Math.random() * petalTypes.length)],
      left: Math.random() * 100, // 初始水平位置
      fallDuration: Math.random() * 8 + 7, // 下落时间 7-15秒
      fallDelay: Math.random() * 10,       // 下落延迟 0-10秒
      swayDuration: Math.random() * 3 + 2, // 摇摆周期 2-5秒
      swayDelay: Math.random() * 2,        // 摇摆延迟 0-2秒
      opacity: 0.5 + Math.random() * 0.5,  // 透明度 0.5-1.0
      scale: 0.7 + Math.random() * 0.6,    // 缩放比例 0.7-1.3
      rotation: Math.random() * 360,       // 随机旋转角度
      hue: Math.random() * 20 - 10         // 色调微调 -10到10度
    });
  }
};

// 根据窗口大小计算合适的花瓣数量
const getOptimalPetalCount = () => {
  const width = window.innerWidth;
  if (width < 480) return 15;
  if (width < 768) return 25;
  if (width < 1200) return 35;
  return 45;
};

// 定期添加新花瓣
const addNewPetals = () => {
  const petalTypes = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6'];
  
  // 随机添加1-3个新花瓣
  const count = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < count; i++) {
    petals.value.push({
      type: petalTypes[Math.floor(Math.random() * petalTypes.length)],
      left: Math.random() * 100,
      fallDuration: Math.random() * 8 + 7,
      fallDelay: 0, // 立即开始下落
      swayDuration: Math.random() * 3 + 2,
      swayDelay: 0,
      opacity: 0.5 + Math.random() * 0.5,
      scale: 0.7 + Math.random() * 0.6,
      rotation: Math.random() * 360,
      hue: Math.random() * 20 - 10
    });
  }
  
  // 限制花瓣总数，避免性能问题
  const maxPetals = getOptimalPetalCount() + 20;
  if (petals.value.length > maxPetals) {
    petals.value = petals.value.slice(petals.value.length - maxPetals);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  createSakuraPetals();
};

// 创建季节主题色调变化
const applySeasonalTheme = () => {
  const date = new Date();
  const month = date.getMonth();
  
  // 春季(3-5月)：樱花粉色
  // 夏季(6-8月)：偏暖色调
  // 秋季(9-11月)：偏橙色调
  // 冬季(12-2月)：偏蓝色调
  
  let hueRotation = 0;
  
  if (month >= 2 && month <= 4) {
    // 春季 - 默认樱花色
    hueRotation = 0;
  } else if (month >= 5 && month <= 7) {
    // 夏季 - 略带黄色调
    hueRotation = 15;
  } else if (month >= 8 && month <= 10) {
    // 秋季 - 橙色调
    hueRotation = 30;
  } else {
    // 冬季 - 略带蓝色调
    hueRotation = -20;
  }
  
  // 更新花瓣颜色
  petals.value.forEach(petal => {
    petal.hue = hueRotation + Math.random() * 20 - 10;
  });
};

onMounted(() => {
  createSakuraPetals();
  applySeasonalTheme();
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
  
  // 设置定时器，每10秒添加新花瓣
  animationInterval = setInterval(() => {
    addNewPetals();
  }, 10000);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (animationInterval) {
    clearInterval(animationInterval);
  }
});
</script>

<style scoped>
#sakura-container-vue {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.sakura-petal {
  position: absolute;
  background-color: rgba(255, 192, 203, 0.8);
  border-radius: 50% 0;
  width: 15px;
  height: 15px;
  opacity: 0;
  animation-name: fall, sway;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite, infinite;
  box-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
  will-change: transform, opacity;
  transition: filter 2s ease-in-out;
}

/* 花瓣类型 */
.sakura-petal.type1 {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 182, 193, 0.75);
  border-radius: 50% 0 50% 0;
}

.sakura-petal.type2 {
  width: 8px;
  height: 18px;
  border-radius: 0 50% 50% 50%;
  background-color: rgba(255, 192, 203, 0.85);
}

.sakura-petal.type3 {
  width: 15px;
  height: 10px;
  background-color: rgba(240, 128, 128, 0.7);
  border-radius: 50% 50% 0 50%;
}

.sakura-petal.type4 {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 228, 225, 0.8);
}

.sakura-petal.type5 {
  width: 14px;
  height: 14px;
  background-color: rgba(255, 170, 180, 0.75);
  border-radius: 50% 10% 50% 10%;
  box-shadow: 0 0 8px rgba(255, 105, 180, 0.5);
}

.sakura-petal.type6 {
  width: 9px;
  height: 12px;
  background-color: rgba(255, 200, 200, 0.8);
  border-radius: 50% 50% 10% 50%;
}

@keyframes fall {
  0% {
    top: -10%;
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    top: 110%;
    opacity: 0;
  }
}

@keyframes sway {
  0% {
    transform: translateX(0px) rotateZ(0deg);
  }
  25% {
    transform: translateX(20px) rotateZ(15deg);
  }
  50% {
    transform: translateX(40px) rotateZ(30deg);
  }
  75% {
    transform: translateX(20px) rotateZ(15deg);
  }
  100% {
    transform: translateX(0px) rotateZ(0deg);
  }
}

/* 添加视差效果，前景花瓣更大更快 */
.sakura-petal.type1, .sakura-petal.type5 {
  animation-duration: 6s, 2s;
  z-index: 2;
}

/* 媒体查询优化 */
@media (max-width: 768px) {
  .sakura-petal {
    box-shadow: none;
  }
}

@media (min-width: 1440px) {
  .sakura-petal {
    transform-origin: center;
  }
  
  .sakura-petal.type1, .sakura-petal.type3, .sakura-petal.type5 {
    width: 18px;
    height: 18px;
  }
}
</style> 