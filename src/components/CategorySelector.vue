<template>
  <section class="category-selector" data-tour="categories">
    <header class="category-head">
      <h2 class="category-title">{{ voice.category.title }}</h2>
      <p class="category-hint">{{ voice.category.hint }}</p>
    </header>

    <div class="categories-grid">
      <!-- 每日一签：横向的一张，压在其它御札上面 -->
      <button
        type="button"
        class="category-item daily-item"
        :class="{ active: selectedCategory === '每日一签' }"
        :aria-pressed="selectedCategory === '每日一签'"
        @click="selectCategory('每日一签')"
      >
        <span class="daily-icon"><AppIcon name="sun" :size="22" /></span>
        <span class="daily-content">
          <span class="cat-name">每日一签</span>
          <span class="cat-desc">{{ voice.category.items.daily }}</span>
        </span>
        <span class="daily-seal" aria-hidden="true">本日</span>
      </button>

      <button
        v-for="category in filteredCategories"
        :key="category.value"
        type="button"
        class="category-item"
        :class="{ active: selectedCategory === category.value }"
        :aria-pressed="selectedCategory === category.value"
        @click="selectCategory(category.value)"
      >
        <span class="cat-top">
          <AppIcon :name="category.icon" :size="19" :weight="1.5" />
        </span>
        <span class="cat-name">{{ category.value }}</span>
        <span class="cat-desc">{{ category.description }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';
import { voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

const props = defineProps({
  selectedCategory: {
    type: String,
    default: '每日一签'
  }
});

const emit = defineEmits(['category-change']);

const fortuneStore = useFortuneStore();

// 分类列表：图标名对应 AppIcon 的注册表
const categories = [
  { id: 'daily', value: '每日一签', icon: 'sun', description: voice.category.items.daily },
  { id: 'love', value: '爱情缘分', icon: 'heart', description: voice.category.items.love },
  { id: 'past_life', value: '前世姻缘', icon: 'hourglass', description: voice.category.items.past_life },
  { id: 'career', value: '事业运势', icon: 'briefcase', description: voice.category.items.career },
  { id: 'relationship', value: '人际关系', icon: 'branches', description: voice.category.items.relationship },
  { id: 'health', value: '健康平安', icon: 'leaf', description: voice.category.items.health },
  { id: 'name', value: '姓名解析', icon: 'brush', description: voice.category.items.name },
  { id: 'zodiac', value: '星座配对', icon: 'star', description: voice.category.items.zodiac },
  { id: 'couple', value: '姻缘配对', icon: 'rings', description: voice.category.items.couple },
  { id: 'destiny_ball', value: '结缘御守', icon: 'omamori', description: voice.category.items.destiny_ball }
];

const filteredCategories = computed(() =>
  categories.filter(category => category.value !== '每日一签')
);

const selectCategory = (category) => {
  const selectedCat = categories.find(cat => cat.value === category);
  if (selectedCat) {
    fortuneStore.setCategory(selectedCat.id);
    emit('category-change', category);
  }
};
</script>

<style scoped>
.category-selector {
  width: 100%;
  padding: 2px 0 4px;
}

.category-head {
  text-align: center;
  margin-bottom: 18px;
}

.category-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.34rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-indent: 0.14em;
  color: var(--c-ink);
}

.category-title::after {
  content: '';
  display: block;
  width: 42px;
  height: 1px;
  margin: 9px auto 0;
  background: linear-gradient(90deg, transparent, var(--c-shu), transparent);
}

.category-hint {
  margin: 8px 0 0;
  font-family: var(--font-ui);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--c-ink-faint);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

/* 御札 */
.category-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 13px 12px 12px;
  font: inherit;
  text-align: left;
  color: var(--c-ink);
  cursor: pointer;
  background: linear-gradient(180deg, #FFFCF6, #FAF2E5);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-slip);
  box-shadow: var(--shadow-slip);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.category-item:hover {
  transform: translateY(-2px);
  border-color: var(--c-line-strong);
  box-shadow: 0 6px 16px rgba(92, 44, 32, 0.12);
}

.category-item:focus-visible {
  outline: 2px solid var(--c-shu);
  outline-offset: 2px;
}

.category-item.active {
  border-color: var(--c-shu);
  background: linear-gradient(180deg, #FFF7F2, #FCEBE4);
  box-shadow: 0 0 0 1px var(--c-shu) inset, 0 6px 16px rgba(143, 39, 28, 0.13);
}

.cat-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
  border-radius: 50%;
  color: var(--c-shu);
  background: rgba(188, 59, 42, 0.06);
  border: 1px solid rgba(188, 59, 42, 0.16);
}

.category-item.active .cat-top {
  background: var(--c-shu);
  color: #FFF6F0;
  border-color: var(--c-shu-deep);
}

.cat-name {
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--c-ink);
}

.cat-desc {
  font-family: var(--font-ui);
  font-size: 0.68rem;
  line-height: 1.55;
  color: var(--c-ink-soft);
  opacity: 0.86;
}

/* 每日一签 */
.daily-item {
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background:
    linear-gradient(90deg, rgba(188, 59, 42, 0.07), transparent 42%),
    linear-gradient(180deg, #FFFCF6, #FAF2E5);
}

.daily-item::before {
  top: 0;
  bottom: 0;
  right: auto;
  width: 3px;
  height: auto;
  background: var(--c-shu);
  border-radius: var(--radius-slip) 0 0 var(--radius-slip);
}

.daily-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 50%;
  color: var(--c-shu);
  border: 1px solid rgba(188, 59, 42, 0.25);
}

.daily-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.daily-seal {
  position: absolute;
  top: 8px;
  right: 9px;
  padding: 2px 5px;
  font-family: var(--font-display);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: var(--c-shu);
  border: 1px solid rgba(188, 59, 42, 0.45);
  border-radius: 2px;
  transform: rotate(6deg);
}

@media (max-width: 600px) {
  .categories-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .category-title { font-size: 1.16rem; }
  .category-item { padding: 11px 10px 10px; }
  .cat-name { font-size: 0.86rem; }
  .cat-desc { font-size: 0.66rem; }
  .daily-item { padding: 12px 13px; }
}

@media (max-width: 380px) {
  .categories-grid { grid-template-columns: 1fr; }
  .cat-top { display: none; }
  .cat-desc { font-size: 0.68rem; }
}
</style>
