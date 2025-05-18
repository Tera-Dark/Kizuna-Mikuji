<template>
  <div class="destiny-ball-container themed-container">
    <div class="destiny-ball-title">
      <h3 class="main-title"><span class="deco-icon left">❀</span> 缘分球 <span class="deco-icon right">❀</span></h3>
      <p class="subtitle themed-subtitle">摇一摇，探寻爱情的玄妙指引</p>
    </div>
    
    <!-- 添加问题输入区域 -->
    <div class="question-input-area themed-input-section" v-if="!isShaking && !showAnswer">
      <input 
        type="text" 
        v-model="userQuestion" 
        placeholder="心有所问？轻语于此（可选）"
        @keyup.enter="shakeBall"
        maxlength="50"
        class="themed-input"
      />
      <div class="question-counter themed-text-minor">{{ userQuestion.length }}/50</div>
    </div>
    
    <div 
      class="destiny-ball" 
      :class="{ shake: isShaking, 'omamori-open': showAnswer }"
      @click="shakeBall"
    >
      <!-- New Omamori Structure -->
      <div class="omamori-pouch">
        <div class="omamori-flap"></div>
        <div class="omamori-body">
          <div class="omamori-string-knot">
            <!-- Simplified knot using pseudo-elements or simple divs if needed -->
            <div class="knot-loop knot-loop-1"></div>
            <div class="knot-loop knot-loop-2"></div>
            <div class="knot-center"></div>
          </div>
          <div class="omamori-decoration">
            <span>縁</span> <!-- Simple character decoration for now -->
          </div>
        </div>
        <div class="answer-scroll-container" v-if="showAnswer">
          <div class="answer-scroll">
            <div class="answer-scroll-content">{{ currentAnswer }}</div>
          </div>
        </div>
      </div>

      <!-- Mystic symbols might be re-purposed for particle effects later -->
      <div v-if="showMysticSymbols && isShaking" class="mystic-particle-effects">
        <span v-for="(symbol, index) in mysticSymbols" :key="index" class="particle"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s` 
          }"
        >{{ symbol }}</span>
      </div>
      <!-- End of New Omamori Structure -->
    </div>
    
    <div class="instruction-text themed-text-gentle" v-if="!showAnswer && !isShaking">
      <p>{{ userQuestion ? '轻点御守，静待神谕' : '轻点御守，祈缘问情' }}</p>
    </div>
    
    <div class="result-display themed-section-box" v-if="showAnswer">
      <div class="question-display" v-if="userQuestion">
        <span class="question-label themed-text-label">所问：</span>
        <span class="question-text themed-text-content">{{ userQuestion }}</span>
      </div>
      <div class="answer-display">
        <span class="answer-label themed-text-label">神谕：</span>
        <span class="answer-text-display themed-text-lead">{{ currentAnswer }}</span>
      </div>
      <div class="result-buttons button-row">
        <button @click="resetBall" class="themed-button secondary-button">
          <span class="btn-icon">↻</span> 再摇一次
        </button>
        <button class="themed-button primary-button save-button" @click="saveToHistory">
          <span class="btn-icon">📜</span> 保存神谕
        </button>
      </div>
    </div>
    
    <!-- 历史记录区域 -->
    <div class="history-section themed-section-box" v-if="destinyHistory.length > 0 && !showAnswer && !isShaking">
      <h4 class="history-title section-title">
        <span class="deco-icon left">📜</span> 往昔神谕 <span class="deco-icon right">📜</span>
        <span class="clear-history themed-link" @click="clearHistory">清空记录</span>
      </h4>
      <div class="history-list">
        <div v-for="(item, index) in destinyHistory" :key="index" class="history-item themed-history-item">
          <div class="history-question themed-text-minor" v-if="item.question && item.question !== '(无问题)'">问：{{ item.question }}</div>
          <div class="history-answer themed-text-content">{{ item.answer }}</div>
          <div class="history-date themed-text-minor">{{ item.date }}</div>
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
const mysticSymbols = ['緣', '結', '愛', '囍', '福', '愿', '心', '恋', ' मिलाप', '赤い糸']; // 印地语"结合"，日语"红线"

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
  if (isShaking.value || showAnswer.value) {
    if(showAnswer.value) {
      resetBallAndQuestion();
    }
    return;
  }
  
  isShaking.value = true;
  showMysticSymbols.value = true;
  
  try {
    const baseUrl = process.env.NODE_ENV === 'production' ? '/Kizuna-Mikuji/' : '/';
    const audio = new Audio(baseUrl + 'sounds/omamori-shake.mp3');
    audio.volume = 0.4;
    audio.play().catch(err => console.warn('御守音效播放失败:', err));
  } catch (error) {
    console.warn('御守音效创建失败:', error);
  }
  
  const randomIndex = Math.floor(Math.random() * answers.length);
  currentAnswer.value = answers[randomIndex];
  
  setTimeout(() => {
    isShaking.value = false;
    showAnswer.value = true;
    showMysticSymbols.value = false; 

    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? '/Kizuna-Mikuji/' : '/';
      const revealAudio = new Audio(baseUrl + 'sounds/scroll-open.mp3');
      revealAudio.volume = 0.5;
      revealAudio.play().catch(err => console.warn('卷轴音效播放失败:', err));
    } catch (error) {
      console.warn('卷轴音效创建失败:', error);
    }
  }, 2000);
};

const resetBallAndQuestion = () => {
  showAnswer.value = false;
  currentAnswer.value = '';
};

// 重置球
const resetBall = () => {
  showAnswer.value = false;
  currentAnswer.value = '';
  userQuestion.value = '';
};

// 保存预测到历史记录
const saveToHistory = () => {
  if (!currentAnswer.value) return;
  
  const questionToSave = userQuestion.value ? userQuestion.value.trim() : '';

  destinyHistory.value.unshift({
    question: questionToSave || '(随心一问)',
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
/* General Theming */
.themed-container {
  background-color: var(--theme-color-background-light, rgba(255, 245, 248, 0.95)); 
  border-radius: 25px;
  padding: 30px 35px;
  margin: 25px auto;
  box-shadow: 0 8px 25px var(--theme-color-shadow-light, rgba(217, 84, 77, 0.15)), 
              0 0 0 2px var(--theme-color-border-subtle, rgba(229, 109, 97, 0.2));
  max-width: 600px; 
  text-align: center;
  font-family: var(--font-family-sans-serif);
}

.main-title {
  color: var(--theme-color-dark, #B8433E);
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  font-size: 2.4em;
  margin-bottom: 8px;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.themed-subtitle {
  color: var(--theme-color-text-subtle, #8C3835);
  font-size: 1.1em;
  margin-bottom: 25px;
  font-family: var(--font-family-sans-serif);
}

.deco-icon {
  color: var(--theme-color-red, #E56D61);
  font-size: 0.7em;
  margin: 0 12px;
  opacity: 0.9;
}

.themed-input-section {
  margin-bottom: 25px;
  width: 80%;
  max-width: 400px;
  position: relative; /* For counter positioning */
}

.themed-input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1.5px solid var(--theme-color-border-subtle, rgba(229, 109, 97, 0.4));
  background-color: #fff;
  font-size: 1em;
  color: var(--theme-color-text, #5C2827);
  font-family: var(--font-family-sans-serif);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}
.themed-input:focus {
  border-color: var(--theme-color-red, #E56D61);
  box-shadow: 0 0 0 3.5px rgba(229, 109, 97, 0.25);
  outline: none;
}
.themed-input::placeholder {
  color: var(--theme-color-placeholder, #bcaaaa);
  font-style: italic;
}

.question-counter.themed-text-minor {
  position: absolute;
  right: 10px;
  bottom: -18px;
  font-size: 0.8em;
  color: var(--theme-color-text-very-subtle, #c9a9a8);
}

.themed-text-minor {
  font-size: 0.9em;
  color: var(--theme-color-text-subtle, #8C3835);
}

.themed-text-gentle {
  color: var(--theme-color-text-subtle, #8C3835);
  font-style: italic;
  margin-top: 15px;
  font-size: 0.95em;
}

.themed-text-label {
  font-weight: 600;
  color: var(--theme-color-dark, #B8433E);
}
.themed-text-content {
  color: var(--theme-color-text, #5C2827);
}
.themed-text-lead {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--theme-color-red, #E56D61);
  font-family: var(--font-family-serif, serif);
}

.themed-link {
  color: var(--theme-color-red, #E56D61);
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.2s ease;
}
.themed-link:hover {
  color: var(--theme-color-dark, #B8433E);
  text-decoration: underline;
}

/* Destiny Ball/Omamori Styles */
.destiny-ball-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 450px;
}

.destiny-ball-title {
  margin-bottom: 20px;
  text-align: center;
}

.destiny-ball {
  width: 180px;
  height: 260px;
  position: relative;
  cursor: pointer;
  margin: 30px auto;
  user-select: none;
}

.omamori-pouch {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}
.destiny-ball:active .omamori-pouch {
  transform: scale(0.97);
}

.omamori-flap {
  width: 100%;
  height: 70px;
  background-color: var(--theme-color-red-pale, #FADADD);
  border: 2px solid var(--theme-color-gold-dark, #B8860B);
  border-bottom: none;
  border-radius: 15px 15px 0 0;
  position: relative;
  z-index: 10;
  transform-origin: bottom center;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1) inset; 
}

.destiny-ball.omamori-open .omamori-flap {
  transform: rotateX(-135deg);
}

.omamori-body {
  width: 100%;
  height: calc(100% - 60px);
  background-color: var(--theme-color-red, #E56D61);
  border: 2px solid var(--theme-color-gold-dark, #B8860B);
  border-top: none;
  border-radius: 0 0 20px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 30px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
}

.omamori-string-knot {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 30px;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
}

.knot-center {
  width: 12px;
  height: 12px;
  background-color: var(--theme-color-gold, #FFD700);
  border-radius: 50%;
  border: 2px solid var(--theme-color-gold-dark, #B8860B);
  position: relative;
  z-index: 2;
}

.knot-loop {
  position: absolute;
  width: 30px;
  height: 40px;
  border: 3px solid var(--theme-color-gold, #FFD700);
  border-radius: 50% / 60% 60% 40% 40%;
  background-color: var(--theme-color-red);
}
.knot-loop-1 {
  transform: translateX(-18px) rotate(-25deg);
  z-index: 1;
}
.knot-loop-2 {
  transform: translateX(18px) rotate(25deg);
  z-index: 1;
}

.omamori-decoration {
  margin-top: 20px;
  font-family: var(--font-family-serif-decorative);
  font-size: 3em;
  color: var(--theme-color-gold-pale, #FFF8DC);
  text-shadow: 1px 1px 2px var(--theme-color-gold-dark, #B8860B);
}

.answer-scroll-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%; 
  height: 0;
  overflow: hidden;
  transition: height 0.8s 0.4s ease-out;
  z-index: 5;
}

.destiny-ball.omamori-open .answer-scroll-container {
  height: 120px;
}

.answer-scroll {
  width: 100%;
  height: 100%;
  background-color: var(--theme-color-parchment, #fef5e7);
  border: 2px solid var(--theme-color-gold-dark, #B8860B);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.5s 0.7s ease, transform 0.5s 0.7s ease;
}

.destiny-ball.omamori-open .answer-scroll {
  opacity: 1;
  transform: translateY(0);
}

.answer-scroll-content {
  font-family: var(--font-family-serif);
  color: var(--theme-color-text-darker, #4a2c2a);
  font-size: 0.95em; 
  text-align: center;
  line-height: 1.5;
  max-height: 100%;
  overflow-y: auto;
}

/* Mystic Particle Effects (replaces old mystic symbols) */
.mystic-particle-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.mystic-particle-effects .particle {
  position: absolute;
  font-size: 1.2em;
  color: var(--theme-color-gold-transparent, rgba(255, 215, 0, 0.7));
  opacity: 0;
  animation: particleFlyOut 1.5s ease-out forwards;
  font-family: var(--font-family-serif-decorative);
  text-shadow: 0 0 3px var(--theme-color-gold, #FFD700);
}

@keyframes particleFlyOut {
  0% {
    opacity: 0.8;
    transform: translate(0, 0) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translate(calc(var(--randomX, 0) * 60px - 30px), calc(var(--randomY, 0) * 60px - 30px)) scale(1.2);
  }
}

/* Adjust shake animation if we keep a general shake for the omamori itself */
.destiny-ball.shake .omamori-pouch {
  animation: omamoriShakeEffect 0.6s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes omamoriShakeEffect {
  10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-2deg); }
  20%, 80% { transform: translate3d(2px, 0, 0) rotate(2deg); }
  30%, 50%, 70% { transform: translate3d(-2px, 0, 0) rotate(-3deg); }
  40%, 60% { transform: translate3d(2px, 0, 0) rotate(3deg); }
}

/* Instruction Text */
.instruction-text.themed-text-gentle p {
}

/* Result Display Theming */
.result-display.themed-section-box {
  margin-top: 30px;
  padding: 20px 25px;
  background-color: rgba(255, 250, 248, 0.9);
  border-radius: 18px; 
  box-shadow: 0 6px 20px rgba(217, 84, 77, 0.1), 0 0 0 1.5px rgba(229, 109, 97, 0.2);
  width: 90%;
  max-width: 500px;
}

.question-display, .answer-display {
  margin-bottom: 15px;
  text-align: left;
  line-height: 1.6;
}

.question-display .question-text,
.answer-display .answer-text-display {
  margin-left: 5px;
}

.result-buttons.button-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.themed-button {
  padding: 10px 20px;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
}

.themed-button .btn-icon {
  font-size: 1.1em;
  transition: transform 0.3s ease;
}
.themed-button:hover .btn-icon {
  transform: scale(1.15) rotate(-8deg);
}

.themed-button.primary-button {
  background: linear-gradient(145deg, var(--theme-color-red, #E56D61), var(--theme-color-dark, #B8433E));
  color: white;
  box-shadow: 0 3px 10px rgba(184, 67, 62, 0.2), 0 0 0 1px rgba(255,255,255,0.25) inset;
}
.themed-button.primary-button:hover {
  background: linear-gradient(145deg, var(--theme-color-dark, #B8433E), var(--theme-color-red, #E56D61));
  box-shadow: 0 5px 14px rgba(184, 67, 62, 0.3), 0 0 0 1px rgba(255,255,255,0.35) inset;
  transform: translateY(-2px);
}

.themed-button.secondary-button {
  background-color: #fff;
  color: var(--theme-color-red, #E56D61);
  border: 1.5px solid var(--theme-color-red, #E56D61);
  box-shadow: 0 2px 6px rgba(217, 84, 77, 0.08);
}
.themed-button.secondary-button:hover {
  background-color: var(--theme-color-extralight-pink, #FFF5F5);
  border-color: var(--theme-color-dark, #B8433E);
  color: var(--theme-color-dark, #B8433E);
  transform: translateY(-1px);
}

/* History Section Theming */
.history-section.themed-section-box {
  margin-top: 35px;
  padding: 20px 25px;
  background-color: rgba(255, 250, 248, 0.85);
  border-radius: 18px;
  box-shadow: 0 4px 15px rgba(217, 84, 77, 0.08), 0 0 0 1px rgba(229, 109, 97, 0.15);
  width: 90%;
  max-width: 550px;
}

.history-title.section-title {
  color: var(--theme-color-dark, #B8433E);
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  font-size: 1.8em;
  margin-bottom: 18px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed var(--theme-color-border-subtle, rgba(229, 109, 97, 0.3));
  padding-bottom: 10px;
}
.history-title .deco-icon {
  font-size: 0.8em;
}

.clear-history {
  font-family: var(--font-family-sans-serif);
  font-weight: 500;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

/* Custom scrollbar for history */
.history-list::-webkit-scrollbar {
  width: 6px;
}
.history-list::-webkit-scrollbar-track {
  background: var(--theme-color-background-light, #FFF5F5);
  border-radius: 10px;
}
.history-list::-webkit-scrollbar-thumb {
  background-color: var(--theme-color-border-subtle, rgba(229, 109, 97, 0.4));
  border-radius: 10px;
}
.history-list::-webkit-scrollbar-thumb:hover {
  background-color: var(--theme-color-red, #E56D61);
}

.themed-history-item {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--theme-color-border-very-subtle, rgba(229, 109, 97, 0.1));
  text-align: left;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.history-item .history-question {
  font-style: italic;
  margin-bottom: 4px;
  color: var(--theme-color-text-subtle, #8C3835);
  font-size: 0.85em;
}
.history-item .history-answer {
  font-weight: 500;
  color: var(--theme-color-text, #5C2827);
  margin-bottom: 5px;
}
.history-item .history-date {
  font-size: 0.75em;
  color: var(--theme-color-text-very-subtle, #c9a9a8);
  text-align: right;
}

/* Responsive Adjustments for Omamori */
@media (max-width: 600px) {
  .themed-container {
    padding: 20px;
    margin: 15px auto;
  }
  .main-title {
    font-size: 2em;
  }
  .themed-subtitle {
    font-size: 1em;
  }
  .themed-input-section {
    width: 90%;
  }
  .destiny-ball {
    width: 160px; 
    height: 230px; 
  }
  .omamori-flap {
    height: 60px;
  }
  .omamori-body {
    padding-top: 25px;
  }
  .omamori-string-knot {
    width: 70px;
    height: 25px;
    top: -12px;
  }
  .knot-loop {
    width: 25px;
    height: 35px;
  }
  .omamori-decoration {
    font-size: 2.5em;
    margin-top: 15px;
  }
  .destiny-ball.omamori-open .answer-scroll-container {
    height: 100px; 
  }
  .answer-scroll-content {
    font-size: 0.9em;
  }
  .result-buttons.button-row {
    flex-direction: column;
    gap: 10px;
  }
  .themed-button {
    width: 100%;
  }
  .history-title.section-title {
    font-size: 1.6em;
  }
}

</style> 