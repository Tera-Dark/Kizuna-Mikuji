<template>
  <div class="zodiac-explanation themed-section-box reveal-item">
    <h4 class="section-title"><span class="title-deco left">🌿</span> 星座元素相性 <span class="title-deco right">🌿</span></h4>
    <div class="elements-grid">
      <div class="element-item themed-subsection" v-for="(desc, elementKey) in elementDescriptions" :key="elementKey">
        <div class="element-icon" :class="getElementClass(elementKey)">{{ getElementEmoji(elementKey) }}</div>
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
import { ref } from 'vue'; // ref might not be strictly needed if elementDescriptions is static, but good practice

// 元素描述
const elementDescriptions = {
  fire: '热情如火，充满活力与创造的能量，勇于开拓，直率明朗。',
  earth: '稳重如山，代表务实与坚韧的品质，忠诚可靠，耐心持重。',
  air: '灵动如风，象征思想与沟通的智慧，聪颖善变，热爱社交。',
  water: '柔情似水，蕴含情感与直觉的深度，富有同情，体贴入微。'
};

// 获取元素对应的emoji
function getElementEmoji(element) {
  const emojiMap = {
    fire: '🔥',
    earth: '🌱',
    air: '🌬️',
    water: '💧',
    // Adding Chinese keys as well, in case they are used directly
    火: '🔥',
    土: '🌱',
    风: '🌬️',
    水: '💧'
  };
  return emojiMap[element.toLowerCase()] || '✨'; // ensure lowercase for matching 'fire', 'earth' etc.
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
.themed-section-box { /* Applied to main wrapper */
  margin-top: 25px;
  padding: 25px 30px;
  background-color: rgba(255, 248, 245, 0.9); /* Light peach/pink background */
  border-radius: 20px; 
  box-shadow: 0 8px 28px rgba(217, 84, 77, 0.1), 0 0 0 1.5px rgba(229, 109, 97, 0.25);
  width: 100%;
  max-width: 780px; 
  border: 1px solid transparent; 
  animation: fadeInLoad 0.7s ease-out;
  text-align: center; /* Center align content within this box */
}

@keyframes fadeInLoad {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  text-align: center;
  color: #B8433E; /* Main theme red */
  font-size: 1.7em;
  margin-bottom: 25px;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  font-weight: 500;
  letter-spacing: 1px;
  display: inline-flex; /* To keep decorators on the same line with text */
  align-items: center;
  gap: 10px;
}

.title-deco {
  font-size: 0.85em;
  color: #E58F87; /* Softer accent */
  opacity: 0.9;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.themed-subsection { /* Applied to each element-item */
  background-color: #FFFDFB; 
  padding: 20px 15px;
  border-radius: 15px;
  border: 1px solid rgba(229, 109, 97, 0.3);
  box-shadow: 0 4px 12px rgba(217, 84, 77, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.element-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 6px 18px rgba(217, 84, 77, 0.12);
  border-color: #E56D61;
}

.element-icon {
  font-size: 2.8em;
  margin-bottom: 12px;
  line-height: 1;
  display: inline-block; /* Ensure it behaves well */
}

/* Themed Element Icon Colors */
.element-icon.element-fire { color: #E57373; } /* Soft Red - Fire */
.element-icon.element-earth { color: #A4D4AE; } /* Soft Green - Earth */
.element-icon.element-air { color: #A0D2DB; } /* Soft Blue - Air */
.element-icon.element-water { color: #7986CB; } /* Soft Indigo/Blue - Water */

.element-name {
  font-size: 1.25em;
  font-weight: 600;
  color: #8C3835; /* Deep red-brown */
  margin-bottom: 8px;
  font-family: var(--font-family-serif);
}

.element-desc {
  font-size: 0.9em;
  color: #6D4C41; /* Darker brown */
  line-height: 1.6;
  min-height: 60px; /* Give some consistent height */
}

.zodiac-explanation p {
  font-size: 0.95em;
  color: #5D4037; /* Dark brown text */
  line-height: 1.75;
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
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 15px;
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
    grid-template-columns: repeat(2, 1fr); /* Two columns for smaller screens */
  }
}
</style> 