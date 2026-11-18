<template>
  <header class="shrine-header">
    <!-- 檐下的铃 -->
    <div class="bell-cord" aria-hidden="true">
      <span class="cord"></span>
      <AppIcon name="bell" :size="22" :weight="1.4" class="bell-icon" />
    </div>

    <p class="shrine-kicker">{{ site.reading }} · {{ site.roman }}</p>

    <div class="crest">
      <span class="crest-line left" aria-hidden="true"></span>
      <div class="portrait-frame">
        <img src="/images/缘结神头像.png" alt="缘结神" class="header-logo" @click="playRandomVoice">
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
        <span class="portrait-seal" aria-hidden="true">縁</span>
      </div>
      <span class="crest-line right" aria-hidden="true"></span>
    </div>

    <h1 class="header-title">{{ site.name }}</h1>
    <p class="header-description">{{ voice.header.description }}</p>

    <button class="archive-link" type="button" @click="$emit('open-archive')">
      <AppIcon name="scroll" :size="14" />
      {{ voice.header.archive }}
    </button>
  </header>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { playSound, stopSound } from '../utils/audioUtils';
import { site, voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

defineEmits(['open-archive']);

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
  if (currentAudio) {
    stopSound(currentAudio);
  }

  const randomIndex = Math.floor(Math.random() * voiceFiles.length);
  const selectedVoice = voiceFiles[randomIndex];

  playSound(`sounds/缘结神语录合集/${selectedVoice}`, 1.0, error => {
    console.error('播放音频失败:', error);
  }).then(audio => {
    currentAudio = audio;
  }).catch(error => {
    console.error('创建音频对象失败:', error);
  });

  showSpeechBubble(selectedVoice);
};

// 显示聊天框
const showSpeechBubble = (voiceFile: string) => {
  const content = voiceFile.replace('.mp3', '');
  const position = Math.random() > 0.5 ? 'left' : 'right';
  const bubble = position === 'left' ? leftBubble : rightBubble;

  if (bubble.timerId !== null) {
    clearTimeout(bubble.timerId);
  }

  bubble.content = content;
  bubble.visible = true;

  bubble.timerId = window.setTimeout(() => {
    bubble.visible = false;
    bubble.timerId = null;
  }, 4000);
};
</script>

<style scoped>
.shrine-header {
  position: relative;
  width: 100%;
  padding: 34px 16px 22px;
  text-align: center;
  isolation: isolate;
}

.bell-cord {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cord {
  width: 1px;
  height: 16px;
  background: linear-gradient(180deg, transparent, var(--c-line-strong));
}

.bell-icon {
  color: var(--c-shu);
  transform-origin: 50% 0;
  animation: bell-sway 5s ease-in-out infinite;
}

@keyframes bell-sway {
  0%, 100% { transform: rotate(-7deg); }
  50% { transform: rotate(7deg); }
}

.shrine-kicker {
  margin: 10px 0 14px;
  font-family: var(--font-ui);
  font-size: 0.64em;
  letter-spacing: 0.42em;
  text-indent: 0.42em;
  color: var(--c-ink-faint);
  text-transform: uppercase;
}

.crest {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.crest-line {
  height: 1px;
  width: 64px;
  background: linear-gradient(90deg, transparent, var(--c-line-strong));
}

.crest-line.right {
  background: linear-gradient(90deg, var(--c-line-strong), transparent);
}

.portrait-frame {
  position: relative;
  width: 98px;
  height: 98px;
  flex: 0 0 auto;
}

.portrait-frame::before {
  content: '';
  position: absolute;
  inset: -9px;
  border-radius: 50%;
  border: 1px solid var(--c-line-strong);
}

.portrait-frame::after {
  content: '';
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  border: 1px dashed rgba(180, 136, 61, 0.45);
}

.header-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid rgba(143, 39, 28, 0.35);
  cursor: pointer;
  transition: transform 0.4s ease, filter 0.4s ease;
  filter: saturate(0.92) contrast(1.02);
}

.header-logo:hover {
  transform: scale(1.04);
  filter: saturate(1.05) contrast(1.04);
}

.portrait-seal {
  position: absolute;
  right: -10px;
  bottom: -4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 13px;
  color: #fff6f0;
  background: var(--c-shu);
  border-radius: 3px;
  transform: rotate(-8deg);
  box-shadow: 0 2px 6px rgba(143, 39, 28, 0.3);
}

.header-title {
  margin: 18px 0 6px;
  font-family: var(--font-display);
  font-size: 2.55em;
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: 0.22em;
  text-indent: 0.22em;
  color: var(--c-ink);
}

.header-description {
  margin: 0 auto;
  max-width: 330px;
  font-size: 0.86em;
  line-height: 1.85;
  color: var(--c-ink-soft);
}

.archive-link {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  background: rgba(252, 247, 238, 0.6);
  color: var(--c-shu);
  font-family: var(--font-ui);
  font-size: 0.72em;
  letter-spacing: 0.18em;
  cursor: pointer;
  transition: all 0.25s ease;
}

.archive-link:hover {
  background: var(--c-shu);
  border-color: var(--c-shu);
  color: #fff6f0;
}

/* 气泡 */
.speech-bubble {
  position: absolute;
  background-color: var(--c-paper);
  border: 1px solid var(--c-line-strong);
  border-radius: 4px;
  padding: 10px 14px;
  font-size: 13px;
  width: 190px;
  box-shadow: var(--shadow-paper-sm);
  color: var(--c-ink-soft);
  word-wrap: break-word;
  text-align: left;
  line-height: 1.6;
  top: 18px;
  z-index: 10;
  --arrow-size: 7px;
  --arrow-offset: 16px;
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

.speech-bubble.left { right: calc(100% + 12px); }
.speech-bubble.left::before {
  left: 100%;
  border-width: var(--arrow-size) 0 var(--arrow-size) var(--arrow-size);
  border-left-color: var(--c-line-strong);
}
.speech-bubble.left::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  top: calc(var(--arrow-offset) + 1px);
  left: calc(100% - 1px);
  border-width: calc(var(--arrow-size) - 1px) 0 calc(var(--arrow-size) - 1px) calc(var(--arrow-size) - 1px);
  border-left-color: var(--c-paper);
}

.speech-bubble.right { left: calc(100% + 12px); }
.speech-bubble.right::before {
  right: 100%;
  border-width: var(--arrow-size) var(--arrow-size) var(--arrow-size) 0;
  border-right-color: var(--c-line-strong);
}
.speech-bubble.right::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  top: calc(var(--arrow-offset) + 1px);
  right: calc(100% - 1px);
  border-width: calc(var(--arrow-size) - 1px) calc(var(--arrow-size) - 1px) calc(var(--arrow-size) - 1px) 0;
  border-right-color: var(--c-paper);
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

@media (max-width: 600px) {
  .shrine-header { padding-top: 30px; }
  .crest-line { width: 34px; }
  .header-title { font-size: 2.05em; }
  .header-description { font-size: 0.8em; max-width: 86%; }
  .speech-bubble { width: 150px; font-size: 12px; }
}

@media (max-width: 400px) {
  .crest-line { display: none; }
  .portrait-frame { width: 84px; height: 84px; }
  .header-title { font-size: 1.8em; letter-spacing: 0.16em; }
}
</style>
