<template>
  <div class="destiny-ball-container">
    <div class="destiny-ball-title">
      <h3>缘分球</h3>
      <p class="subtitle">摇一摇，得到关于爱情的即时提示</p>
    </div>
    
    <!-- 添加问题输入区域 -->
    <div class="question-input-area" v-if="!isShaking && !showAnswer">
      <input 
        type="text" 
        v-model="userQuestion" 
        placeholder="请输入你想问的缘分问题（可选）"
        @keyup.enter="shakeBall"
        maxlength="50"
      />
      <div class="question-counter">{{ userQuestion.length }}/50</div>
    </div>
    
    <div 
      class="destiny-ball" 
      :class="{ shake: isShaking, 'show-answer': showAnswer }"
      @click="shakeBall"
    >
      <div class="ball-outer">
        <div class="ball-inner">
          <div class="ball-fluid">
            <div v-if="showMysticSymbols" class="mystic-symbols">
              <span v-for="(symbol, index) in mysticSymbols" :key="index" class="symbol"
                :style="{
                  transform: `translate(${Math.sin(index) * 20}px, ${Math.cos(index) * 20}px)`,
                  animationDelay: `${index * 0.1}s`
                }"
              >{{ symbol }}</span>
            </div>
            <div class="triangle-answer" v-if="showAnswer">
              <div class="answer-text">{{ currentAnswer }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ball-shadow"></div>
    </div>
    
    <div class="instruction-text" v-if="!showAnswer">
      <p>{{ userQuestion ? '点击缘分球获取预测' : '点击缘分球获取提示' }}</p>
    </div>
    
    <div class="result-display" v-if="showAnswer">
      <div class="question-display" v-if="userQuestion">
        <span class="question-label">问：</span>
        <span class="question-text">{{ userQuestion }}</span>
      </div>
      <div class="answer-display">
        <span class="answer-label">缘：</span>
        <span class="answer-text-display">{{ currentAnswer }}</span>
      </div>
      <div class="shake-again-button">
        <button @click="resetBall">再摇一次</button>
        <button class="save-button" @click="saveToHistory">保存预测</button>
      </div>
    </div>
    
    <!-- 历史记录区域 -->
    <div class="history-section" v-if="destinyHistory.length > 0 && !showAnswer && !isShaking">
      <h4 class="history-title">
        <span>历史预测</span>
        <span class="clear-history" @click="clearHistory">清除</span>
      </h4>
      <div class="history-list">
        <div v-for="(item, index) in destinyHistory" :key="index" class="history-item">
          <div class="history-question" v-if="item.question">{{ item.question }}</div>
          <div class="history-answer">{{ item.answer }}</div>
          <div class="history-date">{{ item.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isShaking = ref(false);
const showAnswer = ref(false);
const currentAnswer = ref('');
const userQuestion = ref('');
const destinyHistory = ref([]);
const showMysticSymbols = ref(false);

// 神秘符号
const mysticSymbols = ['✨', '⭐', '🌙', '🔮', '💫', '💖', '✨', '🌟', '⚡', '🌠'];

// 所有可能的答案
const answers = [
  "缘分已近，静待花开",
  "心有灵犀一点通",
  "有缘千里来相会",
  "今日良缘，不要错过",
  "顺其自然，水到渠成",
  "真爱就在不远处",
  "耐心等待，时机未到",
  "学会珍惜眼前人",
  "爱情就在转角处",
  "相遇在即，请保持微笑",
  "缘深缘浅，由天注定",
  "相信直觉，跟随心声",
  "机会稍纵即逝，把握当下",
  "时机已到，大胆表白",
  "退一步海阔天空",
  "坚守本心，静待花开",
  "爱情需要主动出击",
  "别犹豫，行动吧",
  "心意相通，不言自明",
  "珍惜当下，莫负好时光",
  "一见钟情，命中注定",
  "前路曲折，终有回报",
  "桃花运旺，机不可失",
  "对的人终会出现",
  "赢得爱情需要勇气",
  "水到渠成，顺其自然",
  "真情比时间更重要",
  "命中注定，无需强求",
  "情投意合，不负有心人",
  "对的时间遇见对的人",
  // 新增更具体、更丰富的答案
  "天意如此，不必强求，顺应自然",
  "两心相知，无需言说，珍惜当下",
  "红线已系，缘分将至，保持期待",
  "暂时失意，莫要气馁，春风将至",
  "千金易得，知己难求，且行且珍惜",
  "三生有幸，不负此缘，勇敢相守",
  "前路虽艰，但有真心，终见光明",
  "缘分使然，切莫错过，把握眼前",
  "此情可待，只争朝夕，满怀希望",
  "万水千山，不忘初心，终将相遇",
  "有心栽花，缘定三生，静候佳音",
  "一期一会，此时此刻，最为珍贵",
  "心若向阳，无惧风霜，爱将绽放",
  "似曾相识，前世情缘，今生再续",
  "随遇而安，顺势而为，美好在即",
  "诚心所致，金石为开，真爱无阻",
  "缘分已至，珍惜有加，不负韶华",
  "命中注定，心生欢喜，无悔此生",
  "良辰美景，佳人有约，勿再踌躇",
  "且听风吟，静候花开，情归何处"
];

// 摇晃球
const shakeBall = () => {
  if (isShaking.value || showAnswer.value) return;
  
  isShaking.value = true;
  showMysticSymbols.value = true;
  
  // 播放摇晃音效
  try {
    const audio = new Audio('/sounds/wind-chime.mp3');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('音效播放失败'));
  } catch (error) {
    console.log('音效创建失败');
  }
  
  // 随机选择一个答案
  const randomIndex = Math.floor(Math.random() * answers.length);
  currentAnswer.value = answers[randomIndex];
  
  // 摇晃动画
  setTimeout(() => {
    showMysticSymbols.value = false;
    isShaking.value = false;
    showAnswer.value = true;
    
    // 播放揭晓答案音效
    try {
      const revealAudio = new Audio('/sounds/wind-chime.mp3');
      revealAudio.volume = 0.4;
      revealAudio.play().catch(err => console.log('音效播放失败'));
    } catch (error) {
      console.log('音效创建失败');
    }
  }, 1500);
};

// 重置球
const resetBall = () => {
  showAnswer.value = false;
  currentAnswer.value = '';
};

// 保存预测到历史记录
const saveToHistory = () => {
  if (!currentAnswer.value) return;
  
  destinyHistory.value.unshift({
    question: userQuestion.value || '(无问题)',
    answer: currentAnswer.value,
    date: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  });
  
  // 最多保存10条记录
  if (destinyHistory.value.length > 10) {
    destinyHistory.value = destinyHistory.value.slice(0, 10);
  }
  
  // 保存到localStorage
  localStorage.setItem('destinyBallHistory', JSON.stringify(destinyHistory.value));
  
  // 重置当前问题
  userQuestion.value = '';
  resetBall();
};

// 清除历史记录
const clearHistory = () => {
  destinyHistory.value = [];
  localStorage.removeItem('destinyBallHistory');
};

// 加载历史记录
onMounted(() => {
  try {
    const savedHistory = localStorage.getItem('destinyBallHistory');
    if (savedHistory) {
      destinyHistory.value = JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error('加载历史记录失败', error);
  }
});
</script>

<style scoped>
.destiny-ball-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.destiny-ball-title {
  margin-bottom: 25px;
}

.destiny-ball-title h3 {
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

/* 问题输入区域 */
.question-input-area {
  margin-bottom: 20px;
  position: relative;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.question-input-area input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #9b59b6;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  color: #4a4a4a;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 3px 10px rgba(155, 89, 182, 0.1);
}

.question-input-area input:focus {
  border-color: #8e44ad;
  box-shadow: 0 5px 15px rgba(155, 89, 182, 0.2);
  transform: translateY(-2px);
}

.question-counter {
  position: absolute;
  bottom: -20px;
  right: 10px;
  font-size: 12px;
  color: #888;
}

.destiny-ball {
  position: relative;
  width: 230px;
  height: 230px;
  margin: 0 auto 20px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.2s;
}

.destiny-ball:hover {
  transform: scale(1.05);
}

.ball-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #333 0%, #000 100%);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), inset 0 5px 10px rgba(255, 255, 255, 0.2), inset 0 -5px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transform-style: preserve-3d;
}

.ball-inner {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #6c53a3 0%, #3a0068 70%);
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
}

.ball-fluid {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(98, 0, 234, 0.6);
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
}

.ball-shadow {
  position: absolute;
  bottom: -15px;
  left: 10%;
  right: 10%;
  height: 15px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  z-index: -1;
  transition: all 0.3s ease;
}

.destiny-ball:hover .ball-shadow {
  transform: scaleX(1.05) translateY(3px);
  opacity: 0.4;
}

.triangle-answer {
  width: 110px;
  height: 110px;
  background-color: #1c023d;
  color: white;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  transform: translateY(10px);
  opacity: 0;
  animation: fade-in 0.5s ease forwards;
}

.answer-text {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 1.4;
  color: white;
  transform: translateY(-15px);
  font-family: 'STKaiti', 'KaiTi', serif;
}

.instruction-text {
  margin-top: 20px;
  font-size: 16px;
  color: #8B4513;
  font-family: 'STKaiti', 'KaiTi', serif;
}

/* 结果显示区域 */
.result-display {
  margin-top: 25px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.5s ease;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(155, 89, 182, 0.3);
}

.question-display {
  margin-bottom: 15px;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(155, 89, 182, 0.3);
}

.question-label, .answer-label {
  font-weight: bold;
  color: #8e44ad;
  margin-right: 5px;
}

.question-text, .answer-text-display {
  color: #333;
}

.answer-display {
  text-align: left;
  font-size: 16px;
  margin-bottom: 20px;
}

.shake-again-button {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.shake-again-button button {
  flex: 1;
  background: linear-gradient(145deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  padding: 10px 25px;
  font-size: 1em;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(142, 68, 173, 0.4);
  font-family: 'STKaiti', 'KaiTi', serif;
}

.shake-again-button .save-button {
  background: linear-gradient(145deg, #3498db, #2980b9);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.shake-again-button button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(142, 68, 173, 0.5);
}

.shake-again-button .save-button:hover {
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5);
}

/* 历史记录区域 */
.history-section {
  margin-top: 30px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(155, 89, 182, 0.2);
}

.history-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(155, 89, 182, 0.2);
  color: #8e44ad;
  font-size: 16px;
}

.clear-history {
  font-size: 12px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.clear-history:hover {
  color: #e74c3c;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.history-item {
  padding: 10px;
  border-bottom: 1px dashed rgba(155, 89, 182, 0.2);
  text-align: left;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.history-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.history-item:hover {
  background-color: rgba(155, 89, 182, 0.05);
}

.history-question {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  font-style: italic;
}

.history-answer {
  font-size: 16px;
  color: #8e44ad;
  font-weight: bold;
  margin-bottom: 5px;
}

.history-date {
  font-size: 12px;
  color: #888;
  text-align: right;
}

/* 摇晃动画 */
.destiny-ball.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
}

.destiny-ball.show-answer .ball-fluid {
  background: rgba(98, 0, 234, 0.8);
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-2px, 0, 0) rotate(-2deg);
  }
  
  20%, 80% {
    transform: translate3d(4px, 0, 0) rotate(2deg);
  }
  
  30%, 50%, 70% {
    transform: translate3d(-5px, 0, 0) rotate(-3deg);
  }
  
  40%, 60% {
    transform: translate3d(5px, 0, 0) rotate(3deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 神秘符号动画 */
.mystic-symbols {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.symbol {
  position: absolute;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  animation: float 3s ease-in-out infinite, fade-symbol 1.5s ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fade-symbol {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(-15px);
  }
}

/* 媒体查询 */
@media (max-width: 480px) {
  .destiny-ball {
    width: 200px;
    height: 200px;
  }
  
  .ball-inner {
    width: 150px;
    height: 150px;
  }
  
  .ball-fluid {
    width: 130px;
    height: 130px;
  }
  
  .triangle-answer {
    width: 100px;
    height: 100px;
  }
  
  .answer-text {
    font-size: 12px;
    transform: translateY(-12px);
  }
}
</style> 