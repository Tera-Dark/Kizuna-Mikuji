<template>
  <div class="category-selector">
    <div class="category-title">
      <span class="title-decoration left"></span>
      请选择签文类型
      <span class="title-decoration right"></span>
    </div>
    
    <div class="categories-grid">
      <!-- 每日一签特殊处理，放在第一位且样式特殊 -->
      <div 
        class="daily-fortune-item"
        :class="{ 'active': selectedCategory === '每日一签' }"
        @click="selectCategory('每日一签')"
      >
        <div class="daily-fortune-inner">
          <div class="daily-fortune-icon">🎯</div>
          <div class="daily-fortune-content">
            <div class="daily-fortune-name">每日一签</div>
            <div class="daily-fortune-desc">今日运势与贵人指引</div>
          </div>
          <div class="recommended-badge">推荐</div>
        </div>
      </div>
      
      <!-- 其他签文类型 -->
      <div 
        v-for="category in filteredCategories" 
        :key="category.value"
        class="category-item"
        :class="{ 'active': selectedCategory === category.value }"
        @click="selectCategory(category.value)"
      >
        <div class="category-inner">
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-content">
            <div class="category-name">{{ category.value }}</div>
            <div class="category-desc">{{ category.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';

const props = defineProps({
  selectedCategory: {
    type: String,
    default: '每日一签' // 修改默认值为每日一签
  }
});

const emit = defineEmits(['category-change']);

const fortuneStore = useFortuneStore();

// 分类列表，包含图标和描述信息
const categories = [
  { 
    id: 'daily',
    value: '每日一签', 
    icon: '🎯',
    description: '今日运势与贵人指引'
  },
  { 
    id: 'love',
    value: '爱情缘分', 
    icon: '❤️',
    description: '洞悉你的爱情状态与未来发展'
  },
  { 
    id: 'past_life',
    value: '前世姻缘', 
    icon: '🔮',
    description: '探寻你与TA的前世情缘'
  },
  { 
    id: 'career',
    value: '事业运势', 
    icon: '💼',
    description: '预测你的职场发展与财富机遇'
  },
  { 
    id: 'relationship',
    value: '人际关系', 
    icon: '👥',
    description: '分析你的社交圈与人际状况'
  },
  { 
    id: 'health',
    value: '健康平安', 
    icon: '🍀',
    description: '关注你的身心健康与平安指数'
  },
  { 
    id: 'name',
    value: '姓名解析', 
    icon: '📝',
    description: '解读你的名字中隐藏的天机'
  },
  { 
    id: 'zodiac',
    value: '星座配对', 
    icon: '⭐',
    description: '看看你们的星座是否相配'
  },
  { 
    id: 'couple',
    value: '姻缘配对', 
    icon: '💕',
    description: '测试你与TA的契合度与缘分指数'
  },
  { 
    id: 'destiny_ball',
    value: '缘分球', 
    icon: '🔮',
    description: '摇一摇，获取爱情即时提示'
  }
];

// 过滤掉"每日一签"，因为它会单独显示
const filteredCategories = computed(() => {
  return categories.filter(category => category.value !== '每日一签');
});

// 选择分类
const selectCategory = (category) => {
  const selectedCat = categories.find(cat => cat.value === category);
  if (selectedCat) {
    fortuneStore.setCategory(selectedCat.id);
    emit('category-change', category);
  }
};

// 纹理背景的fallback数据URI
const wavePattern = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='80' viewBox='0 0 100 80'%3E%3Cpath d='M0,10 C30,30 70,0 100,20 L100,80 L0,80 Z' fill='%23f5f0e6'/%3E%3Cpath d='M0,30 C30,50 70,20 100,40 L100,80 L0,80 Z' fill='%23f0e8d8' opacity='0.7'/%3E%3Cpath d='M0,50 C30,70 70,40 100,60 L100,80 L0,80 Z' fill='%23ebe1cc' opacity='0.5'/%3E%3C/svg%3E";

const paperTexture = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E";
</script>

<style scoped>
.category-selector {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px;
  padding: 18px 15px;
  border-radius: 12px;
  background-color: rgba(252, 248, 240, 0.85);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(139, 69, 19, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(139, 69, 19, 0.15);
}

.category-selector::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #BB2D2C, #F06A6A, #BB2D2C);
}

.category-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: normal;
  margin-bottom: 20px;
  color: #A22828;
  font-family: 'STKaiti', 'KaiTi', serif;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
}

.title-decoration {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #A22828, transparent);
  margin: 0 15px;
  position: relative;
}

.title-decoration::before, 
.title-decoration::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(162, 40, 40, 0.2);
  border-radius: 50%;
  top: -3.5px;
}

.title-decoration.left::after {
  right: 0;
}

.title-decoration.right::before {
  left: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

/* 每日一签特殊样式 */
.daily-fortune-item {
  grid-column: 1 / -1; /* 跨越所有列 */
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(139, 69, 19, 0.15);
  margin-bottom: 5px;
}

.daily-fortune-inner {
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
  background-image: v-bind(wavePattern);
  background-size: cover;
  background-position: center;
  border-radius: 9px;
}

.daily-fortune-inner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(255, 240, 245, 0), rgba(253, 246, 230, 0.8) 70%);
  z-index: 0;
}

.daily-fortune-icon {
  font-size: 2.6rem;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  position: relative;
  z-index: 1;
  background: rgba(255, 250, 245, 0.7);
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.daily-fortune-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.daily-fortune-name {
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 5px;
  color: #A22828;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.daily-fortune-desc {
  font-size: 0.95rem;
  color: #5D4037;
  line-height: 1.4;
  font-family: 'STFangsong', 'FangSong', serif;
}

.recommended-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FF7043;
  color: white;
  padding: 3px 10px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 2;
  transform: rotate(5deg);
}

.daily-fortune-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(139, 69, 19, 0.15);
}

.daily-fortune-item:active {
  transform: translateY(0);
}

.daily-fortune-item.active {
  background-color: rgba(255, 250, 240, 0.9);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.15), 0 0 0 2px #A22828;
}

.daily-fortune-item.active .daily-fortune-inner {
  background-color: rgba(255, 250, 240, 0.8);
}

/* 常规分类项 */
.category-item {
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(139, 69, 19, 0.1);
  overflow: hidden;
  position: relative;
}

.category-inner {
  display: flex;
  align-items: center;
  padding: 12px;
  position: relative;
  z-index: 1;
  height: 100%;
}

.category-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: v-bind(paperTexture);
  background-size: cover;
  opacity: 0.5;
  z-index: 0;
  transition: opacity 0.3s ease;
}

.category-item:hover::before {
  opacity: 0.7;
}

.category-icon {
  font-size: 1.8rem;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.category-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.category-name {
  font-weight: bold;
  margin-bottom: 4px;
  color: #5D4037;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.category-desc {
  font-size: 0.85rem;
  color: #6D4C41;
  line-height: 1.3;
  font-family: 'STFangsong', 'FangSong', serif;
}

.category-item:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 15px rgba(139, 69, 19, 0.1);
  z-index: 2;
}

.category-item:active {
  transform: translateY(0) scale(0.98);
}

.category-item.active {
  background-color: rgba(255, 250, 240, 0.9);
  border: 1px solid rgba(162, 40, 40, 0.2);
  box-shadow: 0 3px 10px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(162, 40, 40, 0.3);
}

.category-item.active .category-name {
  color: #A22828;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }
  
  .category-selector {
    padding: 15px 12px;
  }
  
  .daily-fortune-inner {
    padding: 12px;
  }
  
  .daily-fortune-icon {
    font-size: 2.2rem;
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }
  
  .daily-fortune-name {
    font-size: 1.2rem;
  }
  
  .daily-fortune-desc {
    font-size: 0.85rem;
  }
  
  .category-inner {
    padding: 10px;
  }
  
  .category-icon {
    font-size: 1.5rem;
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  
  .category-name {
    font-size: 0.9rem;
  }
  
  .category-desc {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .category-title {
    font-size: 1.2rem;
  }
  
  .daily-fortune-inner {
    flex-direction: column;
    text-align: center;
    padding: 15px 10px;
  }
  
  .daily-fortune-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .recommended-badge {
    top: 5px;
    right: 5px;
    font-size: 0.7rem;
    padding: 2px 8px;
  }
}
</style> 