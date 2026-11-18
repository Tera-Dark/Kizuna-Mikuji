<template>
  <div class="zodiac-explanation themed-section-box reveal-item">
    <h4 class="section-title"><span class="title-deco left">—</span> 星座元素相性 <span class="title-deco right">—</span></h4>
    <div class="elements-grid">
      <div class="element-item themed-subsection" v-for="(desc, elementKey) in elementDescriptions" :key="elementKey">
        <div class="element-icon" :class="getElementClass(elementKey)"><AppIcon :name="getElementIcon(elementKey)" :size="20" /></div>
        <div class="element-name">{{ getElementName(elementKey) }}</div>
        <div class="element-desc">{{ desc }}</div>
      </div>
    </div>
    <p>
      星座配对基于传统星相学的元素相性理论。火象星座充满激情活力；土象星座踏实稳重；风象星座思维活跃；水象星座情感丰富。
    </p>
    <p>
      不同元素之间的组合会产生不同的互动效果，有的相辅相成，有的相互消耗。选择你和TA的星座，看看你们的星座缘分如何。
    </p>
  </div>
</template>

<script setup>
import AppIcon from './icons/AppIcon.vue';

// 元素描述
const elementDescriptions = {
  fire: '热情如火，充满活力与创造的能量，勇于开拓，直率明朗。',
  earth: '稳重如山，代表务实与坚韧的品质，忠诚可靠，耐心持重。',
  air: '灵动如风，象征思想与沟通的智慧，聪颖善变，热爱社交。',
  water: '柔情似水，蕴含情感与直觉的深度，富有同情，体贴入微。'
};

// 获取元素对应的图标名
function getElementIcon(element) {
  const iconMap = {
    fire: 'flame',
    earth: 'leaf',
    air: 'wind',
    water: 'water',
    // Adding Chinese keys as well, in case they are used directly
    火: 'flame',
    土: 'leaf',
    风: 'wind',
    水: 'water'
  };
  return iconMap[element] || iconMap[element.toLowerCase()] || 'sparkles';
}

// 获取元素的中文名称
function getElementName(element) {
  const nameMap = {
    fire: '火象星座',
    earth: '土象星座',
    air: '风象星座',
    water: '水象星座',
    // Adding Chinese keys as well
    火: '火象星座',
    土: '土象星座',
    风: '风象星座',
    水: '水象星座'
  };
  return nameMap[element.toLowerCase()] || '未知元素'; // ensure lowercase for matching
}

// Function to get a theme-consistent class for element icons
function getElementClass(elementKey) {
  return `element-${elementKey.toLowerCase()}`;
}
</script>

<style scoped>
.themed-section-box {
  margin-top: 22px;
  padding: 22px 24px;
  background-color: rgba(255, 252, 246, 0.6);
  border-radius: 3px;
  border: 1px solid var(--c-line);
  width: 100%;
  max-width: 780px;
  animation: fadeInLoad 0.7s ease-out;
  text-align: center; /* Center align content within this box */
}

@keyframes fadeInLoad {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  text-align: center;
  color: var(--c-ink);
  font-size: 1.18em;
  margin-bottom: 20px;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.16em;
  display: inline-flex; /* To keep decorators on the same line with text */
  align-items: center;
  gap: 10px;
}

.title-deco {
  font-size: 0.85em;
  color: var(--c-shu-soft);
  opacity: 0.9;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}

.themed-subsection { /* Applied to each element-item */
  background-color: rgba(255, 254, 250, 0.55);
  padding: 18px 14px;
  border-radius: 3px;
  border: 1px solid var(--c-line);
  transition: border-color 0.2s ease;
  text-align: center;
}

.element-item:hover {
  border-color: var(--c-line-strong);
}

.element-icon {
  font-size: 2.8em;
  margin-bottom: 12px;
  line-height: 1;
  display: inline-block; /* Ensure it behaves well */
}

/* Themed Element Icon Colors */
.element-icon.element-fire { color: #BC3B2A; }
.element-icon.element-earth { color: #A97C34; }
.element-icon.element-air { color: #6E7F6A; }
.element-icon.element-water { color: #4E6B7A; }

.element-name {
  font-size: 1em;
  font-weight: 600;
  color: var(--c-ink);
  margin-bottom: 8px;
  letter-spacing: 0.08em;
  font-family: var(--font-display);
}

.element-desc {
  font-size: 0.88em;
  color: var(--c-ink-soft);
  line-height: 1.75;
  min-height: 60px; /* Give some consistent height */
}

.zodiac-explanation p {
  font-size: 0.92em;
  color: var(--c-ink-soft);
  line-height: 1.85;
  margin-bottom: 15px;
  text-align: justify;
  padding: 0 15px;
  max-width: 680px; /* Constrain paragraph width */
  margin-left: auto;
  margin-right: auto;
}

.zodiac-explanation p:last-child {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .themed-section-box {
    padding: 20px 15px;
  }
  .section-title {
    font-size: 1.5em;
  }
  .elements-grid {
    gap: 10px;
  }
  .themed-subsection {
    padding: 15px 10px;
  }
  .element-icon {
    font-size: 2.5em;
  }
  .element-name {
    font-size: 1.15em;
  }
  .element-desc {
    font-size: 0.85em;
    min-height: 50px;
  }
  .zodiac-explanation p {
    font-size: 0.9em;
    padding: 0 5px;
  }
}

@media (max-width: 480px) {
  .elements-grid {
    grid-template-columns: 1fr;
  }
}
</style> 