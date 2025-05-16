<template>
  <div id="red-thread-container" ref="threadContainer">
    <!-- 添加铃铛装饰元素 -->
    <div v-for="bell in bellDecorations" :key="bell.id" class="bell-decoration" :style="bellStyle(bell)"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from 'vue';

// 线条元素的容器引用
const threadContainer = ref(null);
// 存储创建的线条元素
const threads = ref([]);
// 存储铃铛装饰元素
const bellDecorations = ref([]);
// 线条数量
const threadCount = 20; // 增加线条数量
// 铃铛装饰数量
const bellCount = 7;
// 控制动画
let animationFrameId = null;
// 是否是暗色模式
const isDarkMode = ref(false);

// 铃铛样式计算
const bellStyle = (bell) => {
  return {
    left: `${bell.left}%`,
    top: `${bell.top}%`,
    transform: `rotate(${bell.rotation}deg) scale(${bell.scale})`,
    opacity: bell.opacity,
    animationDelay: `${bell.delay}s`,
    width: `${bell.size}px`,
    height: `${bell.size}px`,
    filter: `hue-rotate(${bell.hue}deg) brightness(${bell.brightness})`,
    animationDuration: `${bell.duration}s, ${bell.swayDuration}s`
  };
};

// 监听暗色模式变化
watchEffect(() => {
  const isDark = document.body.classList.contains('dark-theme');
  isDarkMode.value = isDark;
  
  // 如果线条已创建，更新它们的颜色
  if (threads.value.length > 0) {
    updateThreadColors();
  }
});

// 更新线条颜色
const updateThreadColors = () => {
  threads.value.forEach(thread => {
    // 暗色模式下使用更明亮的红色
    const baseColor = isDarkMode.value ? 'rgba(255, 76, 76, ' : 'rgba(238, 40, 40, ';
    const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
    thread.element.style.borderColor = baseColor + opacity + ')';
    
    // 增加光晕效果
    thread.element.style.boxShadow = isDarkMode.value 
      ? `0 0 10px rgba(255, 76, 76, ${opacity * 0.6})` 
      : `0 0 8px rgba(238, 40, 40, ${opacity * 0.4})`;
  });
  
  // 更新铃铛颜色
  bellDecorations.value.forEach(bell => {
    bell.brightness = isDarkMode.value ? 1.2 : 1;
  });
};

// 创建红线
const createThreads = () => {
  if (!threadContainer.value) return;
  
  // 清除现有线条
  threads.value.forEach(thread => {
    if (thread.element && thread.element.parentNode) {
      thread.element.parentNode.removeChild(thread.element);
    }
  });
  
  threads.value = [];
  
  // 获取容器尺寸
  const containerRect = threadContainer.value.getBoundingClientRect();
  const { width, height } = containerRect;

  // 创建新线条
  for (let i = 0; i < threadCount; i++) {
    // 创建线条元素
    const thread = document.createElement('div');
    thread.classList.add('thread');
    
    // 增加一些线条有节点的效果
    if (i % 5 === 0) {
      thread.classList.add('thread-with-knot');
    }
    
    // 随机位置和大小
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = Math.random() * 200 + 80; // 80-280px
    const angle = Math.random() * 360;
    const delay = Math.random() * 5;
    const duration = Math.random() * 25 + 20; // 20-45s
    
    // 设置样式
    thread.style.left = `${x}px`;
    thread.style.top = `${y}px`;
    thread.style.width = `${length}px`;
    thread.style.transform = `rotate(${angle}deg)`;
    thread.style.animationDelay = `${delay}s`;
    thread.style.animationDuration = `${duration}s`;
    
    // 设置颜色（带随机透明度）
    const baseColor = isDarkMode.value ? 'rgba(255, 76, 76, ' : 'rgba(238, 40, 40, ';
    const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
    thread.style.borderColor = baseColor + opacity + ')';
    
    // 增加光晕效果
    thread.style.boxShadow = isDarkMode.value 
      ? `0 0 10px rgba(255, 76, 76, ${opacity * 0.6})` 
      : `0 0 8px rgba(238, 40, 40, ${opacity * 0.4})`;
    
    // 添加到容器
    threadContainer.value.appendChild(thread);
    
    // 保存引用
    threads.value.push({
      element: thread,
      speed: Math.random() * 0.5 + 0.1, // 每帧移动0.1-0.6px
      angle
    });
  }
};

// 创建铃铛装饰
const createBellDecorations = () => {
  bellDecorations.value = [];
  
  for (let i = 0; i < bellCount; i++) {
    bellDecorations.value.push({
      id: i,
      left: Math.random() * 95, // 0-95%
      top: Math.random() * 95, // 0-95%
      rotation: Math.random() * 30 - 15, // -15-15deg
      scale: 0.6 + Math.random() * 0.6, // 0.6-1.2
      opacity: 0.5 + Math.random() * 0.5, // 0.5-1.0
      delay: Math.random() * 5, // 0-5s
      size: 20 + Math.random() * 15, // 20-35px
      hue: Math.random() * 20 - 10, // -10-10deg
      brightness: isDarkMode.value ? 1.2 : 1,
      duration: 15 + Math.random() * 10, // 15-25s
      swayDuration: 5 + Math.random() * 5 // 5-10s
    });
  }
};

// 线条动画
const animateThreads = () => {
  threads.value.forEach(thread => {
    // 获取当前位置
    const currentTop = parseFloat(thread.element.style.top);
    const currentLeft = parseFloat(thread.element.style.left);
    
    // 计算新位置 - 让线条缓慢上升并有些微偏移
    const newTop = currentTop - thread.speed;
    const newLeft = currentLeft + Math.sin(currentTop * 0.01) * 0.5;
    
    // 如果线条移出视图，重新放置到底部
    if (newTop < -100) {
      const container = threadContainer.value;
      const width = container.offsetWidth;
      thread.element.style.top = `${container.offsetHeight + 50}px`;
      thread.element.style.left = `${Math.random() * width}px`;
      
      // 随机更新角度和透明度
      const newAngle = Math.random() * 360;
      thread.element.style.transform = `rotate(${newAngle}deg)`;
      thread.angle = newAngle;
      
      const baseColor = isDarkMode.value ? 'rgba(255, 76, 76, ' : 'rgba(238, 40, 40, ';
      const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
      thread.element.style.borderColor = baseColor + opacity + ')';
      
      // 更新光晕效果
      thread.element.style.boxShadow = isDarkMode.value 
        ? `0 0 10px rgba(255, 76, 76, ${opacity * 0.6})` 
        : `0 0 8px rgba(238, 40, 40, ${opacity * 0.4})`;
    } else {
      // 更新位置
      thread.element.style.top = `${newTop}px`;
      thread.element.style.left = `${newLeft}px`;
    }
    
    // 添加微小的角度变化
    const currentAngle = thread.angle;
    const angleChange = (Math.random() - 0.5) * 0.2;
    thread.angle = currentAngle + angleChange;
    thread.element.style.transform = `rotate(${thread.angle}deg)`;
  });
  
  // 继续动画循环
  animationFrameId = requestAnimationFrame(animateThreads);
};

// 处理窗口大小变化
const handleResize = () => {
  createThreads();
};

onMounted(() => {
  createThreads();
  createBellDecorations();
  animationFrameId = requestAnimationFrame(animateThreads);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
#red-thread-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.thread {
  position: absolute;
  height: 1px;
  border-top: 1px solid rgba(238, 40, 40, 0.4);
  transform-origin: center left;
  box-shadow: 0 0 5px rgba(238, 40, 40, 0.2);
  pointer-events: none;
  animation: float 30s linear infinite;
  will-change: transform, opacity;
}

/* 带节点的红线 */
.thread-with-knot::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(238, 40, 40, 0.8);
  border-radius: 50%;
  top: -3px;
  left: 30%;
  box-shadow: 0 0 8px rgba(238, 40, 40, 0.6);
}

.thread-with-knot::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(238, 40, 40, 0.7);
  border-radius: 50%;
  top: -2px;
  left: 70%;
  box-shadow: 0 0 6px rgba(238, 40, 40, 0.5);
}

/* 铃铛装饰 */

@keyframes float {
  0% {
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes bellFloat {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-50vh) rotate(15deg);
    opacity: 0;
  }
}

@keyframes bellSway {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(10px) rotate(5deg);
  }
  50% {
    transform: translateX(0) rotate(0deg);
  }
  75% {
    transform: translateX(-10px) rotate(-5deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

/* 暗色模式下调整颜色 */
:global(.dark-theme) .thread {
  border-top: 1px solid rgba(255, 76, 76, 0.4);
  box-shadow: 0 0 5px rgba(255, 76, 76, 0.3);
}

:global(.dark-theme) .thread-with-knot::before {
  background: rgba(255, 76, 76, 0.8);
  box-shadow: 0 0 8px rgba(255, 76, 76, 0.6);
}

:global(.dark-theme) .thread-with-knot::after {
  background: rgba(255, 76, 76, 0.7);
  box-shadow: 0 0 6px rgba(255, 76, 76, 0.5);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .thread {
    height: 0.5px;
    border-top-width: 0.5px;
  }
  
  .thread-with-knot::before {
    width: 4px;
    height: 4px;
    top: -2px;
  }
  
  .thread-with-knot::after {
    width: 3px;
    height: 3px;
    top: -1.5px;
  }
  
  .bell-decoration {
    transform: scale(0.7);
  }
}

/* 大屏幕优化 */
@media (min-width: 1440px) {
  .thread {
    border-top-width: 1.5px;
  }
  
  .thread-with-knot::before {
    width: 8px;
    height: 8px;
    top: -4px;
  }
}
</style> 