<template>
  <div class="name-fortune-container">
    <div class="name-fortune-intro" v-if="!isAnalysisComplete">
      <h3 class="intro-title">&#x1F4DC; 姓名缘分解析</h3>
      <p class="intro-text">
        请输入您的姓名，我们将根据传统姓名学为您解析隐藏在名字中的缘分密码。
        <span class="intro-note">（仅供娱乐，请勿当真）</span>
      </p>
      
      <div class="name-input-area">
        <input 
          type="text" 
          v-model="inputName" 
          placeholder="请输入您的姓名" 
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
          <span class="btn-icon">&#x1F4DC;</span> 解析姓名
        </button>
      </div>
      
      <!-- 添加玄学元素装饰 -->
      <div class="mystic-elements">
        <div class="mystic-symbol" v-for="(symbol, index) in mysticSymbols" :key="index">
          {{ symbol }}
        </div>
      </div>
    </div>
    
    <div v-if="isAnalysisComplete" class="name-result-container reveal-parent" :class="{ visible: isAnalysisComplete }">
      <div class="result-header reveal-item">
        <h3 class="result-title">「{{ fortuneStore.userName }}」的姓名缘分</h3>
        
        <div class="name-fortune-type">
          <span class="fortune-type-badge" :style="{ backgroundColor: fortuneStore.fortuneTypeColor }">
            {{ fortuneStore.selectedFortune.type }}
          </span>
        </div>
      </div>
      
      <!-- 新增：显示顶层描述信息 -->
      <div class="name-fortune-general-description result-section reveal-item" v-if="fortuneStore.selectedFortune && fortuneStore.selectedFortune.description">
        <h4><span class="h-decorator">&#x1F4D6;</span> 综合概述 <span class="h-decorator">&#x1F4D6;</span></h4>
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
        <h4><span class="h-decorator">&#x1F38E;</span> 字符解读 <span class="h-decorator">&#x1F38E;</span></h4>
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
        <h4><span class="h-decorator">&#x1F4DC;</span> 签诗启示 <span class="h-decorator">&#x1F4DC;</span></h4>
        <div class="name-fortune-poem">
          <p v-html="fortuneStore.selectedFortune.poem"></p>
        </div>
      </div>
      
      <div class="name-fortune-interpretation result-section reveal-item">
        <h4><span class="h-decorator">&#x1F50D;</span> 姓名解析 <span class="h-decorator">&#x1F50D;</span></h4>
        <p>{{ fortuneStore.selectedFortune.interpretation }}</p>
      </div>
      
      <div class="name-personalized-result result-section reveal-item">
        <h4><span class="h-decorator">&#x2728;</span> 个性化分析 <span class="h-decorator">&#x2728;</span></h4>
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
          <h5><span class="h-decorator-small">&#x1F300;</span> 五行分析 <span class="h-decorator-small">&#x1F300;</span></h5>
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
        <h4><span class="h-decorator">&#x1F48C;</span> 缘分建议 <span class="h-decorator">&#x1F48C;</span></h4>
        <p>{{ fortuneStore.selectedFortune.suggestion }}</p>
        
        <!-- 添加宜忌事项 -->
        <div class="fortune-tips reveal-item">
          <div class="fortune-do">
            <h5><span class="h-decorator-small">&#x2705;</span> 今日宜 <span class="h-decorator-small">&#x2705;</span></h5>
            <ul>
              <li v-for="(item, index) in getLuckyActivities()" :key="`do-${index}`">{{ item }}</li>
            </ul>
          </div>
          <div class="fortune-dont">
            <h5><span class="h-decorator-small">&#x274C;</span> 今日忌 <span class="h-decorator-small">&#x274C;</span></h5>
            <ul>
              <li v-for="(item, index) in getUnluckyActivities()" :key="`dont-${index}`">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="name-fortune-actions reveal-item">
        <button @click="resetAnalysis" class="reset-button styled-button"><span class="btn-icon">&#x1F504;</span> 重新分析</button>
        <button @click="saveToHistory" class="save-button styled-button"><span class="btn-icon">&#x1F4BE;</span> 保存结果</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';

const fortuneStore = useFortuneStore();
const inputName = ref('');
const isAnalysisComplete = ref(false);
const selectedCharIndex = ref(-1);

// 神秘符号
const mysticSymbols = ['✧', '✦', '❂', '☯', '☽', '☾', '⚝', '✴', '⚚', '⚛'];

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
    { name: '金', value: Math.round(metal * factor), color: '#FFD700' },
    { name: '木', value: Math.round(wood * factor), color: '#2ECC71' },
    { name: '水', value: Math.round(water * factor), color: '#3498DB' },
    { name: '火', value: Math.round(fire * factor), color: '#E74C3C' },
    { name: '土', value: Math.round(earth * factor), color: '#E67E22' }
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
    '金': '您的名字五行属金较重，性格坚定，做事有原则，注重荣誉，适合从事金融、法律等需要条理性的工作。感情上追求稳定与承诺。',
    '木': '您的名字五行属木较重，性格温和，富有爱心，有同情心，适合从事教育、医疗等服务性工作。感情上富有包容心，懂得尊重与关怀。',
    '水': '您的名字五行属水较重，性格灵活，思维敏捷，有智慧，适合从事艺术、创意等需要灵感的工作。感情上追求自由与深度交流。',
    '火': '您的名字五行属火较重，性格热情，充满活力，乐观向上，适合从事销售、表演等需要魅力的工作。感情上热烈而真诚，富有激情。',
    '土': '您的名字五行属土较重，性格稳重，做事踏实，重视责任，适合从事管理、建筑等需要耐心的工作。感情上注重承诺与家庭。'
  };
  
  return analysis[dominant.name] || '您的名字五行均衡，各方面发展较为全面，适应力强，在不同领域都有发展潜力。';
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
  padding: 25px;
  background-color: rgba(255, 245, 245, 0.85); /* Light pinkish background */
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(217, 84, 77, 0.12), 0 0 0 1.5px rgba(229, 109, 97, 0.3);
  border: 1px solid transparent; /* Ensure box-shadow border is visible */
  font-family: var(--font-family-sans-serif);
  margin: 20px auto;
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
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  color: #B8433E; /* Main theme red */
  font-size: 2em;
  text-align: center;
  margin-bottom: 15px;
  letter-spacing: 1.5px;
}

.intro-text {
  font-size: 0.95em;
  color: #C74840; /* Darker theme pink/red */
  line-height: 1.7;
  text-align: center;
  margin-bottom: 25px;
}

.intro-note {
  display: block;
  font-size: 0.8em;
  color: #D9544D; /* Lighter theme red */
  margin-top: 8px;
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
  padding: 12px 18px;
  border-radius: 25px; /* More rounded */
  border: 1.5px solid rgba(229, 109, 97, 0.5); /* Theme color border */
  background-color: #FFFDFB; /* Slightly off-white */
  font-size: 1em;
  color: #5D4037; /* Dark brown text */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.name-input::placeholder {
  color: rgba(184, 67, 62, 0.5); /* Softer placeholder color */
  font-style: italic;
}

.name-input:focus {
  outline: none;
  border-color: #D9544D; /* Stronger theme red on focus */
  box-shadow: 0 0 0 3px rgba(229, 109, 97, 0.25); /* Theme glow */
}

.input-counter {
  font-size: 0.8em;
  color: #C74840;
  width: 100%;
  max-width: 380px;
  text-align: right;
  padding-right: 10px;
  margin-top: -10px; /* Pull it closer to input */
}

.analyze-button {
  padding: 10px 25px;
  font-size: 1.1em;
  color: white;
  background: linear-gradient(to bottom, #E56D61, #D9544D); /* Theme gradient */
  border: none;
  border-radius: 25px; /* Consistent rounding */
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family-sans-serif);
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: 0 3px 8px rgba(184, 67, 62, 0.3);
  border-bottom: 2px solid #B8433E; /* Darker bottom border for depth */
  display: inline-flex;
  align-items: center;
  gap: 8px; /* Space between icon and text */
}

.analyze-button:hover:not(:disabled) {
  background: linear-gradient(to bottom, #D9544D, #C74840);
  box-shadow: 0 5px 12px rgba(184, 67, 62, 0.4);
  transform: translateY(-2px);
}

.analyze-button:active:not(:disabled) {
  transform: translateY(0px);
  box-shadow: 0 2px 5px rgba(184, 67, 62, 0.3);
}

.analyze-button:disabled {
  background: #E0E0E0; /* Greyed out for disabled state */
  color: #A0A0A0;
  cursor: not-allowed;
  box-shadow: none;
  border-bottom: 2px solid #BDBDBD;
}

.analyze-button .btn-icon {
  font-size: 1.2em; /* Adjust icon size if needed */
  line-height: 1; /* Prevent extra spacing due to icon */
}

.mystic-elements {
  display: flex;
  flex-wrap: wrap; /* Allow symbols to wrap */
  justify-content: center;
  gap: 10px; /* Spacing between symbols */
  margin-top: 20px;
  opacity: 0.6; /* Make them more subtle */
}

.mystic-symbol {
  font-size: 0.9em; /* Slightly smaller */
  color: #D9544D; /* Theme color */
  padding: 3px 6px;
  /* background-color: rgba(255, 235, 235, 0.3); // Optional subtle background */
  /* border-radius: 50%; // Could be circles */
  transition: transform 0.3s ease;
}

.mystic-symbol:hover {
  transform: scale(1.2) rotate(10deg);
  color: #B8433E;
}

/* Result Section */
.name-result-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Space between result sections */
  padding: 20px;
  background-color: rgba(255, 250, 248, 0.9); /* Slightly different bg for results */
  border-radius: 15px;
  border: 1px solid rgba(229, 109, 97, 0.25);
  /* Animation parent for reveal items */
}

.result-header {
  text-align: center;
  margin-bottom: 5px; /* Reduced margin */
}

.result-title {
  font-size: 1.8em; /* Adjusted size */
  color: #B8433E; /* Theme red */
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.fortune-type-badge {
  display: inline-block;
  padding: 7px 18px;
  border-radius: 20px; 
  font-size: 0.95em;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.15);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Common style for section containers in result area */
.result-section {
  background-color: #FFFDFB; /* Off-white, like washi paper */
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(229, 109, 97, 0.3);
  box-shadow: 0 3px 10px rgba(217, 84, 77, 0.08);
  position: relative; /* For potential absolute positioned elements inside */
}

/* Common style for section titles (h4, h5) in result area */
.name-result-container h4,
.name-result-container h5 {
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  color: #C74840; /* Darker theme pink/red */
  margin-bottom: 18px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid rgba(229, 109, 97, 0.25); 
  text-align: center; /* Center section titles */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.name-result-container h4 {
  font-size: 1.4em; 
}
.name-result-container h5 {
  font-size: 1.2em;
  color: #D9544D; /* Slightly lighter for h5 */
  margin-top: 15px; /* Add some top margin for h5 within sections */
}

.h-decorator, .h-decorator-small {
  color: #E56D61; /* Theme accent color */
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
  border: 1.5px solid rgba(229, 109, 97, 0.4);
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; 
  min-width: 45px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.character-item:hover, .character-item.active {
  background-color: #FFF5F5; /* Lightest theme pink */
  border-color: #D9544D;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(217, 84, 77, 0.15);
}

.character {
  font-size: 1.7em;
  font-weight: bold;
  color: #B8433E; /* Theme red */
  font-family: var(--font-family-serif); /* Readable serif for characters */
}

.character-details {
  position: absolute;
  bottom: 100%; 
  left: 50%;
  transform: translateX(-50%) translateY(-8px); 
  background-color: #FFF9F0; /* Washi paper like */
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  z-index: 10;
  width: max-content; 
  max-width: 220px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
  border: 1px solid rgba(217, 84, 77, 0.3);
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
  border-top: 7px solid #FFF9F0; /* Match tooltip bg */
  position: absolute;
  bottom: -7px; 
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.detail-content .detail-title {
  font-weight: 600;
  color: #B8433E; 
  margin-bottom: 5px;
  font-size: 1em;
  font-family: var(--font-family-serif);
}
.detail-content .detail-description {
  font-size: 0.85em;
  color: #795548; /* Brownish text */
  line-height: 1.5;
}


/* Fortune Poem Section */
.name-fortune-poem-container {
  /* background-image: url('/images/washi-texture-light.png'); /* Example washi texture */ 
  /* background-size: cover; */
}

.name-fortune-poem p {
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  font-size: 1.3em;
  line-height: 1.9;
  color: #8C3835; /* Deep red-brown for poem */
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
  color: #6D4C41; /* Darker brown */
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
  background-color: rgba(255, 250, 250, 0.8); /* Slightly transparent white */
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid rgba(229, 109, 97, 0.25);
  display: flex;
  flex-direction: column; 
  gap: 6px;
}

.detail-label {
  font-weight: 600;
  color: #D9544D; /* Theme red */
  font-size: 0.9em;
  font-family: var(--font-family-sans-serif);
}

.detail-value {
  color: #B8433E; /* Darker theme red */
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
  height: 14px;
  background-color: rgba(248, 202, 204, 0.5); /* Lighter pink background for bar */
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid rgba(229, 109, 97, 0.3);
}
.luck-value {
  height: 100%;
  background: linear-gradient(to right, #F8CACC, #E56D61); /* Pink to Red gradient */
  border-radius: 7px;
  transition: width 0.9s cubic-bezier(0.25, 0.1, 0.25, 1); /* Smoother, slightly slower transition */
}
.luck-number {
  font-size: 0.9em;
  color: #B8433E;
  font-weight: 600;
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
  background-color: rgba(255, 248, 245, 0.7);
  padding: 20px 15px;
  border-radius: 10px;
  border: 1px solid rgba(229, 109, 97, 0.2);
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
  font-size: 0.9em;
  color: #8C3835; /* Deep red-brown */
  margin-bottom: 6px;
  font-weight: 500;
}
.element-value-container {
  width: 35px; 
  height: 100px; 
  background-color: rgba(229, 109, 97, 0.08); 
  border-radius: 5px 5px 0 0;
  display: flex;
  align-items: flex-end; 
  border: 1px solid rgba(229, 109, 97, 0.15);
  border-bottom: none;
}
.element-value {
  width: 100%;
  border-radius: 4px 4px 0 0; /* Slightly smaller radius */
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
  font-size: 0.85em;
  color: #B8433E;
  margin-top: 6px;
  font-weight: 500;
}
.elements-description {
  font-size: 0.95em;
  color: #6D4C41;
  line-height: 1.7;
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
  border-radius: 10px;
  background-color: rgba(255, 250, 250, 0.9);
  border: 1px solid;
}

.fortune-do {
  border-color: rgba(170, 212, 174, 0.7); /* Soft green border for "宜" */
}
.fortune-dont {
  border-color: rgba(248, 202, 204, 0.7); /* Soft red border for "忌" */
}

.fortune-tips h5 {
  /* font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif)); */ /* Already applied */
  margin-bottom: 12px;
  /* text-align: center; */ /* Already applied */
}
.fortune-do h5 { color: #66BB6A; /* Softer Green */ }
.fortune-dont h5 { color: #EF5350; /* Softer Red */ }

.fortune-tips ul {
  list-style: none;
  padding-left: 0;
}
.fortune-tips li {
  font-size: 0.9em;
  color: #795548; /* Brownish text */
  padding: 6px 0;
  border-bottom: 1px dotted rgba(229, 109, 97, 0.15);
  display: flex;
  align-items: center;
}
.fortune-tips li:last-child {
  border-bottom: none;
}

.fortune-tips li::before { 
  content: '\2766'; /* Floral heart for "宜" */
  margin-right: 10px;
  color: #A4D4AE; /* Soft Green */
  font-size: 0.9em;
}
.fortune-dont li::before {
  content: '\2731'; /* Asterisk/Star for "忌" */
  color: #F8CACC; /* Soft Pink */
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
  font-size: 1.05em;
  color: white;
  background: linear-gradient(to bottom, #E56D61, #D9544D); 
  border: none;
  border-radius: 25px; 
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family-sans-serif);
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: 0 3px 8px rgba(184, 67, 62, 0.3);
  border-bottom: 2px solid #B8433E; 
  display: inline-flex;
  align-items: center;
  gap: 8px; 
}

.styled-button:hover:not(:disabled) {
  background: linear-gradient(to bottom, #D9544D, #C74840);
  box-shadow: 0 5px 12px rgba(184, 67, 62, 0.4);
  transform: translateY(-2px);
}

.styled-button:active:not(:disabled) {
  transform: translateY(0px);
  box-shadow: 0 2px 5px rgba(184, 67, 62, 0.3);
}

.styled-button:disabled { /* For future use if save becomes disable-able */
  background: #E0E0E0; 
  color: #A0A0A0;
  cursor: not-allowed;
  box-shadow: none;
  border-bottom: 2px solid #BDBDBD;
}

.reset-button {
  /* Specific overrides if needed, for now uses styled-button */
}

.save-button {
  /* Specific overrides if needed, for now uses styled-button */
   background: linear-gradient(to bottom, #66BB6A, #4CAF50); /* Green for save */
   border-bottom-color: #388E3C;
}
.save-button:hover:not(:disabled) {
  background: linear-gradient(to bottom, #4CAF50, #388E3C);
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