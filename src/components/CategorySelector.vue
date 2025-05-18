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
          <div class="daily-fortune-icon">🧧</div>
          <div class="daily-fortune-content">
            <div class="daily-fortune-name">每日一签</div>
            <div class="daily-fortune-desc">今日运势与贵人指引</div>
          </div>
          <div class="recommended-badge">今日推荐</div>
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
          <div class="category-icon">{{ category.themedIcon || category.icon }}</div>
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
    icon: '🎯', themedIcon: '🧧',
    description: '今日运势与贵人指引'
  },
  { 
    id: 'love',
    value: '爱情缘分', 
    icon: '❤️', themedIcon: '💕',
    description: '洞悉你的爱情状态与未来发展'
  },
  { 
    id: 'past_life',
    value: '前世姻缘', 
    icon: '🔮', themedIcon: '⏳',
    description: '探寻你与TA的前世情缘'
  },
  { 
    id: 'career',
    value: '事业运势', 
    icon: '💼', themedIcon: '📈',
    description: '预测你的职场发展与财富机遇'
  },
  { 
    id: 'relationship',
    value: '人际关系', 
    icon: '👥', themedIcon: '🤝',
    description: '分析你的社交圈与人际状况'
  },
  { 
    id: 'health',
    value: '健康平安', 
    icon: '🍀', themedIcon: '🌿',
    description: '关注你的身心健康与平安指数'
  },
  { 
    id: 'name',
    value: '姓名解析', 
    icon: '📝', themedIcon: '📜',
    description: '解读你的名字中隐藏的天机'
  },
  { 
    id: 'zodiac',
    value: '星座配对', 
    icon: '⭐', themedIcon: '✨',
    description: '看看你们的星座是否相配'
  },
  { 
    id: 'couple',
    value: '姻缘配对', 
    icon: '💕', themedIcon: '💞',
    description: '测试你与TA的契合度与缘分指数'
  },
  {
    id: 'destiny_ball',
    value: '结缘御守',
    icon: '🔮', themedIcon: '🧧',
    description: '轻点御守，探寻玄妙指引'
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
  max-width: 700px;
  margin: 0 auto 25px;
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(255, 245, 245, 0.9);
  box-shadow: 0 8px 25px rgba(217, 84, 77, 0.15), 0 0 0 1.5px rgba(229, 109, 97, 0.35);
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.category-selector::before {
  content: "";
  position: absolute;
  top: 0;
  left: 15%; right: 15%;
  height: 2.5px;
  background: linear-gradient(90deg, transparent, #E56D61, #D9544D, #E56D61, transparent);
  border-radius: 2px;
}

.category-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #B8433E;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.5px;
}

.title-decoration {
  width: 50px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(217, 84, 77, 0.6), transparent);
  margin: 0 12px;
  position: relative;
}

.title-decoration::before, 
.title-decoration::after {
  content: "\2766";
  position: absolute;
  width: auto;
  height: auto;
  background-color: transparent;
  color: #D9544D;
  font-size: 12px;
  border-radius: 0;
  top: 50%;
  transform: translateY(-50%);
}

.title-decoration.left::before { left: -5px; }
.title-decoration.left::after { display: none; }
.title-decoration.right::after { right: -5px; }
.title-decoration.right::before { display: none; }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 18px;
}

.daily-fortune-item, 
.category-item {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: rgba(255, 250, 250, 0.8);
  border: 1.5px solid rgba(229, 109, 97, 0.35);
  box-shadow: 0 3px 8px rgba(217, 84, 77, 0.08);
}

.daily-fortune-item:hover, 
.category-item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 6px 15px rgba(217, 84, 77, 0.18);
  border-color: rgba(217, 84, 77, 0.6);
}

.daily-fortune-item.active, 
.category-item.active {
  border-color: #D9544D;
  background-color: rgba(255, 240, 240, 0.95);
  box-shadow: 0 4px 12px rgba(217, 84, 77, 0.25), inset 0 0 10px rgba(229, 109, 97, 0.1);
}

/* 每日一签特殊样式 */
.daily-fortune-item {
  grid-column: 1 / -1;
  margin-bottom: 8px;
}

.daily-fortune-inner, 
.category-inner {
  display: flex;
  align-items: center;
  padding: 15px;
  position: relative;
  z-index: 1;
}

.daily-fortune-item .daily-fortune-inner::after, 
.category-item .category-inner::after {
  display: none;
}

.daily-fortune-icon, 
.category-icon {
  font-size: 1.8rem;
  margin-right: 12px;
  color: #D9544D;
  width: 30px;
  text-align: center;
}

.daily-fortune-content, 
.category-content {
  flex-grow: 1;
}

.daily-fortune-name, 
.category-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #B8433E;
  margin-bottom: 3px;
  font-family: var(--font-family-serif);
}

.daily-fortune-desc, 
.category-desc {
  font-size: 0.8rem;
  color: #C74840;
  opacity: 0.9;
  line-height: 1.3;
}

.recommended-badge {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #E56D61;
  color: white;
  padding: 4px 10px;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 0 11px 0 8px;
  box-shadow: -1px 1px 3px rgba(0,0,0,0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  .category-selector {
    padding: 15px;
  }
  .category-title {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
  .daily-fortune-icon, .category-icon {
    font-size: 1.6rem;
    margin-right: 10px;
  }
  .daily-fortune-name, .category-name {
    font-size: 0.95rem;
  }
  .daily-fortune-desc, .category-desc {
    font-size: 0.75rem;
  }
  .recommended-badge {
    padding: 3px 8px;
    font-size: 0.65rem;
  }
}

@media (max-width: 400px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .daily-fortune-inner, .category-inner {
    padding: 12px;
  }
  .title-decoration {
    display: none;
  }
}
</style> 