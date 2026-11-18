<template>
  <div class="fortune-result" :class="{ visible: fortuneStore.isFortuneVisible, 'zodiac-result': isZodiacResult }" data-tour="result">
    <!-- 添加星座结果标识 -->
    <div class="zodiac-result-badge" v-if="isZodiacResult">
      <AppIcon name="sparkles" :size="14" />
      <span>{{ voice.result.zodiacBadge }}</span>
    </div>
    
    <!-- 添加等级标签 -->
    <div class="fortune-level-container" v-if="fortune.level && !isZodiacResult">
      <span class="level-badge reveal-item" :class="`level-${fortune.level}`">{{ getLevelName(fortune.level) }}</span>
      <span class="special-badge reveal-item" v-if="fortune.isSpecial">
        <AppIcon name="sparkles" :size="13" />
        缘分转机
      </span>
    </div>
    
    <!-- 星座配对信息 -->
    <div class="zodiac-info-container" v-if="isZodiacResult">
      <div class="zodiac-pair">
        <div class="zodiac-icon" :style="{borderColor: getZodiacColor(fortune.sign1)}">{{ getZodiacElement(fortune.sign1) }}</div>
        <div class="zodiac-name">{{ fortune.sign1 }}</div>
      </div>
      <div class="compatibility-meter">
        <div class="hearts-container">
          <span 
            v-for="n in 5" 
            :key="n" 
            class="heart"
            :class="{ filled: n <= (fortune.compatibility || 0) }"
          ></span>
        </div>
        <div class="compatibility-label">{{ getCompatibilityLabel(fortune.compatibility) }}</div>
      </div>
      <div class="zodiac-pair">
        <div class="zodiac-icon" :style="{borderColor: getZodiacColor(fortune.sign2)}">{{ getZodiacElement(fortune.sign2) }}</div>
        <div class="zodiac-name">{{ fortune.sign2 }}</div>
      </div>
    </div>
    
    <div class="fortune-card-wrapper">
      <div class="fortune-card">
        <!-- 卷轴装饰元素 -->
        <div class="scroll-top"></div>
        <div class="scroll-bottom"></div>
        
        <!-- 添加光效元素 -->
        <div class="light-effect"></div>
        
        <div class="fortune-content-inner">
          <div class="fortune-type reveal-item">{{ fortune.type }}</div>
          <div class="fortune-poem reveal-item" v-html="fortune.poem"></div>
          <div class="fortune-interpretation reveal-item" v-html="fortune.interpretation"></div>
          <div class="fortune-suggestion reveal-item" v-if="fortune.suggestion">
            <span class="suggestion-label">【{{ voice.result.sectionLabel }}】</span>
            {{ fortune.suggestion }}
          </div>

          <div class="deity-remark reveal-item">
            <span class="deity-mark">缘</span>
            <p class="deity-remark-text">
              <span class="deity-name">缘结神</span>{{ remark }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <button class="draw-again-btn reveal-item" @click="$emit('drawAgain')">
      <AppIcon name="refresh" :size="15" />
      {{ voice.result.drawAgain }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useFortuneStore } from '../stores/FortuneStore';
import { computed, onMounted, watch } from 'vue';
import { voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

const fortuneStore = useFortuneStore();

const props = defineProps({
  fortune: {
    type: Object,
    required: true
  },
  typeColor: {
    type: String,
    default: '#D9544D'
  }
});

defineEmits(['drawAgain']);

// 判断是否是星座配对结果
const isZodiacResult = computed(() => {
  return props.fortune && props.fortune.sign1 && props.fortune.sign2;
});

// 监控结果变化
watch(() => fortuneStore.selectedFortune, (newValue) => {
  if (newValue) {
    console.log('FortuneResult组件检测到新结果:', newValue);
    if (newValue.sign1 && newValue.sign2) {
      console.log('检测到星座配对结果');
    }
  }
});

// 组件挂载时
onMounted(() => {
  console.log('FortuneResult组件已挂载');
  console.log('当前结果:', props.fortune);
});

// 根据等级获取等级名称
const getLevelName = (level) => {
  return fortuneStore.fortuneLevels[level]?.name || '普通签文';
};

// 神明对这一签的评价（不是系统判语）
const remark = computed(() => {
  if (props.fortune?.isSpecial) return voice.result.specialRemark;
  const level = props.fortune?.level;
  return voice.result.levelRemark[level] || voice.result.levelRemark[1];
});

// 根据匹配程度获取描述
const getCompatibilityLabel = (level) => {
  const labels = {
    1: '有挑战',
    2: '需磨合',
    3: '一般匹配',
    4: '较为合适',
    5: '天作之合'
  };
  return labels[level] || '缘分未知';
};

// 根据星座名获取对应的emoji
function getZodiacElement(signName) {
  const elementMap = {
    '白羊座': '火', '狮子座': '火', '射手座': '火',
    '金牛座': '土', '处女座': '土', '摩羯座': '土',
    '双子座': '风', '天秤座': '风', '水瓶座': '风',
    '巨蟹座': '水', '天蝎座': '水', '双鱼座': '水'
  };
  return elementMap[signName] || '星';
}

function getZodiacColor(signName) {
  const colorMap = {
    '白羊座': '#FF4500',
    '金牛座': '#228B22',
    '双子座': '#FFD700',
    '巨蟹座': '#B0C4DE',
    '狮子座': '#FFA500',
    '处女座': '#9370DB',
    '天秤座': '#F08080',
    '天蝎座': '#800000',
    '射手座': '#4682B4',
    '摩羯座': '#696969',
    '水瓶座': '#00BFFF',
    '双鱼座': '#EE82EE'
  };
  return colorMap[signName] || '#D9544D';
}
</script>

<style scoped>
.fortune-result {
  width: 100%;
  max-width: 600px;
  margin: 25px auto;
  opacity: 0;
  transform: translateY(25px) scale(0.98);
  transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  text-align: center;
}

.fortune-result.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Keyframes for reveal-item animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Base style for reveal-item before animation */
.reveal-item {
  opacity: 0; /* Start as transparent before animation */
}

/* Styles for reveal-item when parent is visible */
.fortune-result.visible .reveal-item {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Staggered delays for reveal-item elements */
.fortune-result.visible .level-badge,
.fortune-result.visible .special-badge {
  animation-delay: 0.1s;
}

.fortune-result.visible .fortune-type {
  animation-delay: 0.15s;
}

.fortune-result.visible .fortune-poem {
  animation-delay: 0.2s;
}

.fortune-result.visible .fortune-interpretation {
  animation-delay: 0.25s;
}

.fortune-result.visible .fortune-suggestion {
  animation-delay: 0.3s;
}

.fortune-result.visible .draw-again-btn {
  animation-delay: 0.4s;
}

.fortune-result.visible .deity-remark {
  animation-delay: 0.35s;
}

/* 星座结果特殊样式 */
.fortune-result.zodiac-result {
  background-color: rgba(255, 245, 245, 0.85);
  padding: 20px 15px 25px;
  border-radius: 18px;
  border: 2px solid rgba(229, 109, 97, 0.6);
  box-shadow: 0 8px 25px rgba(217, 84, 77, 0.15);
  animation: none;
  margin-top: 30px;
  margin-bottom: 30px;
}

/* 星座结果标识 */
.zodiac-result-badge {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(45deg, #E56D61, #D9544D);
  color: white;
  padding: 6px 18px;
  border-radius: 15px;
  font-size: 0.95rem;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(184, 67, 62, 0.3);
  white-space: nowrap;
  z-index: 5;
}

/* 等级标签容器 */
.fortune-level-container {
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.level-badge {
  display: inline-block;
  padding: 4px 14px;
  border: 1px solid currentColor;
  border-radius: 2px;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--c-shu);
  background: transparent;
}
.level-badge.level-5 { color: var(--c-gold); }
.level-badge.level-4 { color: var(--c-shu); }
.level-badge.level-3 { color: var(--c-shu-soft); }
.level-badge.level-2 { color: var(--c-gold); }
.level-badge.level-1 { color: var(--c-ink-faint); }

.special-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: rgba(255, 223, 186, 0.9);
  color: #B87333;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(229, 162, 60, 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.special-badge-icon {
  margin-right: 6px;
  font-size: 1.1em;
  color: #E6A23C;
}

/* 星座配对样式 */
.zodiac-info-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 22px;
  padding: 18px 15px;
  background-color: rgba(255, 250, 250, 0.9);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(217, 84, 77, 0.1);
}

.zodiac-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
}

.zodiac-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  background-color: rgba(255, 248, 248, 0.9);
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #E56D61;
  box-shadow: 0 3px 7px rgba(217, 84, 77, 0.15);
  color: #333;
}

.zodiac-name {
  font-size: 0.9rem;
  color: #B8433E;
  font-weight: 500;
}

.compatibility-meter {
  text-align: center;
}

.hearts-container {
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}

.heart {
  width: 18px; height: 18px;
  background-color: #E0E0E0;
  margin: 0 3px;
  position: relative;
  transform: rotate(-45deg);
  transition: background-color 0.3s ease;
}
.heart::before, .heart::after {
  content: "";
  width: 18px; height: 18px;
  background-color: inherit;
  border-radius: 50%;
  position: absolute;
}
.heart::before { top: -9px; left: 0; }
.heart::after { top: 0; left: 9px; }

.heart.filled {
  background-color: #D9544D;
}

.compatibility-label {
  font-size: 0.85rem;
  color: #C74840;
}

/* 卡片包裹器 */
.fortune-card-wrapper {
  padding: 5px;
  position: relative;
  margin-bottom: 25px;
}

.fortune-card {
  background-color: var(--c-paper);
  background-image: linear-gradient(180deg, #FFFDF7, #FAF2E3);
  padding: 42px 26px 32px;
  border-radius: 3px;
  box-shadow: 0 10px 30px rgba(92, 44, 32, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--c-line);
}

.scroll-top, .scroll-bottom {
  position: absolute;
  left: -1px; right: -1px;
  height: 12px;
  background: linear-gradient(180deg, #C9A67F, #B08E6E);
  box-shadow: 0 2px 6px rgba(92, 68, 48, 0.16);
  z-index: 2;
}
.scroll-top {
  top: 0;
  border-radius: 2px 2px 0 0;
  border-bottom: 1px solid rgba(255, 246, 232, 0.5);
}
.scroll-bottom {
  bottom: 0;
  border-radius: 0 0 2px 2px;
  border-top: 1px solid rgba(255, 246, 232, 0.5);
}
.scroll-top::before, .scroll-top::after,
.scroll-bottom::before, .scroll-bottom::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 10px; height: 10px;
  background-color: #9C7A5B;
  border-radius: 50%;
  box-shadow: inset 0 0 2px rgba(255,255,255,0.35);
}
.scroll-top::before, .scroll-bottom::before { left: 10px; }
.scroll-top::after, .scroll-bottom::after { right: 10px; }

/* 光效 */
.light-effect {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(255, 223, 186, 0.25) 0%, rgba(255,223,186,0) 60%);
  transform-origin: center center;
  animation: subtle-glow 5s infinite alternate ease-in-out;
  pointer-events: none;
  z-index: 0;
}

@keyframes subtle-glow {
  0% { transform: scale(0.9); opacity: 0.6; }
  100% { transform: scale(1.1); opacity: 0.9; }
}

.fortune-content-inner {
  position: relative;
  z-index: 1;
}

.fortune-type {
  display: block;
  margin: 0 auto 22px;
  padding: 0;
  background: none;
  font-family: var(--font-display);
  color: var(--c-ink);
  font-size: 1.32rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-indent: 0.22em;
  text-align: center;
}

.fortune-poem {
  font-size: 1.22rem;
  color: var(--c-ink);
  margin-bottom: 20px;
  line-height: 1.8;
  font-family: var(--font-family-serif-decorative, 'Noto Serif SC', serif);
  white-space: pre-line;
  padding: 0 10px;
}
.fortune-poem::before {
  content: '\300C';
  margin-right: 0.3em;
  opacity: 0.6;
}
.fortune-poem::after {
  content: '\300D';
  margin-left: 0.3em;
  opacity: 0.6;
}

.fortune-interpretation {
  font-size: 0.94rem;
  color: var(--c-ink-soft);
  margin-bottom: 22px;
  line-height: 1.8;
  text-align: left;
  padding: 0 0 0 14px;
  background: none;
  border-radius: 0;
  border-left: 2px solid var(--c-gold-soft);
}

.fortune-suggestion {
  font-size: 0.9rem;
  color: var(--c-ink-soft);
  line-height: 1.8;
  text-align: left;
  margin-top: 20px;
  padding: 0 0 0 14px;
  border: 0;
  border-left: 2px solid var(--c-shu-soft);
  border-radius: 0;
  background: none;
}

.suggestion-label {
  font-weight: 600;
  color: var(--c-shu);
  margin-right: 5px;
}

/* 神明评议 */
.deity-remark {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-top: 26px;
  padding: 18px 0 0;
  border: 0;
  border-top: 1px solid var(--c-line);
  border-radius: 0;
  background: none;
  text-align: left;
}

.deity-mark {
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  background: var(--c-shu);
  color: #FFF6F0;
  font-family: var(--font-display);
  font-size: 0.78em;
  box-shadow: none;
}

.deity-remark-text {
  margin: 0;
  font-family: var(--font-family-serif);
  font-size: 0.88em;
  line-height: 1.7;
  color: var(--c-ink-soft);
}

.deity-name {
  display: block;
  margin-bottom: 2px;
  font-size: 0.76em;
  letter-spacing: 0.14em;
  color: var(--c-shu);
}

.draw-again-btn {
  padding: 10px 26px;
  font-size: 0.95rem;
  color: #FFF8F0;
  background: var(--c-shu);
  border: 1px solid var(--c-shu-deep);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  font-family: var(--font-body);
  font-weight: 500;
  letter-spacing: 0.14em;
  box-shadow: 0 2px 8px rgba(143, 39, 28, 0.18);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.draw-again-btn:hover {
  background: var(--c-shu-deep);
  transform: translateY(-1px);
}

.draw-again-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(143, 39, 28, 0.2);
}

.btn-icon {
  margin-right: 8px;
  font-size: 1.2em;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .fortune-result {
    max-width: 95%;
    padding: 0 10px;
  }
  .fortune-card-wrapper {
    margin-bottom: 20px;
  }
  .fortune-card {
    padding: 40px 15px 30px;
  }
  .level-badge { font-size: 1.1rem; padding: 7px 15px; }
  .special-badge { font-size: 0.85rem; padding: 5px 10px; }
  .fortune-type { font-size: 1.2rem; margin-bottom: 18px; }
  .fortune-poem { font-size: 1.15rem; margin-bottom: 18px; }
  .fortune-interpretation { font-size: 0.9rem; margin-bottom: 18px; padding-left: 12px; }
  .fortune-suggestion { font-size: 0.85rem; padding-left: 12px; }
  .deity-remark { padding: 15px 0 0; margin-top: 20px; }
  .deity-remark-text { font-size: 0.82em; }
  .draw-again-btn { font-size: 1rem; padding: 9px 20px; }

  .zodiac-info-container { padding: 15px 10px; }
  .zodiac-icon { font-size: 2.2rem; width: 55px; height: 55px; }
  .zodiac-name { font-size: 0.85rem; }
  .heart { width: 16px; height: 16px; }
  .heart::before { top: -8px; }
  .heart::after { left: 8px; }
}

@media (max-width: 400px) {
  .scroll-top, .scroll-bottom { height: 25px; }
  .scroll-top::before, .scroll-top::after, 
  .scroll-bottom::before, .scroll-bottom::after { width: 10px; height: 10px; }
  .level-badge { font-size: 1rem; padding: 6px 12px; }
  .fortune-poem { font-size: 1.05rem; }
  .fortune-interpretation { font-size: 0.85rem; }
  .fortune-suggestion { font-size: 0.8rem; }
  .draw-again-btn { font-size: 0.95rem; padding: 8px 18px; }

  .zodiac-info-container { flex-direction: column; gap: 15px; }
  .compatibility-meter { order: -1; margin-bottom: 10px;}
}
</style> 