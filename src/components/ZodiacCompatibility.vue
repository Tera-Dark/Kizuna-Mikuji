<template>
  <div class="zodiac-compatibility-container">
    <div class="zodiac-title">
      <h3 class="main-title"><span class="title-deco-left">❀</span> 星座缘分解析 <span class="title-deco-right">❀</span></h3>
      <p class="subtitle">探寻两位小主间的星座情缘</p>
    </div>

    <!-- 星座选择区域 -->
    <div class="zodiac-selection">
      <ZodiacSelector
        title="天作之合·其一"
        identifier="first"
        :zodiacData="zodiacData"
        v-model:selectedSign="selectedSign1"
      />

      <div class="versus-container">
        <div class="versus-icon">
          <svg viewBox="0 0 100 100" class="knot-svg">
            <defs>
              <path id="petalPathSingle"
                    d="M50,50 C50,30 25,25 50,10 C75,25 50,30 50,50Z"
                    class="knot-path" fill="none"/>
            </defs>
            <use href="#petalPathSingle" />
            <use href="#petalPathSingle" transform="rotate(90 50 50)"/>
            <use href="#petalPathSingle" transform="rotate(180 50 50)"/>
            <use href="#petalPathSingle" transform="rotate(270 50 50)"/>
            <circle cx="50" cy="50" r="8" class="knot-deco-center"/>
          </svg>
        </div>
      </div>

      <ZodiacSelector
        title="喜结良缘·其二"
        identifier="second"
        :zodiacData="zodiacData"
        v-model:selectedSign="selectedSign2"
        :isRightSelector="true"
      />
    </div>

    <!-- 分析按钮 -->
    <div class="analyze-button-container">
      <button
        class="analyze-button themed-button"
        :disabled="!selectedSign1 || !selectedSign2 || !zodiacData"
        @click="analyzeCompatibility"
      >
        <span class="button-icon">✨</span>
        <span>缘分妙不可言·解</span>
      </button>
    </div>

    <!-- 结果状态指示器 -->
    <div class="result-indicator" v-if="resultGenerated && compatibilityResult">
      <div class="loading-animation">
        <div class="heart-loader"></div>
      </div>
      <p class="result-message">施主，你们的星座缘分正在揭晓...</p>
      <div class="arrow-indicator">
        <span class="scroll-prompt">向下轻启，阅览天定良缘</span>
        <span class="scroll-arrow">⇓</span>
      </div>
      <div class="result-hint" v-if="showResultHint">
        <div class="arrow-down"></div>
        <span>👋 结果已生成，请查看下方！</span>
      </div>
    </div>

    <!-- 使用新的子组件显示结果 -->
    <CompatibilityResultDisplay :result="compatibilityResult" v-if="resultGenerated && compatibilityResult" />

    <!-- 使用新的子组件显示星座元素解释 -->
    <ZodiacElementInfo />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';
import { playSound } from '../utils/audioUtils';
import ZodiacSelector from './ZodiacSelector.vue';
import CompatibilityResultDisplay from './CompatibilityResultDisplay.vue';
import ZodiacElementInfo from './ZodiacElementInfo.vue';

const fortuneStore = useFortuneStore();
const { zodiacData, analyzeZodiacCompatibility } = fortuneStore;

const selectedSign1 = ref('');
const selectedSign2 = ref('');
const compatibilityResult = ref(null);
const showResultHint = ref(false);
const resultGenerated = ref(false);

// 元素相性表 (需要保留，用于计算)
const elementCompat = {
  火: { 火: 90, 土: 60, 风: 80, 水: 40 },
  土: { 火: 60, 土: 85, 风: 50, 水: 90 },
  风: { 火: 80, 土: 50, 风: 85, 水: 70 },
  水: { 火: 40, 土: 90, 风: 70, 水: 95 }
};

// Helper function to map various element representations to Chinese single characters
function mapToChineseElement(elValue) {
  if (!elValue) return null;
  const val = String(elValue).toLowerCase(); // Ensure it's a lowercase string
  if (val === 'fire' || val === '火' || val === '火象') return '火';
  if (val === 'water' || val === '水' || val === '水象') return '水';
  if (val === 'air' || val === '风' || val === '风象') return '风';
  if (val === 'earth' || val === '土' || val === '土象') return '土';
  console.warn(`Unknown element value for mapping: ${elValue}`);
  return null; // Return null if no valid mapping, or handle as an error
}

// 选择第一个星座
function selectSign1(sign) {
  selectedSign1.value = sign;
}

// 选择第二个星座
function selectSign2(sign) {
  console.log('选择了第二个星座:', sign); // 添加调试日志
  selectedSign2.value = sign;
}

// 增加带有事件阻止传播的点击处理函数
function handleZodiacItemClick(event, sign, isFirstSign) {
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 打印调试信息
  console.log(`点击星座: ${sign}, 是第一列: ${isFirstSign}, 目标元素:`, event.target);
  
  // 根据是第一列还是第二列调用不同的选择函数
  if (isFirstSign) {
    selectSign1(sign);
  } else {
    selectSign2(sign);
  }
}

// 获取星座性格特点
function getZodiacPersonality(sign) {
  const personalityMap = {
    aries: '热情、勇敢、冲动',
    taurus: '踏实、固执、享乐',
    gemini: '机智、多变、好奇',
    cancer: '敏感、情绪化、富有同情心',
    leo: '自信、慷慨、戏剧化',
    virgo: '细致、挑剔、实用',
    libra: '平衡、社交、优雅',
    scorpio: '热情、神秘、占有欲强',
    sagittarius: '自由、乐观、直率',
    capricorn: '野心、自律、实际',
    aquarius: '独立、革新、理性',
    pisces: '梦幻、富有同情心、艺术性'
  };
  return personalityMap[sign] || '未知性格';
}

// 获取即时兼容性评分
const getQuickCompatibilityScore = computed(() => {
  if (!selectedSign1.value || !selectedSign2.value || !zodiacData.value) return 0;
  
  const sign1Data = zodiacData.value[selectedSign1.value];
  const sign2Data = zodiacData.value[selectedSign2.value];

  if (!sign1Data || !sign2Data) return 0;

  const element1KeyRaw = sign1Data.element;
  const element2KeyRaw = sign2Data.element;
  
  const element1 = mapToChineseElement(element1KeyRaw);
  const element2 = mapToChineseElement(element2KeyRaw);
  
  if (!element1 || !element2 || !elementCompat[element1] || elementCompat[element1][element2] === undefined) {
    // For debugging:
    // console.warn('Compatibility calculation failed or element not found:', {
    //   sign1: selectedSign1.value, rawEl1: element1KeyRaw, mappedEl1: element1,
    //   sign2: selectedSign2.value, rawEl2: element2KeyRaw, mappedEl2: element2,
    //   compatCheck1: elementCompat[element1],
    //   compatCheck2: elementCompat[element1] ? elementCompat[element1][element2] : 'N/A'
    // });
    return 0;
  }

  return elementCompat[element1][element2];
});

// 分析星座配对
function analyzeCompatibility() {
  if (selectedSign1.value && selectedSign2.value) {
    resultGenerated.value = false; // 重置结果状态
    
    console.log('开始分析星座配对...');
    console.log('selectedSign1:', selectedSign1.value);
    console.log('selectedSign2:', selectedSign2.value);
    
    // 使用audioUtils播放音效
    playSound('sounds/wind-chime.mp3', 0.5).catch(error => {
      console.warn('音效播放失败:', error);
    });

    // 分析星座配对
    const result = analyzeZodiacCompatibility(selectedSign1.value, selectedSign2.value);
    
    console.log('分析结果:', result);
    console.log('store状态:', fortuneStore.selectedFortune);
    
    // 如果分析成功，显示提示并滚动到结果区域
    if (result) {
      console.log('分析成功，准备显示结果...');
      
      // 显示提示
      showResultHint.value = true;
      resultGenerated.value = true;
      
      setTimeout(() => {
        showResultHint.value = false;
      }, 5000);
      
      // 滚动到结果区域
      setTimeout(() => {
        console.log('尝试滚动到结果区域...');
        const resultElement = document.querySelector('.fortune-result');
        console.log('找到结果元素?', !!resultElement);
        
        if (resultElement) {
          console.log('结果元素位置:', resultElement.getBoundingClientRect());
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // 添加高亮效果
          resultElement.classList.add('highlight');
          setTimeout(() => resultElement.classList.remove('highlight'), 3000);
        } else {
          console.error('找不到结果元素！');
        }
      }, 1000);
    } else {
      console.error('分析星座配对失败');
    }
  }
}

// 添加备用点击处理函数，直接获取星座数据并更新状态
function handleEmergencySelection(event, isFirstSide) {
  // 阻止事件冒泡和默认行为
  event.preventDefault();
  event.stopPropagation();
  
  // 获取点击位置
  const x = event.clientX;
  const y = event.clientY;
  console.log(`紧急点击处理: 位置(${x}, ${y}), 第一列? ${isFirstSide}`);
  
  // 获取所有星座项
  const selector = isFirstSide ? '.zodiac-item:not(.right-zodiac-item)' : '.right-zodiac-item';
  const items = document.querySelectorAll(selector);
  
  // 查找点击位置最接近的星座项
  let closestItem = null;
  let minDistance = Infinity;
  
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    // 计算点击位置到元素中心的距离
    const itemX = rect.left + rect.width / 2;
    const itemY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(x - itemX, 2) + Math.pow(y - itemY, 2));
    
    if (distance < minDistance) {
      minDistance = distance;
      closestItem = item;
    }
  });
  
  if (closestItem) {
    console.log('找到最近的星座项:', closestItem);
    // 从数据属性或内容中提取星座标识
    const sign = closestItem.getAttribute('data-sign') || 
                getSignFromText(closestItem.textContent);
    
    if (sign) {
      console.log(`选择星座: ${sign}, 第一列? ${isFirstSide}`);
      if (isFirstSide) {
        selectSign1(sign);
      } else {
        selectSign2(sign);
      }
    }
  }
}

// 从文本中推断星座
function getSignFromText(text) {
  if (!text) return null;
  
  const mapping = {
    '白羊座': 'aries',
    '金牛座': 'taurus', 
    '双子座': 'gemini',
    '巨蟹座': 'cancer',
    '狮子座': 'leo',
    '处女座': 'virgo',
    '天秤座': 'libra',
    '天蝎座': 'scorpio',
    '射手座': 'sagittarius',
    '摩羯座': 'capricorn',
    '水瓶座': 'aquarius',
    '双鱼座': 'pisces'
  };
  
  for (const [chinese, sign] of Object.entries(mapping)) {
    if (text.includes(chinese)) {
      return sign;
    }
  }
  
  return null;
}

// 在组件挂载后检测右侧星座是否可点击
onMounted(() => {
  console.log('星座配对组件已挂载');
  
  // 延迟执行，确保DOM已渲染
  setTimeout(() => {
    // 检测右侧星座元素
    const rightZodiacItems = document.querySelectorAll('.right-zodiac-item');
    console.log('找到右侧星座元素数量:', rightZodiacItems.length);
    
    // 检测每个元素的z-index和pointer-events
    rightZodiacItems.forEach((item, index) => {
      const computedStyle = window.getComputedStyle(item);
      console.log(`右侧星座项 ${index}:`, {
        zIndex: computedStyle.zIndex,
        pointerEvents: computedStyle.pointerEvents,
        position: computedStyle.position
      });
      
      // 添加测试点击事件
      item.addEventListener('click', () => {
        console.log(`右侧星座项 ${index} 被点击了!`);
      });
    });
  }, 1000);
});
</script>

<style scoped>
.zodiac-compatibility-container {
  width: 100%;
  padding: 25px;
  background-color: rgba(255, 240, 245, 0.6); /* 淡粉色半透明背景，与App.vue协调 */
  border-radius: 20px;
  /* box-shadow: 0 5px 20px var(--theme-color-light-pink-shadow, rgba(255, 182, 193, 0.3)); */
  /* border: 1px solid var(--theme-color-light-pink, #FFB6C1); */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  font-family: var(--font-family-serif);
}

.zodiac-title h3.main-title {
  font-size: 2.6em; 
  color: #B8433E; /* 主题深红色 */
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 1px 1px 3px rgba(255, 230, 230, 0.8);
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-deco-left, .title-deco-right {
  color: #E56D61; /* 主题红色 */
  font-size: 0.7em;
  margin: 0 15px;
  opacity: 0.9;
}

.zodiac-title .subtitle {
  font-size: 1.05em;
  color: #C74840; /* 主题次红色 */
  margin-bottom: 25px;
  font-family: var(--font-family-sans-serif);
  font-style: italic;
}

.zodiac-selection {
  display: flex;
  justify-content: space-around; /* 让选择器和VS区域均匀分布 */
  align-items: flex-start; /* 顶部对齐 */
  width: 100%;
  gap: 20px; /* 选择器之间的间距 */
}

.versus-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align to top */
  align-self: flex-start; /* Align self to top with selectors */
  padding-top: calc(60px + 2em); /* Adjust based on ZodiacSelector title + some space */
  min-height: 150px; /* Ensure enough space for knot and arrow */
  position: relative; /* For absolute positioning of arrow if needed */
}

.versus-icon {
  width: 70px; /* Adjusted size of the knot icon */
  height: 70px; /* Adjusted size of the knot icon */
  margin-bottom: 20px; /* Space between knot and arrow */
}

.knot-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.knot-path {
  stroke: #D9544D; /* 缘结红 */
  stroke-width: 7; /* Knot line thickness */
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: drawKnotPath 2s ease-out forwards;
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
}

@keyframes drawKnotPath {
  to {
    stroke-dashoffset: 0;
  }
}

.knot-deco-center {
  fill: #B8433E; /* Theme Dark Red for center */
  stroke: #FFF3F3; /* Light cream stroke */
  stroke-width: 2px;
  opacity: 0;
  animation: fadeInKnotDeco 1s 1.5s ease-out forwards; /* Delay to animate after path drawing */
}

@keyframes fadeInKnotDeco {
  to {
    opacity: 1;
  }
}

.analyze-button-container {
  margin-top: 30px;
  margin-bottom: 20px;
}

.analyze-button.themed-button {
  padding: 14px 28px;
  font-size: 1.15em;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(145deg, #D9544D, #B8433E); /* 缘结红 to 深红 */
  border: none;
  border-radius: 30px; /* More rounded, like a scroll or capsule */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(184, 67, 62, 0.25), 0 0 0 1.5px rgba(255,255,255,0.3) inset;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  letter-spacing: 0.5px;
  display: inline-flex; /* Align icon and text */
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.analyze-button.themed-button:not(:disabled):hover {
  background: linear-gradient(145deg, #B8433E, #D9544D);
  box-shadow: 0 6px 16px rgba(184, 67, 62, 0.35), 0 0 0 1.5px rgba(255,255,255,0.4) inset;
  transform: translateY(-2px);
}

.analyze-button.themed-button .button-icon {
  font-size: 1.2em;
  animation: sparkleAnimation 2s infinite ease-in-out;
}

@keyframes sparkleAnimation {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2) rotate(15deg); opacity: 1; }
}

.loading-animation {
  margin-bottom: 15px; /* More space */
}

.heart-loader {
  width: 50px;
  height: 45px; /* Slightly adjusted for heart shape */
  position: relative;
  display: inline-block; /* To center it if text-align is center on parent */
}

.heart-loader::before,
.heart-loader::after {
  content: "";
  position: absolute;
  left: 25px; /* Half of width */
  top: 0;
  width: 25px; /* Half of width */
  height: 40px; /* Adjusted height */
  background: #E56D61; /* 主题红色 */
  border-radius: 25px 25px 0 0; /* Semi-circle top */
  transform: rotate(-45deg);
  transform-origin: 0 100%;
  animation: beat 1.2s infinite cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.heart-loader::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
  animation-delay: -0.6s; /* Offset animation for the other half */
}

@keyframes beat {
  0%, 20% { transform: scale(0.95) rotate(-45deg); } /* Start slightly smaller */
  10% {transform: scale(0.95) rotate(-45deg);} /* ensure smooth start */
  30% { transform: scale(1.1) rotate(-45deg); } /* Beat out */
  50% { transform: scale(0.95) rotate(-45deg); } /* Back to normal */
  70% { transform: scale(1.05) rotate(-45deg); } /* Slight beat */
  90%, 100% { transform: scale(0.95) rotate(-45deg); } /* Back to normal */
}
/* Ensure the rotation for the ::after pseudo-element is correct in animation */
@keyframes beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.heart-loader::after {
  /* ... existing styles for ::after ... */
  animation-name: beat-after; /* Use a separate animation for the second half if needed */
}
@keyframes beat-after {
 0%, 100% { transform: rotate(45deg) scale(1); }
 50% { transform: rotate(45deg) scale(1.3); }
}

.result-message {
  font-weight: 600;
  margin: 10px 0;
  font-size: 1.1em;
  color: #B8433E; /* 主题深红 */
  font-family: var(--font-family-sans-serif);
}

.arrow-indicator .scroll-prompt {
   font-size: 0.95em;
   color: #C74840; /* 主题次红色 */
   font-style: italic;
   margin-right: 8px;
}
.arrow-indicator .scroll-arrow {
  font-size: 1.2em;
  color: #D9544D; /* 主题红色 */
  animation: bounceArrow 1.5s infinite ease-in-out;
}

@keyframes bounceArrow {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* Responsive adjustments for the selection area */
@media (max-width: 768px) {
  .zodiac-selection {
    flex-direction: column; /* 在小屏幕上垂直堆叠 */
    align-items: center; /* 居中对齐 */
    gap: 20px;
  }
  .versus-container {
    padding-top: 10px; /* 减少垂直堆叠时的padding */
    order: 1; /* 将VS放在两个选择器之间，如果需要 */
  }
  .zodiac-compatibility-container .ZodiacSelector {
    /* 通过组件的props或更具体的类名来控制宽度，而不是直接组件名 */
    /* width: 90% !important; /* 确保在堆叠时选择器有足够宽度 */
    /* max-width: 380px; /* 保持最大宽度限制 */
  }
  .analyze-button {
    padding: 12px 30px;
    font-size: 1.1em;
  }
  .zodiac-title h3 {
    font-size: 2.2em;
  }
  .zodiac-title .subtitle {
    font-size: 1em;
  }
  .versus {
    font-size: 2.8em;
  }
}

</style> 