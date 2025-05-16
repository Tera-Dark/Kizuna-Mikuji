<template>
  <div class="zodiac-compatibility-container">
    <div class="zodiac-title">
      <h3>星座配对</h3>
      <p class="subtitle">看看你们的星座是否相配</p>
    </div>

    <!-- 星座选择区域 -->
    <div class="zodiac-selection">
      <div class="zodiac-selection-side">
        <h4>第一个星座</h4>
        <div class="zodiac-grid">
          <div
            v-for="(data, sign) in zodiacData"
            :key="`first-${sign}`"
            class="zodiac-item"
            :class="{ active: selectedSign1 === sign }"
            @click="selectSign1(sign)"
          >
            <span class="zodiac-icon">{{ getZodiacEmoji(sign) }}</span>
            <span class="zodiac-name">{{ data.name }}</span>
            <span class="zodiac-dates">{{ data.dates }}</span>
          </div>
        </div>
        
        <!-- 星座详情 -->
        <div class="zodiac-detail" v-if="selectedSign1">
          <h5>{{ zodiacData[selectedSign1].name }}特质</h5>
          <div class="zodiac-traits">
            <div class="trait-item">
              <span class="trait-label">元素：</span>
              <span class="trait-value">{{ getElementName(zodiacData[selectedSign1].element) }}</span>
            </div>
            <div class="trait-item">
              <span class="trait-label">性格：</span>
              <span class="trait-value">{{ getZodiacPersonality(selectedSign1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="versus-container">
        <div class="versus">VS</div>
        <div class="compatibility-indicator" v-if="selectedSign1 && selectedSign2">
          <div class="compat-arrow" :class="getCompatibilityClass()"></div>
        </div>
      </div>

      <div class="zodiac-selection-side">
        <h4>第二个星座</h4>
        <div class="zodiac-grid">
          <div
            v-for="(data, sign) in zodiacData"
            :key="`second-${sign}`"
            class="zodiac-item"
            :class="{ active: selectedSign2 === sign }"
            @click="selectSign2(sign)"
          >
            <span class="zodiac-icon">{{ getZodiacEmoji(sign) }}</span>
            <span class="zodiac-name">{{ data.name }}</span>
            <span class="zodiac-dates">{{ data.dates }}</span>
          </div>
        </div>
        
        <!-- 星座详情 -->
        <div class="zodiac-detail" v-if="selectedSign2">
          <h5>{{ zodiacData[selectedSign2].name }}特质</h5>
          <div class="zodiac-traits">
            <div class="trait-item">
              <span class="trait-label">元素：</span>
              <span class="trait-value">{{ getElementName(zodiacData[selectedSign2].element) }}</span>
            </div>
            <div class="trait-item">
              <span class="trait-label">性格：</span>
              <span class="trait-value">{{ getZodiacPersonality(selectedSign2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 即时相容性提示 -->
    <div class="quick-compatibility" v-if="selectedSign1 && selectedSign2">
      <div class="compatibility-meter">
        <div class="meter-background"></div>
        <div class="meter-fill" :style="{ width: `${getQuickCompatibilityScore()}%` }"></div>
      </div>
      <div class="compatibility-text">{{ getQuickCompatibilityText() }}</div>
    </div>

    <!-- 分析按钮 -->
    <div class="analyze-button-container">
      <button
        class="analyze-button"
        :disabled="!selectedSign1 || !selectedSign2"
        @click="analyzeCompatibility"
      >
        <span>解析星座缘分</span>
      </button>
      <div class="result-hint" v-if="showResultHint">
        <div class="arrow-down"></div>
        <span>结果已生成，请查看下方！</span>
      </div>
    </div>

    <!-- 添加一个结果状态指示器，在生成结果后显示 -->
    <div class="result-indicator" v-if="resultGenerated">
      <div class="loading-animation">
        <span></span><span></span><span></span>
      </div>
      <p class="result-message">星座缘分解析已完成</p>
      <div class="arrow-indicator">
        <span>👇 结果在下方 👇</span>
      </div>
    </div>

    <!-- 星座解释 -->
    <div class="zodiac-explanation">
      <h4>星座元素相性</h4>
      <div class="elements-grid">
        <div class="element-item" v-for="(desc, element) in elementDescriptions" :key="element">
          <div class="element-icon" :class="element">{{ getElementEmoji(element) }}</div>
          <div class="element-name">{{ getElementName(element) }}</div>
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useFortuneStore } from '@/stores/FortuneStore';

const fortuneStore = useFortuneStore();
const { zodiacData, analyzeZodiacCompatibility } = fortuneStore;

const selectedSign1 = ref('');
const selectedSign2 = ref('');
const showResultHint = ref(false);
const resultGenerated = ref(false);

// 元素描述
const elementDescriptions = {
  fire: '热情、活力、创造力、直觉',
  earth: '务实、稳定、忠诚、耐心',
  air: '思想、沟通、社交、灵活',
  water: '情感、敏感、同理心、直觉'
};

// 元素相性表
const elementCompat = {
  fire: { fire: 90, earth: 60, air: 80, water: 40 },
  earth: { fire: 60, earth: 85, air: 50, water: 90 },
  air: { fire: 80, earth: 50, air: 85, water: 70 },
  water: { fire: 40, earth: 90, air: 70, water: 95 }
};

// 选择第一个星座
function selectSign1(sign) {
  selectedSign1.value = sign;
}

// 选择第二个星座
function selectSign2(sign) {
  selectedSign2.value = sign;
}

// 根据星座获取对应的emoji
function getZodiacEmoji(sign) {
  const emojiMap = {
    aries: '♈',
    taurus: '♉',
    gemini: '♊',
    cancer: '♋',
    leo: '♌',
    virgo: '♍',
    libra: '♎',
    scorpio: '♏',
    sagittarius: '♐',
    capricorn: '♑',
    aquarius: '♒',
    pisces: '♓'
  };
  return emojiMap[sign] || '⭐';
}

// 获取元素对应的emoji
function getElementEmoji(element) {
  const emojiMap = {
    fire: '🔥',
    earth: '🌱',
    air: '💨',
    water: '💧'
  };
  return emojiMap[element] || '✨';
}

// 获取元素的中文名称
function getElementName(element) {
  const nameMap = {
    fire: '火象',
    earth: '土象',
    air: '风象',
    water: '水象'
  };
  return nameMap[element] || '未知';
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
function getQuickCompatibilityScore() {
  if (!selectedSign1.value || !selectedSign2.value) return 0;
  
  const element1 = zodiacData[selectedSign1.value].element;
  const element2 = zodiacData[selectedSign2.value].element;
  
  return elementCompat[element1][element2];
}

// 获取兼容性评价文本
function getQuickCompatibilityText() {
  const score = getQuickCompatibilityScore();
  
  if (score >= 90) return '非常契合';
  if (score >= 80) return '相当合拍';
  if (score >= 70) return '颇为般配';
  if (score >= 60) return '还算和谐';
  if (score >= 50) return '中等相容';
  return '需要包容';
}

// 获取兼容性CSS类
function getCompatibilityClass() {
  const score = getQuickCompatibilityScore();
  
  if (score >= 80) return 'high-compat';
  if (score >= 60) return 'medium-compat';
  return 'low-compat';
}

// 分析星座配对
function analyzeCompatibility() {
  if (selectedSign1.value && selectedSign2.value) {
    resultGenerated.value = false; // 重置结果状态
    
    console.log('开始分析星座配对...');
    console.log('selectedSign1:', selectedSign1.value);
    console.log('selectedSign2:', selectedSign2.value);
    
    // 播放占卜开始音效
    try {
      const audio = new Audio('/sounds/wind-chime.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('音效播放失败'));
    } catch (error) {
      console.log('音效创建失败');
    }

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
</script>

<style scoped>
.zodiac-compatibility-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.zodiac-title {
  margin-bottom: 25px;
}

.zodiac-title h3 {
  font-size: 1.8em;
  color: #8B4513;
  margin-bottom: 5px;
  font-family: 'STXingkai', 'KaiTi', serif;
}

.subtitle {
  font-size: 1em;
  color: #A67C52;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.zodiac-selection {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.zodiac-selection-side {
  flex: 1;
  max-width: 45%;
}

.zodiac-selection-side h4 {
  font-size: 1.2em;
  color: #8B4513;
  margin-bottom: 15px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.versus-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 65px;
}

.versus {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: #C0392B;
  font-weight: bold;
  padding: 0 10px;
  margin-bottom: 15px;
}

.compatibility-indicator {
  margin-top: 20px;
}

.compat-arrow {
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
  animation: pulse 2s infinite;
}

.high-compat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2327ae60' d='M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5C2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.03L12,21.35Z'/%3E%3C/svg%3E");
}

.medium-compat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23f39c12' d='M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5C2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.03L12,21.35Z'/%3E%3C/svg%3E");
}

.low-compat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e74c3c' d='M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5C2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.03L12,21.35Z'/%3E%3C/svg%3E");
  opacity: 0.7;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.zodiac-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  background-color: #FFF5EB;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.zodiac-item:hover {
  background-color: #FFE8D1;
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.zodiac-item.active {
  background-color: #FFF0DB;
  border-color: #E74C3C;
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.zodiac-icon {
  font-size: 1.5em;
  margin-bottom: 5px;
}

.zodiac-name {
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 3px;
}

.zodiac-dates {
  font-size: 0.7em;
  color: #777;
}

/* 星座详情样式 */
.zodiac-detail {
  margin-top: 20px;
  padding: 15px;
  background-color: #FFF8E7;
  border-radius: 10px;
  border: 1px dashed #D4A355;
  animation: fadeIn 0.5s ease;
}

.zodiac-detail h5 {
  font-size: 1.1em;
  color: #8B4513;
  margin-bottom: 10px;
  text-align: center;
}

.zodiac-traits {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trait-item {
  display: flex;
  align-items: center;
}

.trait-label {
  font-weight: bold;
  width: 60px;
  text-align: right;
  margin-right: 10px;
  color: #8B4513;
}

.trait-value {
  flex: 1;
  text-align: left;
  color: #555;
}

/* 即时相容性提示 */
.quick-compatibility {
  margin: 20px auto;
  max-width: 500px;
  padding: 15px;
  background-color: #FFF8E7;
  border-radius: 10px;
  animation: fadeIn 0.5s ease;
}

.compatibility-meter {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
}

.meter-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #e74c3c, #f39c12, #27ae60);
  opacity: 0.3;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(to right, #e74c3c, #f39c12, #27ae60);
  transition: width 0.8s ease-in-out;
}

.compatibility-text {
  font-size: 1.1em;
  font-weight: bold;
  color: #8B4513;
}

.analyze-button-container {
  margin: 25px 0;
  position: relative;
}

.analyze-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #1abc9c, #16a085);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(22, 160, 133, 0.3);
}

.analyze-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(22, 160, 133, 0.4);
}

.analyze-button:disabled {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  cursor: not-allowed;
  box-shadow: none;
}

.result-hint {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(231, 76, 60, 0.9);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9em;
  animation: bounce 2s infinite;
  z-index: 5;
  white-space: nowrap;
}

.arrow-down {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(231, 76, 60, 0.9);
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(5px); }
}

.result-indicator {
  margin: 20px auto;
  padding: 15px;
  background-color: #FFF8E7;
  border-radius: 10px;
  border: 1px dashed #E74C3C;
  max-width: 500px;
  animation: fadeIn 0.5s ease;
}

.loading-animation {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.loading-animation span {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #E74C3C;
  border-radius: 50%;
  animation: pulse 1s infinite ease-in-out;
}

.loading-animation span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-animation span:nth-child(3) {
  animation-delay: 0.4s;
}

.result-message {
  font-weight: bold;
  color: #E74C3C;
  margin-bottom: 10px;
}

.arrow-indicator {
  font-size: 1.1em;
  color: #E74C3C;
  animation: bounce 2s infinite;
}

.zodiac-explanation {
  margin-top: 30px;
  padding: 20px;
  background-color: #FFF8E7;
  border-radius: 10px;
  border: 1px solid rgba(139, 69, 19, 0.2);
  text-align: left;
}

.zodiac-explanation h4 {
  color: #8B4513;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1.2em;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.element-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background-color: #FFF;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.element-icon {
  font-size: 2em;
  margin-bottom: 5px;
}

.element-icon.fire { color: #E74C3C; }
.element-icon.earth { color: #27AE60; }
.element-icon.air { color: #3498DB; }
.element-icon.water { color: #9B59B6; }

.element-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.element-desc {
  font-size: 0.8em;
  color: #555;
  text-align: center;
}

.zodiac-explanation p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #555;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 媒体查询 */
@media (max-width: 768px) {
  .zodiac-selection {
    flex-direction: column;
    align-items: center;
  }
  
  .zodiac-selection-side {
    max-width: 100%;
    margin-bottom: 20px;
  }
  
  .versus-container {
    margin: 10px 0;
  }
  
  .elements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 