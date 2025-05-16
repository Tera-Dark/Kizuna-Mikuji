<template>
  <header class="fortune-header">
    <div class="header-decoration left-decoration"></div>
    
    <div class="central-content">
      <div class="logo-container">
        <img src="/images/缘结神头像.png" alt="缘结神头像" class="header-logo" @click="playRandomVoice">
        <!-- 对话气泡 -->
        <Transition name="bubble">
          <div class="speech-bubble left" v-if="leftBubble.visible">
            {{ leftBubble.content }}
          </div>
        </Transition>
        <Transition name="bubble">
          <div class="speech-bubble right" v-if="rightBubble.visible">
            {{ rightBubble.content }}
          </div>
        </Transition>
      </div>
      <h1 class="header-title">缘结良缘</h1>
      <p class="header-description">轻点结缘签，让缘结神为你指引今日的缘分吧！</p>
    </div>
    
    <div class="header-decoration right-decoration"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// 音频列表
const voiceFiles = [
  '不！准！随！便！冒犯神明——.mp3',
  '缘分与意外其实是一样的——永远不知道会是哪个突然出现.mp3',
  '世间之缘，又何止只属于有幸相守之人.mp3',
  '纵使相隔时间与生死，也不曾真正分离，这才是缘分.mp3',
  '未能传达的心意可无法感知.mp3',
  '呜...呜啊~.mp3',
  '不要惹我，我超凶的.mp3',
  '我才不疼呢.mp3',
  '再摸，再摸我可就要生气了.mp3',
  '这世间竟有如此般配的二人.mp3',
  '哼，可不要小看我了.mp3',
  '我一定会给你带来幸福.mp3'
];

// 对话气泡状态
const leftBubble = reactive({
  content: '',
  visible: false,
  timerId: null as number | null
});

const rightBubble = reactive({
  content: '',
  visible: false,
  timerId: null as number | null
});

// 当前音频对象
let currentAudio: HTMLAudioElement | null = null;

// 播放随机音频
const playRandomVoice = () => {
  // 如果当前有音频在播放，停止它
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  // 随机选择一个音频文件
  const randomIndex = Math.floor(Math.random() * voiceFiles.length);
  const selectedVoice = voiceFiles[randomIndex];
  
  // 创建新的音频对象并播放
  currentAudio = new Audio(`/sounds/缘结神语录合集/${selectedVoice}`);
  currentAudio.play().catch(error => {
    console.error('播放音频失败:', error);
  });
  
  // 显示聊天框
  showSpeechBubble(selectedVoice);
};

// 显示聊天框
const showSpeechBubble = (voiceFile: string) => {
  // 设置聊天框内容（去掉.mp3扩展名）
  const content = voiceFile.replace('.mp3', '');
  
  // 随机决定聊天框位置（左或右）
  const position = Math.random() > 0.5 ? 'left' : 'right';
  
  // 获取对应的气泡
  const bubble = position === 'left' ? leftBubble : rightBubble;
  
  // 如果有正在显示的气泡，先清除它的定时器
  if (bubble.timerId !== null) {
    clearTimeout(bubble.timerId);
  }
  
  // 更新气泡内容并显示
  bubble.content = content;
  bubble.visible = true;
  
  // 设置自动淡出
  bubble.timerId = window.setTimeout(() => {
    bubble.visible = false;
    bubble.timerId = null;
  }, 4000); // 4秒后消失
};
</script>

<style scoped>
.fortune-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  position: relative;
  padding: 0 15px;
  width: 100%;
}

.central-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  position: relative;
  padding: 10px 0;
}

.header-decoration {
  position: absolute;
  width: 120px;
  height: 8px;
  background: linear-gradient(to right, rgba(231, 76, 60, 0.9), #C0392B);
  top: 50%;
  transform: translateY(-50%);
}

.left-decoration {
  left: 0;
  background: linear-gradient(to right, #C0392B, rgba(231, 76, 60, 0.7));
}

.left-decoration::before {
  content: "";
  position: absolute;
  left: 2px;
  top: -8px;
  width: 16px;
  height: 24px;
  background-color: #C0392B;
  border-radius: 0 50% 50% 0;
}

.right-decoration {
  right: 0;
  background: linear-gradient(to left, #C0392B, rgba(231, 76, 60, 0.7));
}

.right-decoration::before {
  content: "";
  position: absolute;
  right: 2px;
  top: -8px;
  width: 16px;
  height: 24px;
  background-color: #C0392B;
  border-radius: 50% 0 0 50%;
}

.logo-container {
  margin-bottom: 12px;
  position: relative;
}

.logo-container::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 1px;
  background: linear-gradient(to right, transparent, #C0392B, transparent);
}

.header-logo {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  border: 3px solid #C0392B;
  transition: all 0.4s ease;
  box-shadow: 0 0 0 2px rgba(255, 248, 231, 0.6), 0 0 15px rgba(192, 57, 43, 0.5);
  position: relative;
  z-index: 1;
  cursor: pointer; /* 添加鼠标指针样式，提示可点击 */
}

.header-logo:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 0 0 3px rgba(255, 248, 231, 0.8), 0 0 20px rgba(192, 57, 43, 0.7);
}

/* 气泡过渡动画 */
.bubble-enter-active {
  animation: bubbleIn 0.5s ease-out;
}

.bubble-leave-active {
  animation: bubbleOut 0.5s ease-in;
}

@keyframes bubbleIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bubbleOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
}

/* 聊天气泡样式 */
.speech-bubble {
  position: absolute;
  background-color: #FFFFFF;
  border: 2px solid #C0392B;
  border-radius: 18px;
  padding: 10px 15px;
  font-size: 15px;
  width: 180px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  color: #8B4513;
  word-wrap: break-word;
  text-align: left;
  line-height: 1.5;
  font-family: 'STKaiti', 'KaiTi', serif;
  top: 15px;
  z-index: 10;
}

.speech-bubble.left {
  right: calc(100% + 5px);
}

.speech-bubble.right {
  left: calc(100% + 5px);
}

.header-title {
  color: #C0392B;
  font-size: 2.6em;
  margin: 10px 0 5px;
  font-weight: normal;
  position: relative;
  display: inline-block;
  text-shadow: 1px 1px 3px rgba(192, 57, 43, 0.2);
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 2px;
}

/* 标题两边的装饰 */
.header-title::before,
.header-title::after {
  content: "❀";
  color: #E74C3C;
  font-size: 0.65em;
  margin: 0 12px;
  vertical-align: middle;
  text-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
}

.header-description {
  font-size: 1.15em;
  color: #8B4513;
  margin-top: 8px;
  font-family: 'STFangsong', 'FangSong', serif;
  position: relative;
  padding-bottom: 8px;
}

.header-description::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(139, 69, 19, 0.5), transparent);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-decoration {
    width: 60px;
  }
  
  .header-logo {
    width: 75px;
    height: 75px;
  }

  .header-title {
    font-size: 2.2em;
  }

  .header-description {
    font-size: 1em;
  }
  
  .speech-bubble {
    width: 160px;
    font-size: 14px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .header-decoration {
    display: none;
  }
  
  .header-logo {
    width: 65px;
    height: 65px;
    border-width: 2px;
  }

  .header-title {
    font-size: 1.8em;
  }

  .header-title::before,
  .header-title::after {
    margin: 0 8px;
  }

  .header-description {
    font-size: 0.95em;
  }
  
  .speech-bubble {
    width: 140px;
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .speech-bubble.left {
    right: calc(100% + 5px);
  }
  
  .speech-bubble.right {
    left: calc(100% + 5px);
  }
}
</style> 