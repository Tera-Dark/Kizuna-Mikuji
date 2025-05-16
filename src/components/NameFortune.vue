<template>
  <div class="name-fortune-container">
    <div class="name-fortune-intro" v-if="!isAnalysisComplete">
      <h3 class="intro-title">姓名缘分解析</h3>
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
          解析姓名
        </button>
      </div>
      
      <!-- 添加玄学元素装饰 -->
      <div class="mystic-elements">
        <div class="mystic-symbol" v-for="(symbol, index) in mysticSymbols" :key="index">
          {{ symbol }}
        </div>
      </div>
    </div>
    
    <div v-if="isAnalysisComplete" class="name-result-container">
      <div class="result-header">
        <h3 class="result-title">「{{ fortuneStore.userName }}」的姓名缘分</h3>
        
        <div class="name-fortune-type">
          <span class="fortune-type-badge" :style="{ backgroundColor: fortuneStore.fortuneTypeColor }">
            {{ fortuneStore.selectedFortune.type }}
          </span>
        </div>
      </div>
      
      <!-- 添加字符解读部分 -->
      <div class="name-character-analysis">
        <h4>字符解读：</h4>
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
      
      <div class="name-fortune-poem">
        <p v-html="fortuneStore.selectedFortune.poem"></p>
      </div>
      
      <div class="name-fortune-interpretation">
        <h4>姓名解析：</h4>
        <p>{{ fortuneStore.selectedFortune.interpretation }}</p>
      </div>
      
      <div class="name-personalized-result">
        <h4>个性化分析：</h4>
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
        <div class="five-elements-analysis">
          <h5>五行分析：</h5>
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
      
      <div class="name-fortune-suggestion">
        <h4>缘分建议：</h4>
        <p>{{ fortuneStore.selectedFortune.suggestion }}</p>
        
        <!-- 添加宜忌事项 -->
        <div class="fortune-tips">
          <div class="fortune-do">
            <h5>今日宜</h5>
            <ul>
              <li v-for="(item, index) in getLuckyActivities()" :key="`do-${index}`">{{ item }}</li>
            </ul>
          </div>
          <div class="fortune-dont">
            <h5>今日忌</h5>
            <ul>
              <li v-for="(item, index) in getUnluckyActivities()" :key="`dont-${index}`">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="name-fortune-actions">
        <button @click="resetAnalysis" class="reset-button">重新分析</button>
        <button @click="saveToHistory" class="save-button">保存结果</button>
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
.name-fortune-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  transition: all 0.3s ease;
}

.name-fortune-intro {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.5);
  position: relative;
  overflow: hidden;
}

.intro-title {
  font-size: 1.5rem;
  color: #3f51b5;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center;
}

.intro-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.intro-note {
  font-size: 0.8rem;
  color: #777;
  display: block;
  margin-top: 5px;
}

.name-input-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.name-input {
  width: 100%;
  max-width: 300px;
  padding: 12px 15px;
  font-size: 1rem;
  border: 2px solid #3f51b5;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  text-align: center;
  margin-bottom: 5px;
}

.name-input:focus {
  border-color: #3f51b5;
  box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
}

.input-counter {
  font-size: 0.8rem;
  color: #777;
  text-align: right;
  margin-bottom: 15px;
}

.analyze-button {
  padding: 12px 25px;
  font-size: 1rem;
  color: white;
  background-color: #3f51b5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 10px;
}

.analyze-button:hover:not(:disabled) {
  background-color: #303f9f;
  transform: translateY(-2px);
}

.analyze-button:disabled {
  background-color: #c5cae9;
  cursor: not-allowed;
}

/* 神秘元素装饰 */
.mystic-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.mystic-symbol {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(63, 81, 181, 0.1);
  animation: float 10s infinite ease-in-out;
}

.mystic-symbol:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
.mystic-symbol:nth-child(2) { top: 25%; left: 85%; animation-delay: 1s; }
.mystic-symbol:nth-child(3) { top: 85%; left: 25%; animation-delay: 2s; }
.mystic-symbol:nth-child(4) { top: 65%; left: 80%; animation-delay: 3s; }
.mystic-symbol:nth-child(5) { top: 35%; left: 40%; animation-delay: 4s; }
.mystic-symbol:nth-child(6) { top: 75%; left: 15%; animation-delay: 5s; }
.mystic-symbol:nth-child(7) { top: 10%; left: 60%; animation-delay: 6s; }
.mystic-symbol:nth-child(8) { top: 50%; left: 90%; animation-delay: 7s; }
.mystic-symbol:nth-child(9) { top: 90%; left: 70%; animation-delay: 8s; }
.mystic-symbol:nth-child(10) { top: 20%; left: 30%; animation-delay: 9s; }

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
  }
}

/* 结果样式 */
.name-result-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(63, 81, 181, 0.6);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  margin-bottom: 20px;
}

.result-title {
  font-size: 1.6rem;
  color: #3f51b5;
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(63, 81, 181, 0.3);
}

.name-fortune-type {
  text-align: center;
  margin: 15px 0;
}

.fortune-type-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

/* 字符解读样式 */
.name-character-analysis {
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(63, 81, 181, 0.05);
  border-radius: 10px;
}

.name-character-analysis h4 {
  color: #3f51b5;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.character-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.character-item {
  position: relative;
  cursor: pointer;
}

.character {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 2px solid #3f51b5;
  border-radius: 8px;
  font-size: 1.4rem;
  color: #3f51b5;
  transition: all 0.3s ease;
}

.character-item:hover .character,
.character-item.active .character {
  background-color: #3f51b5;
  color: #fff;
  transform: translateY(-5px);
}

.character-details {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
  animation: fadeIn 0.2s ease-out;
}

.detail-arrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.detail-title {
  font-weight: bold;
  color: #3f51b5;
  margin-bottom: 5px;
  font-size: 1rem;
}

.detail-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
}

.name-fortune-poem {
  background-color: rgba(63, 81, 181, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  text-align: center;
  font-style: italic;
  line-height: 1.8;
  color: #555;
}

.name-fortune-interpretation,
.name-personalized-result,
.name-fortune-suggestion {
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(63, 81, 181, 0.2);
}

.name-fortune-interpretation h4,
.name-personalized-result h4,
.name-fortune-suggestion h4 {
  color: #3f51b5;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.personalized-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.detail-label {
  width: 100px;
  font-weight: bold;
  color: #555;
}

.detail-value {
  flex-grow: 1;
  color: #333;
}

.color-value {
  display: flex;
  align-items: center;
  gap: 5px;
}

.color-dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.luck-meter {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.luck-bar {
  flex-grow: 1;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.luck-value {
  height: 100%;
  background: linear-gradient(to right, #3f51b5, #9c27b0);
  transition: width 1s ease-in-out;
}

.luck-number {
  font-weight: bold;
  color: #3f51b5;
  width: 60px;
  text-align: right;
}

.personalized-description {
  line-height: 1.6;
  color: #333;
}

/* 五行分析 */
.five-elements-analysis {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed rgba(63, 81, 181, 0.3);
}

.five-elements-analysis h5 {
  color: #3f51b5;
  margin-bottom: 15px;
  font-size: 1rem;
}

.elements-chart {
  display: flex;
  justify-content: space-between;
  height: 150px;
  margin-bottom: 15px;
}

.element-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 18%;
}

.element-name {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.element-value-container {
  width: 100%;
  height: 100px;
  background-color: #f5f5f5;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.element-value {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transition: height 1s ease-in-out;
}

.element-percentage {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #555;
}

.elements-description {
  line-height: 1.6;
  color: #333;
  margin-top: 15px;
  font-size: 0.95rem;
  padding: 10px;
  background-color: rgba(63, 81, 181, 0.05);
  border-radius: 5px;
}

/* 宜忌事项 */
.fortune-tips {
  display: flex;
  margin-top: 20px;
  gap: 15px;
}

.fortune-do,
.fortune-dont {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
}

.fortune-do {
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.fortune-dont {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.fortune-do h5 {
  color: #27ae60;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
}

.fortune-dont h5 {
  color: #e74c3c;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
}

.fortune-do ul,
.fortune-dont ul {
  padding-left: 20px;
}

.fortune-do li,
.fortune-dont li {
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.fortune-do li {
  color: #2c3e50;
}

.fortune-dont li {
  color: #2c3e50;
}

.name-fortune-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.reset-button,
.save-button {
  padding: 12px 25px;
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  width: 48%;
}

.reset-button {
  background-color: #e74c3c;
}

.save-button {
  background-color: #27ae60;
}

.reset-button:hover,
.save-button:hover {
  transform: translateY(-2px);
}

.reset-button:hover {
  background-color: #c0392b;
}

.save-button:hover {
  background-color: #219653;
}

/* 媒体查询 */
@media (max-width: 600px) {
  .result-title {
    font-size: 1.3rem;
  }
  
  .fortune-tips {
    flex-direction: column;
  }
  
  .character {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
  
  .character-details {
    width: 180px;
  }
  
  .detail-label {
    width: 90px;
  }
}
</style> 