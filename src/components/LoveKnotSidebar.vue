<template>
  <div class="love-knot-sidebar" :class="{ 'sidebar-open': isOpen }">
    <div class="sidebar-toggle" @click="toggleSidebar">
      <div class="toggle-icon" :class="{ 'open': isOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    
    <div class="sidebar-content">
      <h3>姻缘结</h3>
      
      <div class="knot-container">
        <div 
          v-for="(knot, index) in knots" 
          :key="index"
          class="love-knot"
          :class="{ 'active': knot.active }"
          @click="toggleKnot(index)"
        >
          <div class="knot-shape">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path d="M30,5 C40,5 45,15 45,20 C45,25 40,30 30,30 C20,30 15,25 15,20 C15,15 20,5 30,5 Z" 
                    :fill="knot.color" />
              <path d="M30,55 C40,55 45,45 45,40 C45,35 40,30 30,30 C20,30 15,35 15,40 C15,45 20,55 30,55 Z" 
                    :fill="knot.color" />
              <path d="M5,30 C5,20 15,15 20,15 C25,15 30,20 30,30 C30,40 25,45 20,45 C15,45 5,40 5,30 Z" 
                    :fill="knot.color" />
              <path d="M55,30 C55,20 45,15 40,15 C35,15 30,20 30,30 C30,40 35,45 40,45 C45,45 55,40 55,30 Z" 
                    :fill="knot.color" />
              <circle cx="30" cy="30" r="5" fill="#FFF" />
            </svg>
            <div class="red-thread" v-if="knot.active"></div>
          </div>
          <div class="knot-label">{{ knot.name }}</div>
          <div class="knot-description" v-if="knot.active">
            {{ knot.description }}
          </div>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <p class="footer-note">系结姻缘，月老赐福</p>
        <div class="footer-decoration"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 侧边栏状态
const isOpen = ref(false);

// 姻缘结集合
const knots = ref([
  {
    name: '同心结',
    description: '两心相连，白首同心。',
    color: '#e74c3c',
    active: false
  },
  {
    name: '连理结',
    description: '如树连理，生死相依。',
    color: '#e67e22',
    active: false
  },
  {
    name: '吉祥结',
    description: '平安喜乐，美满幸福。',
    color: '#f1c40f',
    active: false
  },
  {
    name: '如意结',
    description: '万事如意，情意绵绵。',
    color: '#27ae60',
    active: false
  },
  {
    name: '团圆结',
    description: '佳偶天成，终成眷属。',
    color: '#3498db',
    active: false
  }
]);

// 切换侧边栏状态
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

// 切换姻缘结状态
const toggleKnot = (index) => {
  if (knots.value[index]) {
    knots.value[index].active = !knots.value[index].active;
    
    // 如果激活了，触发一个动画效果
    if (knots.value[index].active) {
      animateKnotActivation();
    }
  }
};

// 姻缘结激活动画
const animateKnotActivation = () => {
  // 这里可以添加一些额外的视觉效果
  // 比如樱花动画，红线动画等
  const event = new CustomEvent('knotActivated');
  document.dispatchEvent(event);
};

// 获取激活状态的姻缘结数量
const activeKnotsCount = computed(() => {
  return knots.value.filter(knot => knot.active).length;
});

// 暴露给父组件的属性和方法
defineExpose({
  isOpen,
  activeKnotsCount,
  toggleSidebar
});
</script>

<style scoped>
.love-knot-sidebar {
  position: fixed;
  top: 0;
  right: -280px;
  width: 280px;
  height: 100vh;
  background: rgba(255, 245, 238, 0.95);
  box-shadow: -3px 0 15px rgba(0, 0, 0, 0.2);
  transition: right 0.5s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-left: 2px solid #d4af37;
}

.sidebar-open {
  right: 0;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  left: -50px;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 245, 238, 0.9);
  border-radius: 8px 0 0 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #d4af37;
  border-right: none;
}

.toggle-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  position: relative;
}

.toggle-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background: #e74c3c;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.toggle-icon.open span:first-child {
  transform: translateY(8px) rotate(45deg);
}

.toggle-icon.open span:nth-child(2) {
  opacity: 0;
}

.toggle-icon.open span:last-child {
  transform: translateY(-8px) rotate(-45deg);
}

.sidebar-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

h3 {
  text-align: center;
  color: #e74c3c;
  margin-bottom: 20px;
  font-size: 1.8em;
  font-weight: normal;
  border-bottom: 1px solid #f0d48a;
  padding-bottom: 10px;
}

.knot-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.love-knot {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 10px;
}

.love-knot:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.love-knot.active {
  background-color: rgba(231, 76, 60, 0.2);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.knot-shape {
  position: relative;
  margin-bottom: 5px;
  transition: transform 0.5s ease;
}

.love-knot:hover .knot-shape {
  transform: scale(1.1);
}

.love-knot.active .knot-shape {
  animation: pulse 2s infinite;
}

.red-thread {
  position: absolute;
  top: 50%;
  left: -20px;
  right: -20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e74c3c, transparent);
  opacity: 0;
  animation: fade-in 1s forwards, float 3s ease-in-out infinite;
}

.knot-label {
  font-size: 1.1em;
  color: #333;
  margin-top: 5px;
  font-weight: bold;
}

.knot-description {
  font-size: 0.9em;
  color: #666;
  text-align: center;
  margin-top: 5px;
  animation: fade-in 1s;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  text-align: center;
}

.footer-note {
  font-size: 0.9em;
  color: #888;
  font-style: italic;
}

.footer-decoration {
  width: 100%;
  height: 30px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0,5 C20,15 40,-5 60,5 C80,15 100,-5 100,5' stroke='%23e74c3c' fill='none' stroke-width='0.5'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  margin-top: 10px;
  opacity: 0.6;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .love-knot-sidebar {
    width: 240px;
    right: -240px;
  }

  .sidebar-toggle {
    left: -40px;
    width: 40px;
    height: 40px;
  }
  
  h3 {
    font-size: 1.5em;
  }
  
  .knot-label {
    font-size: 1em;
  }
  
  .knot-description {
    font-size: 0.8em;
  }
}
</style> 