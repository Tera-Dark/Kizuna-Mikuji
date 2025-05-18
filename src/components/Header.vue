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
      <p class="header-description">相信命运红线的指引，让缘结神为你指引今日的姻缘</p>
    </div>
    
    <div class="header-decoration right-decoration"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { playSound, stopSound } from '../utils/audioUtils';

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
  if (currentAudio) {
    stopSound(currentAudio);
  }
  
  // 随机选择一个音频文件
  const randomIndex = Math.floor(Math.random() * voiceFiles.length);
  const selectedVoice = voiceFiles[randomIndex];
  
  // 使用audioUtils播放音效
  playSound(`sounds/缘结神语录合集/${selectedVoice}`, 1.0, error => {
    console.error('播放音频失败:', error);
  }).then(audio => {
    currentAudio = audio;
  }).catch(error => {
    console.error('创建音频对象失败:', error);
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
  width: 100px;
  height: 6px;
  background: linear-gradient(to right, rgba(245, 178, 178, 0.7), #D9544D);
  top: 50%;
  transform: translateY(-50%);
  border-radius: 3px;
}

.left-decoration {
  left: 0;
  background: linear-gradient(to right, #D9544D, rgba(245, 178, 178, 0.7));
}

.left-decoration::before {
  content: "";
  position: absolute;
  left: -4px;
  top: -7px;
  width: 18px;
  height: 20px;
  background-color: #D9544D;
  clip-path: polygon(0 50%, 25% 0, 100% 0, 100% 100%, 25% 100%);
  border-radius: 2px 8px 8px 2px;
}

.right-decoration {
  right: 0;
  background: linear-gradient(to left, #D9544D, rgba(245, 178, 178, 0.7));
}

.right-decoration::before {
  content: "";
  position: absolute;
  right: -4px;
  top: -7px;
  width: 18px;
  height: 20px;
  background-color: #D9544D;
  clip-path: polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%);
  border-radius: 8px 2px 2px 8px;
}

.logo-container {
  margin-bottom: 15px;
  position: relative;
}

.logo-container::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1.5px;
  background-image: linear-gradient(to right, transparent, #E56D61 30%, #E56D61 70%, transparent);
}

.header-logo {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  border: 3px solid #D9544D;
  transition: all 0.4s ease;
  box-shadow: 0 0 0 3px rgba(255, 245, 245, 0.8), 0 0 18px rgba(217, 84, 77, 0.6);
  position: relative;
  z-index: 1;
  cursor: pointer;
}

.header-logo:hover {
  transform: scale(1.05) rotate(5deg);
  border-color: #E56D61;
  box-shadow: 0 0 0 4px rgba(255, 245, 245, 0.9), 0 0 22px rgba(229, 109, 97, 0.75);
}

.logo-container::before {
  content: "🔔";
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 26px;
  z-index: 3;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.25));
  animation: bell-swing 3s infinite ease-in-out;
  color: #E6A23C;
}

@keyframes bell-swing {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

.header-title {
  font-size: 2.8em;
  color: #B8433E;
  margin-bottom: 8px;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(255, 235, 235, 0.7);
}

.header-description {
  font-size: 0.95em;
  color: #C74840;
  max-width: 350px;
  text-align: center;
  line-height: 1.6;
  font-family: var(--font-family-sans-serif);
  opacity: 0.9;
}

.speech-bubble {
  position: absolute;
  background-color: #FFF5F5;
  border: 1.5px solid #D9544D;
  border-radius: 15px;
  padding: 10px 15px;
  font-size: 14px;
  width: 190px;
  box-shadow: 0 3px 10px rgba(217, 84, 77, 0.22);
  color: #B8433E;
  word-wrap: break-word;
  text-align: left;
  line-height: 1.5;
  font-family: var(--font-family-sans-serif);
  top: 15px;
  z-index: 10;
  --arrow-size: 8px;
  --arrow-offset: 15px;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  top: var(--arrow-offset);
}

.speech-bubble.left {
  right: calc(100% + 10px);
}
.speech-bubble.left::before {
  left: 100%;
  border-width: var(--arrow-size) 0 var(--arrow-size) var(--arrow-size);
  border-left-color: #D9544D;
}
.speech-bubble.left::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  top: calc(var(--arrow-offset) + 1.5px);
  left: calc(100% - 1.5px);
  border-width: calc(var(--arrow-size) - 1.5px) 0 calc(var(--arrow-size) - 1.5px) calc(var(--arrow-size) - 1.5px);
  border-left-color: #FFF5F5;
}

.speech-bubble.right {
  left: calc(100% + 10px);
}
.speech-bubble.right::before {
  right: 100%;
  border-width: var(--arrow-size) var(--arrow-size) var(--arrow-size) 0;
  border-right-color: #D9544D;
}
.speech-bubble.right::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  top: calc(var(--arrow-offset) + 1.5px);
  right: calc(100% - 1.5px);
  border-width: calc(var(--arrow-size) - 1.5px) calc(var(--arrow-size) - 1.5px) calc(var(--arrow-size) - 1.5px) 0;
  border-right-color: #FFF5F5;
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

@media (max-width: 600px) {
  .header-decoration {
    width: 60px;
  }
  .left-decoration::before,
  .right-decoration::before {
    display: none;
  }
  .header-title {
    font-size: 2.2em;
  }
  .header-description {
    font-size: 0.85em;
    max-width: 90%;
  }
  .speech-bubble {
    width: 150px;
    font-size: 13px;
  }
}

@media (max-width: 400px) {
  .header-decoration {
    display: none;
  }
   .header-logo {
    width: 70px;
    height: 70px;
  }
  .logo-container::before {
    font-size: 20px;
    top: -10px;
    right: -10px;
  }
  .header-title {
    font-size: 1.8em;
  }
}
</style> 