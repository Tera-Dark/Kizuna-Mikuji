<template>
  <div class="name-fortune-container" :class="{ 'has-result': isAnalysisComplete }">
    <div class="name-fortune-intro" v-if="!isAnalysisComplete">
      <h3 class="intro-title"><AppIcon name="scroll" :size="20" class="title-icon" /> 报上名来</h3>
      <p class="intro-text">
        名字里也藏着线头。写下来，本神明抽一抽，看看你的缘线往哪边偏。
        <span class="intro-note">（看个乐。别当真。）</span>
      </p>
      
      <div class="name-input-area">
        <input 
          type="text" 
          v-model="inputName" 
          placeholder="你的名字" 
          class="name-input"
          :maxlength="20"
          @keyup.enter="analyzeInputName"
        />
        <div class="input-counter">{{ inputName.length }}/20</div>
        
        <button 
          @click="analyzeInputName" 
          class="analyze-button" 
          :disabled="!inputName.trim()"
        >
          <AppIcon name="brush" :size="15" class="btn-icon" /> 让本神明看看
        </button>
      </div>
    </div>
    
    <div v-if="isAnalysisComplete" class="name-result-container reveal-parent" :class="{ visible: isAnalysisComplete }">
      <div class="result-header reveal-item">
        <h3 class="result-title">「{{ fortuneStore.userName }}」的缘线</h3>
        
        <div class="name-fortune-type">
          <span class="fortune-type-badge" :style="{ color: fortuneStore.fortuneTypeColor }">
            {{ fortuneStore.selectedFortune.type }}
          </span>
        </div>
      </div>
      
      <!-- 新增：显示顶层描述信息 -->
      <div class="name-fortune-general-description result-section reveal-item" v-if="fortuneStore.selectedFortune && fortuneStore.selectedFortune.description">
        <h4><span class="h-decorator"><AppIcon name="book" :size="15" /></span> 综合概述 <span class="h-decorator"><AppIcon name="book" :size="15" /></span></h4>
        <p>{{ fortuneStore.selectedFortune.description }}</p>
        <!-- 您也可以在这里添加对 selectedFortune.personality, luckNumber, luckColor 等的显示 -->
        <!-- 例如:
        <div class="personalized-summary">
          <p v-if="fortuneStore.selectedFortune.personality"><strong>主要个性:</strong> {{ fortuneStore.selectedFortune.personality }}</p>
          <p v-if="fortuneStore.selectedFortune.luckNumber"><strong>缘分指数:</strong> {{ fortuneStore.selectedFortune.luckNumber }}/100</p>
          <p v-if="fortuneStore.selectedFortune.luckColor"><strong>幸运颜色:</strong> {{ fortuneStore.selectedFortune.luckColor }}</p>
        </div>
        -->
      </div>
      
      <!-- 添加字符解读部分 -->
      <div class="name-character-analysis result-section reveal-item">
        <h4><span class="h-decorator"><AppIcon name="brush" :size="15" /></span> 字符解读 <span class="h-decorator"><AppIcon name="brush" :size="15" /></span></h4>
        <div class="character-container">
          <div 
            v-for="(char, index) in nameCharacters" 
            :key="index" 
            class="character-item"
            @mouseover="selectCharacter(index)"
            @mouseleave="selectedCharIndex = -1"
            :class="{ 'active': selectedCharIndex === index }"
          >
            <div class="character">{{ char }}</div>
            <div class="character-details" v-if="selectedCharIndex === index">
              <div class="detail-arrow"></div>
              <div class="detail-content">
                <div class="detail-title">{{ getCharacterTrait(char).trait }}</div>
                <div class="detail-description">{{ getCharacterTrait(char).description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="name-fortune-poem-container result-section reveal-item">
        <h4><span class="h-decorator"><AppIcon name="scroll" :size="15" /></span> 签诗启示 <span class="h-decorator"><AppIcon name="scroll" :size="15" /></span></h4>
        <div class="name-fortune-poem">
          <p v-html="fortuneStore.selectedFortune.poem"></p>
        </div>
      </div>
      
      <div class="name-fortune-interpretation result-section reveal-item">
        <h4><span class="h-decorator"><AppIcon name="eye" :size="15" /></span> 姓名解析 <span class="h-decorator"><AppIcon name="eye" :size="15" /></span></h4>
        <p>{{ fortuneStore.selectedFortune.interpretation }}</p>
      </div>
      
      <div class="name-personalized-result result-section reveal-item">
        <h4><span class="h-decorator"><AppIcon name="sparkles" :size="14" /></span> 个性化分析 <span class="h-decorator"><AppIcon name="sparkles" :size="14" /></span></h4>
        <div class="personalized-details">
          <div class="detail-item">
            <span class="detail-label">性格特质：</span>
            <span class="detail-value">{{ fortuneStore.selectedFortune.personalized.personality }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">缘分指数：</span>
            <div class="luck-meter">
              <div class="luck-bar">
                <div class="luck-value" :style="{ width: `${fortuneStore.selectedFortune.personalized.luckNumber}%` }"></div>
              </div>
              <span class="luck-number">{{ fortuneStore.selectedFortune.personalized.luckNumber }}/100</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-label">幸运颜色：</span>
            <span class="detail-value color-value">
              <span 
                class="color-dot" 
                :style="{ backgroundColor: fortuneStore.selectedFortune.personalized.luckColor }"
              ></span>
              {{ fortuneStore.selectedFortune.personalized.luckColor }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">幸运数字：</span>
            <span class="detail-value">{{ getLuckyNumber() }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">幸运方位：</span>
            <span class="detail-value">{{ getLuckyDirection() }}</span>
          </div>
        </div>
        <p class="personalized-description">{{ fortuneStore.selectedFortune.personalized.description }}</p>
        
        <!-- 添加五行分析 -->
        <div class="five-elements-analysis reveal-item">
          <h5><span class="h-decorator-small"><AppIcon name="sparkles" :size="14" /></span> 五行分析 <span class="h-decorator-small"><AppIcon name="sparkles" :size="14" /></span></h5>
          <div class="elements-chart">
            <div 
              v-for="(element, index) in getFiveElements()" 
              :key="index"
              class="element-bar"
            >
              <div class="element-name">{{ element.name }}</div>
              <div class="element-value-container">
                <div class="element-value" :style="{ height: `${element.value}%`, backgroundColor: element.color }"></div>
              </div>
              <div class="element-percentage">{{ element.value }}%</div>
            </div>
          </div>
          <p class="elements-description">{{ getFiveElementsAnalysis() }}</p>
        </div>
      </div>
      
      <div class="name-fortune-suggestion result-section reveal-item">
        <h4><span class="h-decorator"><AppIcon name="heart" :size="15" /></span> 缘分建议 <span class="h-decorator"><AppIcon name="heart" :size="15" /></span></h4>
        <p>{{ fortuneStore.selectedFortune.suggestion }}</p>
        
        <!-- 添加宜忌事项 -->
        <div class="fortune-tips reveal-item">
          <div class="fortune-do">
            <h5><span class="h-decorator-small"><AppIcon name="check" :size="12" /></span> 今日宜 <span class="h-decorator-small"><AppIcon name="check" :size="12" /></span></h5>
            <ul>
              <li v-for="(item, index) in getLuckyActivities()" :key="`do-${index}`">{{ item }}</li>
            </ul>
          </div>
          <div class="fortune-dont">
            <h5><span class="h-decorator-small"><AppIcon name="close" :size="12" /></span> 今日忌 <span class="h-decorator-small"><AppIcon name="close" :size="12" /></span></h5>
            <ul>
              <li v-for="(item, index) in getUnluckyActivities()" :key="`dont-${index}`">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="name-fortune-actions reveal-item">
        <button @click="resetAnalysis" class="reset-button styled-button"><AppIcon name="refresh" :size="14" class="btn-icon" /> 重新分析</button>
        <button @click="saveToHistory" class="save-button styled-button"><AppIcon name="check" :size="14" class="btn-icon" /> 保存结果</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppIcon from './icons/AppIcon.vue';
import { ref, computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';

const fortuneStore = useFortuneStore();
const inputName = ref('');
const isAnalysisComplete = ref(false);
const selectedCharIndex = ref(-1);

// 神秘符号

// 名字字符数组
const nameCharacters = computed(() => {
  if (!fortuneStore.userName) return [];
  return [...fortuneStore.userName];
});

// 分析姓名
function analyzeInputName() {
  if (!inputName.value.trim()) return;
  
  // 调用store中的姓名分析函数
  fortuneStore.analyzeNameFortune(inputName.value);
  isAnalysisComplete.value = true;
}

// 重置分析
function resetAnalysis() {
  inputName.value = '';
  fortuneStore.resetFortune();
  isAnalysisComplete.value = false;
}

// 保存到历史记录
function saveToHistory() {
  fortuneStore.saveToHistory();
}

// 选择字符
function selectCharacter(index) {
  selectedCharIndex.value = index;
}

// 获取字符特质
function getCharacterTrait(char) {
  const traits = {
    '王': { trait: '坚强威严', description: '有决断力，领导能力强，人缘好' },
    '李': { trait: '智慧聪颖', description: '心思活络，有才智，受人欣赏' },
    '张': { trait: '开拓进取', description: '有冒险精神，创造力强，勇于拼搏' },
    '刘': { trait: '温和包容', description: '为人随和，重情重义，善解人意' },
    '陈': { trait: '稳重踏实', description: '做事可靠，脚踏实地，深思熟虑' },
    '杨': { trait: '阳光乐观', description: '性格开朗，积极向上，充满活力' },
    '赵': { trait: '机智灵活', description: '反应敏捷，随机应变，善于交际' },
    '黄': { trait: '光明正直', description: '为人光明磊落，公正无私，忠诚可靠' },
    '周': { trait: '周全细致', description: '做事周到，关心他人，处事圆融' },
    '吴': { trait: '沉稳内敛', description: '深沉内敛，有智慧，不张扬' },
    '徐': { trait: '文雅高尚', description: '气质高雅，行事文明，追求品质' },
    '孙': { trait: '亲和温暖', description: '天性善良，待人诚恳，心地柔软' },
    '马': { trait: '奔放自由', description: '性格奔放，追求自由，活力四射' },
    '朱': { trait: '热情真挚', description: '感情丰富，真诚待人，热情如火' },
    '胡': { trait: '独立自主', description: '独立自主，有主见，不随波逐流' },
    '郭': { trait: '志向远大', description: '抱负不凡，目标明确，进取心强' },
    '何': { trait: '随和宽容', description: '心胸宽广，随和宜处，大度仁慈' },
    '林': { trait: '坚韧茂盛', description: '生命力旺盛，坚韧不拔，志向高远' },
    '高': { trait: '品德高尚', description: '志向高远，品格高尚，自尊自爱' },
    '罗': { trait: '缜密严谨', description: '思维缜密，做事严谨，不失分寸' },
  };
  
  // 默认特质
  const defaultTrait = { 
    trait: '神秘内涵', 
    description: '这个字蕴含着独特的能量，彰显个性魅力' 
  };
  
  return traits[char] || defaultTrait;
}

// 获取幸运数字
function getLuckyNumber() {
  // 基于姓名计算幸运数字
  const name = fortuneStore.userName;
  if (!name) return '7';
  
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  
  return (sum % 9) + 1; // 返回1-9之间的数字
}

// 获取幸运方位
function getLuckyDirection() {
  const directions = ['东', '南', '西', '北', '东南', '西南', '东北', '西北'];
  const name = fortuneStore.userName;
  if (!name) return '东南';
  
  const index = name.length % directions.length;
  return directions[index];
}

// 获取五行分析
function getFiveElements() {
  const name = fortuneStore.userName;
  if (!name) return [];
  
  // 基于姓名生成五行比例
  let metal = 0, wood = 0, water = 0, fire = 0, earth = 0;
  
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i);
    if (code % 5 === 0) metal += 20;
    else if (code % 5 === 1) wood += 20;
    else if (code % 5 === 2) water += 20;
    else if (code % 5 === 3) fire += 20;
    else earth += 20;
  }
  
  // 确保总和为100%
  const total = metal + wood + water + fire + earth;
  const factor = 100 / total;
  
  return [
    { name: '金', value: Math.round(metal * factor), color: '#B4883D' },
    { name: '木', value: Math.round(wood * factor), color: '#6E7F6A' },
    { name: '水', value: Math.round(water * factor), color: '#4E6B7A' },
    { name: '火', value: Math.round(fire * factor), color: '#BC3B2A' },
    { name: '土', value: Math.round(earth * factor), color: '#A97C34' }
  ];
}

// 获取五行分析结论
function getFiveElementsAnalysis() {
  const elements = getFiveElements();
  let dominant = elements[0];
  
  // 找出最强的五行
  for (let i = 1; i < elements.length; i++) {
    if (elements[i].value > dominant.value) {
      dominant = elements[i];
    }
  }
  
  const analysis = {
    '金': '你的名字五行属金较重，性格坚定，做事有原则，注重荣誉，适合从事金融、法律等需要条理性的工作。感情上追求稳定与承诺。',
    '木': '你的名字五行属木较重，性格温和，富有爱心，有同情心，适合从事教育、医疗等服务性工作。感情上富有包容心，懂得尊重与关怀。',
    '水': '你的名字五行属水较重，性格灵活，思维敏捷，有智慧，适合从事艺术、创意等需要灵感的工作。感情上追求自由与深度交流。',
    '火': '你的名字五行属火较重，性格热情，充满活力，乐观向上，适合从事销售、表演等需要魅力的工作。感情上热烈而真诚，富有激情。',
    '土': '你的名字五行属土较重，性格稳重，做事踏实，重视责任，适合从事管理、建筑等需要耐心的工作。感情上注重承诺与家庭。'
  };
  
  return analysis[dominant.name] || '你的名字五行均衡，各方面发展较为全面，适应力强，在不同领域都有发展潜力。';
}

// 获取宜做事项
function getLuckyActivities() {
  const activities = [
    '表白心意', '送礼物', '交友聚会', '旅行出游',
    '购物消费', '约会相亲', '学习进修', '签订合同',
    '观看电影', '沟通交流', '整理居家', '投资理财',
    '发表创意', '运动健身', '美食品尝', '冥想放松'
  ];
  
  // 随机选择3-5项
  const count = Math.floor(Math.random() * 3) + 3;
  const result = [];
  const indices = new Set();
  
  while (indices.size < count) {
    const index = Math.floor(Math.random() * activities.length);
    if (!indices.has(index)) {
      indices.add(index);
      result.push(activities[index]);
    }
  }
  
  return result;
}

// 获取忌做事项
function getUnluckyActivities() {
  const activities = [
    '冲动消费', '轻信他人', '草率决定', '言语冲突',
    '过度劳累', '情绪宣泄', '熬夜加班', '冒险行为',
    '过度饮食', '重大决策', '签署协议', '借贷行为',
    '激烈争论', '独处过久', '社交媒体', '沉迷游戏'
  ];
  
  // 随机选择2-4项
  const count = Math.floor(Math.random() * 3) + 2;
  const result = [];
  const indices = new Set();
  
  while (indices.size < count) {
    const index = Math.floor(Math.random() * activities.length);
    if (!indices.has(index)) {
      indices.add(index);
      result.push(activities[index]);
    }
  }
  
  return result;
}
</script>

<style scoped>
/* General Container */
.name-fortune-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 28px;
  background-color: var(--c-paper-2);
  background-image: radial-gradient(100% 90% at 50% 0%, rgba(255, 255, 255, 0.6), transparent 70%);
  border-radius: 6px;
  border: 1px solid var(--c-line);
  border-top: 3px solid var(--c-shu);
  box-shadow: var(--shadow-paper-sm);
  font-family: var(--font-body);
  margin: 24px auto;
  max-width: 700px;
}

/* Intro Section */
.name-fortune-intro {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 600px;
}

.intro-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-display);
  color: var(--c-ink);
  font-size: 1.55em;
  text-align: center;
  margin-bottom: 14px;
  letter-spacing: 0.16em;
}

.intro-title .title-icon {
  color: var(--c-shu);
}

.intro-text {
  font-size: 0.95em;
  color: var(--c-ink-soft);
  line-height: 1.9;
  text-align: center;
  margin-bottom: 25px;
}

.intro-note {
  display: block;
  font-size: 0.8em;
  color: var(--c-ink-faint);
  margin-top: 6px;
  opacity: 0.9;
}

.name-input-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.name-input {
  width: 100%;
  max-width: 380px;
  padding: 11px 16px;
  border-radius: 2px;
  border: 1px solid var(--c-line-strong);
  background-color: #FFFCF6;
  font-size: 1.05em;
  color: var(--c-ink);
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.name-input::placeholder {
  color: var(--c-ink-faint);
  letter-spacing: 0.08em;
}

.name-input:focus {
  outline: none;
  border-color: var(--c-shu);
  box-shadow: 0 0 0 3px var(--c-shu-wash);
}

.input-counter {
  font-size: 0.78em;
  color: var(--c-ink-faint);
  font-variant-numeric: tabular-nums;
  width: 100%;
  max-width: 380px;
  text-align: right;
  padding-right: 10px;
  margin-top: -10px; /* Pull it closer to input */
}

.analyze-button {
  padding: 11px 28px;
  font-size: 1em;
  color: #FFF8F0;
  background: var(--c-shu);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.1em;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.18) inset, 0 3px 8px rgba(143, 39, 28, 0.16);
  display: inline-flex;
  align-items: center;
  gap: 8px; /* Space between icon and text */
}

.analyze-button:hover:not(:disabled) {
  background: var(--c-shu-deep);
  transform: translateY(-1px);
}

.analyze-button:active:not(:disabled) {
  transform: translateY(0);
}

.analyze-button:disabled {
  background: var(--c-paper-3);
  color: var(--c-ink-faint);
  cursor: not-allowed;
  box-shadow: none;
  border: 1px solid var(--c-line);
}

.analyze-button .btn-icon {
  font-size: 1.2em; /* Adjust icon size if needed */
  line-height: 1; /* Prevent extra spacing due to icon */
}

/* Result Section */
.name-fortune-container.has-result {
  max-width: 760px;
  padding: 0;
  background: none;
  border: 0;
  box-shadow: none;
}

.name-result-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  background: none;
  border: 0;
}

.result-header {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 14px;
  text-align: left;
  margin-bottom: 6px;
}

.result-title {
  margin: 0;
  font-size: 1.5em;
  color: var(--c-ink);
  font-family: var(--font-display);
  letter-spacing: 0.12em;
}

.fortune-type-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 1px;
  border: 1px solid currentColor;
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 0.14em;
}

/* Common style for section containers in result area */
.result-section {
  position: relative;
  margin-top: 22px;
  padding: 22px 0 0;
  background: none;
  border: 0;
  border-top: 1px solid var(--c-line);
}

/* Common style for section titles (h4, h5) in result area */
.name-result-container h4,
.name-result-container h5 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  padding: 0;
  border: 0;
  font-family: var(--font-display);
  color: var(--c-ink);
  text-align: left;
}

.name-result-container h4 {
  font-size: 1.15em;
  letter-spacing: 0.06em;
}

.name-result-container h4 > :last-child,
.name-result-container h5 > :last-child {
  display: none;
}
.name-result-container h5 {
  font-size: 1.05em;
  color: var(--c-ink-soft);
  margin-top: 15px; /* Add some top margin for h5 within sections */
}

.h-decorator, .h-decorator-small {
  color: var(--c-shu-soft);
  font-size: 0.9em; /* Adjust as needed */
}
.h-decorator-small {
  font-size: 0.8em;
}

/* Character Analysis Section */
.character-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px; /* Adjusted gap */
  margin-bottom: 10px;
}

.character-item {
  padding: 8px 12px;
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  background-color: #FFFCF6;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; 
  min-width: 45px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.character-item:hover, .character-item.active {
  background-color: var(--c-shu-wash);
  border-color: var(--c-shu);
}

.character {
  font-size: 1.7em;
  font-weight: bold;
  color: var(--c-shu);
  font-family: var(--font-display);
}

.character-details {
  position: absolute;
  bottom: 100%; 
  left: 50%;
  transform: translateX(-50%) translateY(-8px); 
  background-color: var(--c-paper);
  padding: 10px 15px;
  border-radius: 2px;
  box-shadow: 0 6px 18px rgba(48, 26, 20, 0.16);
  z-index: 10;
  width: max-content; 
  max-width: 220px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
  border: 1px solid var(--c-line-strong);
}

.character-item.active .character-details {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-12px); /* Slightly more offset when active */
}

.detail-arrow {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid var(--c-paper);
  position: absolute;
  bottom: -7px; 
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.detail-content .detail-title {
  font-weight: 600;
  color: var(--c-ink);
  margin-bottom: 5px;
  font-size: 1em;
  font-family: var(--font-display);
}
.detail-content .detail-description {
  font-size: 0.85em;
  color: var(--c-ink-soft);
  line-height: 1.5;
}


/* Fortune Poem Section */
.name-fortune-poem-container {
  /* background-image: url('/images/washi-texture-light.png'); /* Example washi texture */ 
  /* background-size: cover; */
}

.name-fortune-poem p {
  font-family: var(--font-display);
  font-size: 1.28em;
  line-height: 2;
  color: var(--c-ink);
  text-align: center;
  white-space: pre-wrap; 
  padding: 10px;
}
.name-fortune-poem p::first-line {
  letter-spacing: 1px; /* Slight spacing for emphasis */
}

/* Interpretation & Personalized Analysis */
.name-fortune-interpretation p,
.personalized-description {
  font-size: 1em;
  line-height: 1.8;
  color: var(--c-ink-soft);
  text-align: justify;
  padding: 0 5px; /* Slight horizontal padding */
}

.personalized-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); /* Adjusted minmax */
  gap: 15px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0 0;
  border: 0;
  border-top: 1px solid var(--c-line);
  background: none;
}

.detail-label {
  font-weight: 600;
  color: var(--c-shu);
  font-size: 0.82em;
  letter-spacing: 0.08em;
  font-family: var(--font-ui);
}

.detail-value {
  color: var(--c-ink-soft);
  font-size: 1em;
}

.color-value {
  display: flex;
  align-items: center;
}
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1.5px solid rgba(0,0,0,0.15);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.luck-meter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}
.luck-bar {
  flex-grow: 1; /* Allow bar to take available space */
  height: 10px;
  background-color: rgba(188, 59, 42, 0.08);
  border-radius: 1px;
  overflow: hidden;
  border: 1px solid var(--c-line);
}
.luck-value {
  height: 100%;
  background: var(--c-shu);
  transition: width 0.9s cubic-bezier(0.25, 0.1, 0.25, 1); /* Smoother, slightly slower transition */
}
.luck-number {
  font-size: 0.9em;
  color: var(--c-ink);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* Five Elements Analysis */
.five-elements-analysis {
  margin-top: 25px;
}

.elements-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 160px; 
  background-color: rgba(255, 254, 250, 0.55);
  padding: 20px 15px;
  border-radius: 2px;
  border: 1px solid var(--c-line);
  margin-bottom: 15px;
}

.element-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16%; 
  text-align: center;
}
.element-name {
  font-size: 0.85em;
  color: var(--c-ink-soft);
  margin-bottom: 6px;
  font-weight: 500;
}
.element-value-container {
  width: 35px; 
  height: 100px; 
  background-color: rgba(188, 59, 42, 0.06);
  border-radius: 1px 1px 0 0;
  display: flex;
  align-items: flex-end; 
  border: 1px solid var(--c-line);
  border-bottom: none;
}
.element-value {
  width: 100%;
  border-radius: 1px 1px 0 0;
  transition: height 0.9s cubic-bezier(0.25, 0.1, 0.25, 1);
  /* Dynamic background-color */
}
/* New Five Elements Colors (Soft & Thematic) */
/* These will be set dynamically, but as a reference: */
/* Gold: #E6C27A (Soft Gold) */
/* Wood: #A4D4AE (Soft Green) */
/* Water: #A0D2DB (Soft Blue) */
/* Fire: #E57373 (Soft Red) */
/* Earth: #D8AB7E (Soft Brown) */

.element-percentage {
  font-size: 0.82em;
  color: var(--c-ink-soft);
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
.elements-description {
  font-size: 0.95em;
  color: var(--c-ink-soft);
  line-height: 1.8;
  text-align: justify;
  margin-top: 10px;
}

/* Fortune Suggestion & Tips */
.fortune-tips {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
}

.fortune-do, .fortune-dont {
  flex: 1;
  padding: 18px;
  border-radius: 2px;
  background-color: rgba(255, 254, 250, 0.6);
  border: 1px solid var(--c-line);
}

.fortune-do {
  border-left: 2px solid var(--c-gold-soft);
}
.fortune-dont {
  border-left: 2px solid var(--c-shu-soft);
}

.fortune-tips h5 {
  /* font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif)); */ /* Already applied */
  margin-bottom: 12px;
  /* text-align: center; */ /* Already applied */
}
.fortune-do h5 { color: var(--c-gold); }
.fortune-dont h5 { color: var(--c-shu); }

.fortune-tips ul {
  list-style: none;
  padding-left: 0;
}
.fortune-tips li {
  font-size: 0.9em;
  color: var(--c-ink-soft);
  padding: 6px 0;
  border-bottom: 1px dotted var(--c-line);
  display: flex;
  align-items: center;
}
.fortune-tips li:last-child {
  border-bottom: none;
}

.fortune-tips li::before {
  content: '';
  width: 5px;
  height: 5px;
  margin-right: 10px;
  border-radius: 50%;
  background: var(--c-gold);
  flex-shrink: 0;
}
.fortune-dont li::before {
  content: '';
  width: 5px;
  height: 5px;
  margin-right: 10px;
  border-radius: 50%;
  background: var(--c-shu-soft);
  flex-shrink: 0;
}


/* Action Buttons */
.name-fortune-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
}

.styled-button { /* Unified button class */
  padding: 10px 25px;
  font-size: 1em;
  color: #FFF8F0;
  background: var(--c-shu);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.1em;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.18) inset, 0 3px 8px rgba(143, 39, 28, 0.16);
  display: inline-flex;
  align-items: center;
  gap: 8px; 
}

.styled-button:hover:not(:disabled) {
  background: var(--c-shu-deep);
  transform: translateY(-1px);
}

.styled-button:active:not(:disabled) {
  transform: translateY(0);
}

.styled-button:disabled {
  background: var(--c-paper-3);
  color: var(--c-ink-faint);
  cursor: not-allowed;
  box-shadow: none;
  border: 1px solid var(--c-line);
}

.reset-button {
  /* Specific overrides if needed, for now uses styled-button */
}

.save-button {
  background: transparent;
  color: var(--c-shu);
  border: 1px solid var(--c-line-strong);
  box-shadow: none;
}
.save-button:hover:not(:disabled) {
  background: var(--c-shu-wash);
  border-color: var(--c-shu);
}


/* Responsive adjustments - existing */
@media (max-width: 768px) {
  .name-fortune-container {
    padding: 20px;
  }
  .intro-title {
    font-size: 1.8em; /* Adjusted */
  }
  .result-title {
    font-size: 1.6em; /* Adjusted */
  }
  .name-result-container h4 {
    font-size: 1.25em; /* Adjusted */
  }
   .name-result-container h5 {
    font-size: 1.1em; /* Adjusted */
  }
  .fortune-tips {
    flex-direction: column;
  }
  .elements-chart {
    height: auto; 
    flex-wrap: wrap; 
  }
  .element-bar {
    width: 45%; /* Wider for 2 columns on mobile */
    margin-bottom: 15px;
  }
}

/* Animation for result sections */
.reveal-parent .reveal-item {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-parent.visible .reveal-item {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered delays for reveal items in NameFortune */
.reveal-parent.visible .result-header {
  transition-delay: 0.1s;
}
.reveal-parent.visible .name-character-analysis {
  transition-delay: 0.2s;
}
.reveal-parent.visible .name-fortune-poem-container {
  transition-delay: 0.3s;
}
.reveal-parent.visible .name-fortune-interpretation {
  transition-delay: 0.4s;
}
.reveal-parent.visible .name-personalized-result {
  transition-delay: 0.5s;
}
.reveal-parent.visible .name-personalized-result .five-elements-analysis {
  transition-delay: 0.6s; /* Ensure this is relative to parent or a direct child for simple staggering */
}
.reveal-parent.visible .name-fortune-suggestion {
  transition-delay: 0.7s;
}
.reveal-parent.visible .name-fortune-suggestion .fortune-tips {
  transition-delay: 0.8s;
}
.reveal-parent.visible .name-fortune-actions {
  transition-delay: 0.9s;
}

</style> 