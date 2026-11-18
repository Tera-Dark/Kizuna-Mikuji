<template>
  <div class="zodiac-selector-side themed-section-box">
    <h4 class="selector-title"><span class="deco-icon"><AppIcon name="thread" :size="14" /></span> {{ title }} <span class="deco-icon"><AppIcon name="thread" :size="14" /></span></h4>
    <div class="zodiac-grid" :class="{ 'right-grid-styling': isRightSelector }">
      <button
        v-for="(data, signKey) in zodiacData"
        :key="`${identifier}-${signKey}`"
        class="zodiac-item"
        :class="{ active: selectedSign === signKey, 'right-item-styling': isRightSelector }"
        @click.stop="handleClick(signKey)"
        :data-sign="signKey"
      >
        <span class="zodiac-icon" :class="`el-${normalizeElement(zodiacData[signKey]?.element)}`">
          {{ getElementChar(zodiacData[signKey]?.element) }}
        </span>
        <span class="zodiac-name">{{ data.name }}</span>
        <span class="zodiac-dates">{{ data.dates }}</span>
        <div class="selection-indicator"></div>
      </button>
    </div>
    
    <div class="zodiac-detail themed-subsection" v-if="selectedSign && zodiacData[selectedSign]">
      <h5 class="detail-title">{{ zodiacData[selectedSign].name }}の缘</h5>
      <div class="zodiac-traits">
        <div class="trait-item">
          <span class="trait-label">元素：</span>
          <span class="trait-value">{{ getElementName(zodiacData[selectedSign].element) }}</span>
        </div>
        <div class="trait-item">
          <span class="trait-label">性格：</span>
          <span class="trait-value">{{ getZodiacPersonality(selectedSign) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import AppIcon from './icons/AppIcon.vue';

const props = defineProps({
  title: String,
  identifier: String, // 'first' or 'second'
  zodiacData: Object,
  selectedSign: String,
  isRightSelector: { // 用于特殊样式调整，如果需要的话
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selectedSign']);

const handleClick = (signKey) => {
  emit('update:selectedSign', signKey);
};

// Helper functions (can be imported from a shared util or defined here if not too large)
function normalizeElement(element) {
  const map = { fire: 'fire', earth: 'earth', air: 'air', water: 'water', 火: 'fire', 土: 'earth', 风: 'air', 水: 'water' };
  return map[element] || 'unknown';
}

// 用五行字替代星座符号，避免彩色 emoji 字形
function getElementChar(element) {
  const map = { fire: '火', earth: '土', air: '风', water: '水', 火: '火', 土: '土', 风: '风', 水: '水' };
  return map[element] || '星';
}

function getElementName(element) {
  const nameMap = {
    fire: '火象', earth: '土象', air: '风象', water: '水象',
    '火': '火象', '土': '土象', '风': '风象', '水': '水象'
  };
  return nameMap[element] || '未知';
}

function getZodiacPersonality(sign) {
  // This map can be quite large, consider moving to a data file or store if it grows further
  const personalityMap = {
    aries: '热情、勇敢、冲动',
    taurus: '稳健、务实、固执',
    gemini: '机智、多变、好奇',
    cancer: '敏感、顾家、情绪化',
    leo: '自信、慷慨、霸道',
    virgo: '细致、谦虚、挑剔',
    libra: '优雅、公正、犹豫',
    scorpio: '神秘、深刻、占有欲强',
    sagittarius: '乐观、自由、鲁莽',
    capricorn: '踏实、自律、保守',
    aquarius: '独立、创新、疏离',
    pisces: '浪漫、梦幻、同情心强'
  };
  return personalityMap[sign] || '待揭晓';
}
</script>

<style scoped>
.themed-section-box { /* For the main container of selector */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 14px;
  background-color: rgba(255, 252, 246, 0.7);
  border-radius: 3px;
  width: 100%;
  max-width: 340px;
  border: 1px solid var(--c-line);
  font-family: var(--font-body);
}

.selector-title {
  color: var(--c-ink);
  margin-bottom: 16px;
  font-size: 1.12em;
  font-weight: 600;
  letter-spacing: 0.1em;
  font-family: var(--font-display);
  display: flex;
  align-items: center;
  gap: 8px;
}

.deco-icon {
  color: var(--c-shu-soft);
  font-size: 0.8em;
  opacity: 0.9;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  margin-bottom: 14px;
}

.zodiac-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 4px 9px;
  border: 1px solid var(--c-line);
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  background-color: #FFFCF6;
  text-align: center;
  min-height: 96px;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.zodiac-item:hover {
  border-color: var(--c-shu-soft);
  background-color: #FFF9F1;
}

.zodiac-item.active {
  background-color: var(--c-shu-wash);
  border-color: var(--c-shu);
  color: var(--c-shu-deep);
}

/* Selection Indicator - a small knot or seal */
.selection-indicator {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background-color: var(--c-shu);
  border-radius: 1px;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.zodiac-item.active .selection-indicator {
  opacity: 1;
  transform: scale(1);
}
/* Optional: Style it like a small knot */
/* .zodiac-item.active .selection-indicator::before, 
.zodiac-item.active .selection-indicator::after {
  content: ''; position: absolute; background: #fff; 
  width: 2px; height: 6px; border-radius: 1px; 
  top: 3px; left: 5px;
}
.zodiac-item.active .selection-indicator::after { transform: rotate(90deg); } */


.zodiac-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-bottom: 5px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 0.78em;
  line-height: 1;
  color: var(--c-ink-faint);
  transition: color 0.2s ease;
}

.zodiac-icon.el-fire { color: #BC3B2A; }
.zodiac-icon.el-earth { color: #A97C34; }
.zodiac-icon.el-air { color: #6E7F6A; }
.zodiac-icon.el-water { color: #4E6B7A; }

.zodiac-item.active .zodiac-icon {
  color: var(--c-shu);
}

.zodiac-name {
  font-size: 0.88em;
  font-weight: 600;
  color: var(--c-ink);
  margin-bottom: 2px;
  letter-spacing: 0.04em;
}

.zodiac-item.active .zodiac-name {
  color: var(--c-shu-deep);
}

.zodiac-dates {
  font-size: 0.68em;
  color: var(--c-ink-faint);
  font-variant-numeric: tabular-nums;
}

.zodiac-item.active .zodiac-dates {
  color: var(--c-ink-soft);
}

/* Selected zodiac detail area */
.themed-subsection { /* For the detail display */
  margin-top: 12px;
  padding: 12px 14px;
  background-color: rgba(255, 254, 250, 0.65);
  border-radius: 2px;
  width: 100%;
  border: 1px solid var(--c-line);
}

.detail-title {
  color: var(--c-ink);
  margin-bottom: 10px;
  font-size: 1em;
  text-align: center;
  letter-spacing: 0.1em;
  font-family: var(--font-display);
  font-weight: 600;
}

.zodiac-traits {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trait-item {
  font-size: 0.85em;
  display: flex;
}

.trait-label {
  font-weight: 600;
  color: var(--c-shu);
  margin-right: 6px;
  flex-shrink: 0;
}

.trait-value {
  color: var(--c-ink-soft);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .themed-section-box {
    max-width: 100%; 
    padding: 15px 10px;
  }
  .selector-title {
    font-size: 1.3em;
  }
  .zodiac-grid {
     gap: 8px;
  }
   .zodiac-item {
    min-height: 95px;
    padding: 8px 4px;
    border-radius: 10px;
  }
  .zodiac-icon {
    width: 24px;
    height: 24px;
  }
  .zodiac-name {
    font-size: 0.85em;
  }
  .zodiac-dates {
    font-size: 0.65em;
  }
  .selection-indicator {
    width: 10px;
    height: 10px;
    top: 3px;
    right: 3px;
  }
  .detail-title {
    font-size: 1.1em;
  }
  .trait-item {
    font-size: 0.8em;
  }
}

@media (max-width: 400px) {
    .zodiac-grid {
        grid-template-columns: repeat(2, 1fr); /* 在非常小的屏幕上变为两列 */
        gap: 8px;
    }
    .zodiac-selector-side h4 {
        font-size: 1.3em;
    }
}

</style> 