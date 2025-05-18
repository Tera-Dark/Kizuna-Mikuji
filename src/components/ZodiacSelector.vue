<template>
  <div class="zodiac-selector-side themed-section-box">
    <h4 class="selector-title"><span class="deco-icon">✧</span> {{ title }} <span class="deco-icon">✧</span></h4>
    <div class="zodiac-grid" :class="{ 'right-grid-styling': isRightSelector }">
      <button
        v-for="(data, signKey) in zodiacData"
        :key="`${identifier}-${signKey}`"
        class="zodiac-item"
        :class="{ active: selectedSign === signKey, 'right-item-styling': isRightSelector }"
        @click.stop="handleClick(signKey)"
        :data-sign="signKey"
      >
        <span class="zodiac-icon">{{ getZodiacEmoji(signKey) }}</span>
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
function getZodiacEmoji(sign) {
  const emojiMap = {
    aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
    leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
    sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
  };
  return emojiMap[sign] || '⭐';
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
  padding: 20px 15px;
  background-color: rgba(255, 250, 248, 0.85); /* Light washi paper feel */
  border-radius: 18px; 
  box-shadow: 0 6px 20px rgba(217, 84, 77, 0.1), 0 0 0 1.5px rgba(229, 109, 97, 0.25);
  width: 100%; 
  max-width: 340px; 
  border: 1px solid transparent; /* For box-shadow border */
  font-family: var(--font-family-sans-serif);
}

.selector-title { 
  color: #B8433E; /* Main theme red */
  margin-bottom: 20px;
  font-size: 1.4em;
  font-weight: 600;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 8px;
}

.deco-icon {
  color: #E56D61; /* Theme accent */
  font-size: 0.8em;
  opacity: 0.9;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px; 
  width: 100%;
  margin-bottom: 15px;
}

.zodiac-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 5px; 
  border: 1.5px solid rgba(229, 109, 97, 0.25); /* Subtle theme border */
  border-radius: 12px; 
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: #FFFDFB; /* Off-white card background */
  box-shadow: 0 2px 6px rgba(184, 67, 62, 0.08); 
  text-align: center;
  min-height: 105px; 
  position: relative; /* For selection indicator */
  overflow: hidden; /* To clip indicator if needed */
}

.zodiac-item:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: #E56D61; /* Brighter theme border on hover */
  box-shadow: 0 4px 12px rgba(217, 84, 77, 0.15);
  background-color: #FFF9F7;
}

.zodiac-item.active {
  background-color: #F8CACC; /* Light祈愿粉 */
  border-color: #D9544D; /* 缘结红 */
  color: #8C3835; /* Deep red-brown text for active */
  box-shadow: 0 0 15px rgba(217, 84, 77, 0.3), inset 0 0 5px rgba(255,255,255,0.3);
  transform: scale(1.05);
}

/* Selection Indicator - a small knot or seal */
.selection-indicator {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background-color: #D9544D; /* 缘结红 */
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.3s ease, transform 0.3s ease;
  box-shadow: 0 0 5px #B8433E;
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
  font-size: 2em; 
  margin-bottom: 6px;
  color: #E58F87; /* Softer pink/red for icons */
  transition: color 0.3s ease;
}

.zodiac-item.active .zodiac-icon {
 color: #8C3835; 
}

.zodiac-name {
  font-size: 0.9em;
  font-weight: 600;
  color: #B8433E; 
  margin-bottom: 3px;
  transition: color 0.3s ease;
}

.zodiac-item.active .zodiac-name {
  color: #8C3835; 
  font-weight: 700;
}

.zodiac-dates {
  font-size: 0.7em;
  color: #C74840;
  transition: color 0.3s ease;
}

.zodiac-item.active .zodiac-dates {
  color: #8C3835;
}

/* Selected zodiac detail area */
.themed-subsection { /* For the detail display */
  margin-top: 15px;
  padding: 15px;
  background-color: rgba(255, 248, 245, 0.9); /* Slightly different light background */
  border-radius: 12px;
  width: 100%;
  border: 1px solid rgba(229, 109, 97, 0.2);
  box-shadow: inset 0 1px 5px rgba(217, 84, 77, 0.08);
}

.detail-title {
  color: #C74840; 
  margin-bottom: 12px;
  font-size: 1.15em;
  text-align: center;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  font-weight: 500;
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
  color: #D9544D;
  margin-right: 6px;
  flex-shrink: 0;
}

.trait-value {
  color: #8C3835;
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
    font-size: 1.8em;
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