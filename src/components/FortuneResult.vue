<template>
  <div class="fortune-result" :class="{ visible: fortuneStore.isFortuneVisible, 'zodiac-result': isZodiacResult }">
    <!-- 添加星座结果标识 -->
    <div class="zodiac-result-badge" v-if="isZodiacResult">
      <span>⭐ 星座配对结果 ⭐</span>
    </div>
    
    <!-- 添加等级标签 -->
    <div class="fortune-level" v-if="fortune.level">
      <span class="level-badge reveal-item">{{ getLevelName(fortune.level) }}</span>
      <span class="special-badge reveal-item" v-if="fortune.isSpecial">缘分转机</span>
    </div>
    
    <!-- 星座配对信息 -->
    <div class="zodiac-info" v-if="isZodiacResult">
      <div class="zodiac-pair">
        <div class="zodiac-icon">{{ getZodiacEmoji(fortune.sign1) }}</div>
        <div class="zodiac-name">{{ fortune.sign1 }}</div>
      </div>
      <div class="compatibility-meter">
        <div class="hearts-container">
          <span 
            v-for="n in 5" 
            :key="n" 
            class="heart" 
            :class="{ filled: n <= (fortune.compatibility || 0) }"
          >❤</span>
        </div>
        <div class="compatibility-label">{{ getCompatibilityLabel(fortune.compatibility) }}</div>
      </div>
      <div class="zodiac-pair">
        <div class="zodiac-icon">{{ getZodiacEmoji(fortune.sign2) }}</div>
        <div class="zodiac-name">{{ fortune.sign2 }}</div>
      </div>
    </div>
    
    <div class="fortune-card">
      <!-- 卷轴装饰元素 -->
      <div class="scroll-top"></div>
      <div class="scroll-bottom"></div>
      
      <!-- 添加光效元素 -->
      <div class="light-effect"></div>
      
      <div class="fortune-type reveal-item" :style="{ backgroundColor: typeColor }">{{ fortune.type }}</div>
      <div class="fortune-poem reveal-item" v-html="fortune.poem"></div>
      <div class="fortune-interpretation reveal-item" v-html="fortune.interpretation"></div>
      <div class="fortune-suggestion reveal-item">
        <span class="suggestion-label">【签语】</span>
        {{ fortune.suggestion }}
      </div>
    </div>
    
    <button class="draw-again-btn reveal-item" @click="$emit('drawAgain')">再求一签</button>
  </div>
</template>

<script setup lang="ts">
import { useFortuneStore } from '../stores/FortuneStore';
import { computed, onMounted, watch } from 'vue';

const fortuneStore = useFortuneStore();

const props = defineProps({
  fortune: {
    type: Object,
    required: true
  },
  typeColor: {
    type: String,
    default: '#e74c3c'
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
function getZodiacEmoji(signName) {
  const emojiMap = {
    '白羊座': '♈',
    '金牛座': '♉',
    '双子座': '♊',
    '巨蟹座': '♋',
    '狮子座': '♌',
    '处女座': '♍',
    '天秤座': '♎',
    '天蝎座': '♏',
    '射手座': '♐',
    '摩羯座': '♑',
    '水瓶座': '♒',
    '双鱼座': '♓'
  };
  return emojiMap[signName] || '⭐';
}
</script>

<style scoped>
.fortune-result {
  width: 100%;
  max-width: 550px;
  margin: 20px auto;
  opacity: 0;
  transform: translateY(30px) scale(0.97);
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  perspective: 1000px;
}

.fortune-result.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 星座结果特殊样式 */
.fortune-result.zodiac-result {
  background-color: rgba(252, 248, 240, 0.2);
  padding: 15px;
  padding-top: 30px;
  border-radius: 15px;
  border: 3px dashed rgba(192, 57, 43, 0.5);
  animation: glow 2s ease-in-out infinite alternate, attention-pulse 3s ease-in-out 1;
  margin-top: 40px;
  margin-bottom: 40px;
}

/* 添加吸引注意力的脉冲动画 */
@keyframes attention-pulse {
  0% { transform: scale(1); }
  10% { transform: scale(1.03); }
  20% { transform: scale(1); }
  30% { transform: scale(1.02); }
  40% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

@keyframes glow {
  from {
    box-shadow: 0 0 8px rgba(192, 57, 43, 0.4);
  }
  to {
    box-shadow: 0 0 20px rgba(192, 57, 43, 0.7), 0 0 30px rgba(255, 204, 0, 0.4);
  }
}

/* 星座结果标识 */
.zodiac-result-badge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(45deg, #c0392b, #e74c3c);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  z-index: 5;
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-7px); }
}

/* 星座配对样式 */
.zodiac-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out;
}

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

.zodiac-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
}

.zodiac-icon {
  font-size: 32px;
  margin-bottom: 5px;
  background-color: rgba(255, 248, 231, 0.8);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.zodiac-name {
  font-size: 14px;
  color: #8B4513;
  font-weight: bold;
  margin-top: 5px;
}

.compatibility-meter {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
}

.hearts-container {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

.heart {
  font-size: 24px;
  margin: 0 3px;
  color: #dddddd;
  transition: color 0.6s ease, transform 0.3s ease;
}

.heart.filled {
  color: #e74c3c;
  animation: heartbeat 1.5s infinite;
}

.compatibility-label {
  font-size: 16px;
  color: #8B4513;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
  background-color: rgba(255, 248, 231, 0.8);
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10% { transform: scale(1.2); }
  20% { transform: scale(1); }
  30% { transform: scale(1.1); }
}

.fortune-card {
  background-color: rgba(255, 250, 245, 0.9);
  background-image: repeating-linear-gradient(
                      90deg,
                      rgba(139, 69, 19, 0.04) 0px,
                      rgba(139, 69, 19, 0.04) 1px,
                      transparent 1px,
                      transparent 4px
                    );
  background-size: auto;
  background-position: center;
  border-radius: 2px;
  padding: 40px 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #e6d5c3;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
  transform-origin: center center;
  height: 0;
  max-height: 0;
  opacity: 0;
}

.fortune-result.visible .fortune-card {
  animation: scroll-unroll 1.2s cubic-bezier(0.33, 1, 0.68, 1) forwards;
  box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 卷轴顶部和底部的装饰元素 */
.scroll-top,
.scroll-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 35px;
  background-color: #c0392b;
  background-image: linear-gradient(to bottom, #a63529, #c0392b 40%, #e74c3c);
  z-index: 3;
  transform-origin: center;
  transform: scaleY(0);
  opacity: 0;
}

.scroll-top {
  top: 0;
  border-radius: 3px 3px 0 0;
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}

.scroll-bottom {
  bottom: 0;
  border-radius: 0 0 3px 3px;
  box-shadow: 0 -4px 6px -2px rgba(0, 0, 0, 0.3);
}

.scroll-top::before,
.scroll-bottom::before {
  content: "";
  position: absolute;
  left: 10%;
  right: 10%;
  height: 4px;
  background: linear-gradient(to right, transparent, #ffe9c8, transparent);
}

.scroll-top::before {
  bottom: 6px;
}

.scroll-bottom::before {
  top: 6px;
}

.fortune-result.visible .scroll-top {
  animation: scroll-edge-reveal 0.6s ease-out 0.3s forwards;
}

.fortune-result.visible .scroll-bottom {
  animation: scroll-edge-reveal 0.6s ease-out 0.5s forwards;
}

.fortune-type {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  padding: 5px 15px;
  font-size: 14px;
  border-bottom-left-radius: 10px;
  z-index: 4;
}

.fortune-poem {
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 20px;
  line-height: 1.7;
  text-align: center;
  margin: 40px 0 30px;
  color: #8B4513;
  position: relative;
}

.fortune-interpretation {
  margin: 20px 0;
  line-height: 1.6;
  text-align: justify;
}

.fortune-suggestion {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e6d5c3;
  line-height: 1.6;
}

.suggestion-label {
  font-weight: bold;
  color: #d4546a;
}

.draw-again-btn {
  background-color: transparent;
  border: 1px solid #d4af37;
  color: #d4af37;
  padding: 8px 20px;
  border-radius: 20px;
  margin-top: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.draw-again-btn:hover {
  background-color: #d4af37;
  color: white;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
}

.fortune-level {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 5;
  display: flex;
  gap: 5px;
}

.level-badge {
  background-color: rgba(212, 175, 55, 0.8);
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.special-badge {
  background-color: rgba(255, 54, 102, 0.8);
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 增加仪式感的新动画效果 */
.light-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  opacity: 0;
  z-index: 0;
  pointer-events: none;
}

.fortune-result.visible .light-effect {
  animation: light-expand 1.5s cubic-bezier(0.22, 1, 0.36, 1) 1.5s forwards;
}

/* 逐项显示的动画 */
.reveal-item {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fortune-result.visible .fortune-type {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.2s;
}

.fortune-result.visible .fortune-poem {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.5s;
}

.fortune-result.visible .fortune-interpretation {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.8s;
}

.fortune-result.visible .fortune-suggestion {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 2.1s;
}

.fortune-result.visible .draw-again-btn {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 2.4s;
}

.fortune-result.visible .level-badge,
.fortune-result.visible .special-badge {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.3s;
}

@keyframes card-glow {
  0% {
    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.6), 0 5px 20px rgba(0, 0, 0, 0.15);
  }
  100% {
    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

@keyframes light-expand {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2);
  }
}

@keyframes scroll-unroll {
  0% {
    max-height: 0;
    height: 0;
    opacity: 0;
    transform: rotateX(90deg) translateY(-20px);
  }
  30% {
    opacity: 1;
    transform: rotateX(10deg) translateY(-5px);
  }
  100% {
    max-height: 2000px;
    height: auto;
    opacity: 1;
    transform: rotateX(0deg) translateY(0);
    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

@keyframes scroll-edge-reveal {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* 添加卷轴纸质感的装饰纹理 */
.fortune-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 24px,
      rgba(139, 69, 19, 0.05) 24px,
      rgba(139, 69, 19, 0.05) 25px
    );
  opacity: 0.7;
  pointer-events: none;
  z-index: 1;
}

/* 深色主题样式 */
:deep(.dark-theme) .fortune-card {
  background-color: rgba(40, 44, 52, 0.9);
  border-color: #555;
  color: #eee;
}

:deep(.dark-theme) .fortune-poem {
  color: #ffcc99;
}

:deep(.dark-theme) .fortune-suggestion {
  border-top-color: #555;
}

:deep(.dark-theme) .suggestion-label {
  color: #ff7c98;
}

:deep(.dark-theme) .draw-again-btn {
  color: #ffd700;
  border-color: #ffd700;
}

:deep(.dark-theme) .draw-again-btn:hover {
  background-color: #ffd700;
  color: #333;
}

:deep(.dark-theme) .light-effect {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(30, 30, 30, 0) 70%);
}

/* 高亮效果 - 用于动态添加的类 */
:global(.highlight) {
  animation: highlight-pulse 1s ease-in-out 3 !important;
}

@keyframes highlight-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(192, 57, 43, 0); }
  50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(192, 57, 43, 0.8); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(192, 57, 43, 0); }
}
</style> 