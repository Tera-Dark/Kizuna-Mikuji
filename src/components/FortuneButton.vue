<template>
  <div class="onmyoji-button-container" data-tour="draw">
    <button
      type="button"
      class="cylinder-btn"
      :class="{ 'is-drawing': isDrawing, disabled: isDrawing || props.disabled }"
      :aria-label="isDrawing ? '正在摇签' : '摇一支签'"
      :aria-busy="isDrawing"
      :disabled="isDrawing || props.disabled"
      @click="drawFortune"
    >
      <svg class="cylinder-svg" viewBox="0 0 260 330" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="fc-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#571B13" />
            <stop offset="0.16" stop-color="#83291D" />
            <stop offset="0.46" stop-color="#A23826" />
            <stop offset="0.72" stop-color="#7F271B" />
            <stop offset="1" stop-color="#48140D" />
          </linearGradient>
          <linearGradient id="fc-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#7A2A1E" />
            <stop offset="0.5" stop-color="#C0543C" />
            <stop offset="1" stop-color="#6E2419" />
          </linearGradient>
          <linearGradient id="fc-stick" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#DCC49A" />
            <stop offset="0.45" stop-color="#F2E2BF" />
            <stop offset="1" stop-color="#C9AE82" />
          </linearGradient>
        </defs>

        <!-- 落地影 -->
        <ellipse cx="130" cy="300" rx="66" ry="11" fill="rgba(92,44,32,0.13)" />

        <g class="cylinder-group">
          <!-- 筒身 -->
          <path d="M76 96 L84 278 A46 12 0 0 0 176 278 L184 96 Z" fill="url(#fc-body)" />
          <path
            d="M101 99 L106 274"
            stroke="rgba(255,225,200,0.18)"
            stroke-width="7"
            stroke-linecap="round"
            fill="none"
          />
          <path
            d="M160 99 L156 275"
            stroke="rgba(50,14,10,0.22)"
            stroke-width="10"
            stroke-linecap="round"
            fill="none"
          />

          <!-- 底沿 -->
          <ellipse cx="130" cy="278" rx="46" ry="12" fill="url(#fc-rim)" />
          <ellipse cx="130" cy="276" rx="46" ry="11" fill="none" stroke="rgba(255,220,190,0.22)" stroke-width="1.2" />

          <!-- 签：从筒口探出来 -->
          <g class="sticks">
            <rect x="100" y="72" width="6" height="40" rx="2.6" fill="url(#fc-stick)" />
            <rect x="109" y="62" width="6" height="50" rx="2.6" fill="url(#fc-stick)" />
            <rect x="118" y="76" width="6" height="36" rx="2.6" fill="url(#fc-stick)" />
            <rect x="127" y="52" width="6.5" height="60" rx="2.8" fill="url(#fc-stick)" />
            <rect x="127" y="52" width="6.5" height="10" rx="2.8" fill="#BC3B2A" />
            <rect x="137" y="66" width="6" height="46" rx="2.6" fill="url(#fc-stick)" />
            <rect x="146" y="74" width="6" height="38" rx="2.6" fill="url(#fc-stick)" />
            <rect x="155" y="60" width="6" height="52" rx="2.6" fill="url(#fc-stick)" />
          </g>

          <!-- 筒口：深口 + 前沿压住签脚 -->
          <ellipse cx="130" cy="96" rx="54" ry="14" fill="#4A1811" />
          <ellipse cx="130" cy="96" rx="48" ry="10.5" fill="#2B0F0A" />
          <path
            d="M76 96 A54 14 0 0 0 184 96 A48 10.5 0 0 1 76 96 Z"
            fill="url(#fc-rim)"
          />
          <path
            d="M76 96 A54 14 0 0 0 184 96"
            fill="none"
            stroke="rgba(255,226,200,0.35)"
            stroke-width="1.4"
          />

          <!-- 和纸标签 -->
          <g transform="rotate(-2.5 130 200)">
            <rect x="90" y="146" width="80" height="108" rx="1.5" fill="#FBF4E4" />
            <rect x="90" y="146" width="80" height="108" rx="1.5" fill="none" stroke="rgba(143,39,28,0.16)" />
            <rect x="90" y="146" width="80" height="5" fill="rgba(143,39,28,0.10)" />
            <text class="label-text" x="124" y="181">御</text>
            <text class="label-text" x="124" y="213">神</text>
            <text class="label-text" x="124" y="245">签</text>
            <g transform="translate(140 150) rotate(4)">
              <rect width="23" height="23" rx="1" fill="#BC3B2A" />
              <text class="label-seal" x="11.5" y="17" text-anchor="middle">縁</text>
            </g>
          </g>

          <!-- 红绳：绕两圈，打个结 -->
          <path d="M81 258 Q130 268 179 258" stroke="#A62E20" stroke-width="3.6" fill="none" stroke-linecap="round" />
          <path d="M82 266 Q130 276 178 266" stroke="#BC3B2A" stroke-width="3.2" fill="none" stroke-linecap="round" />
          <circle cx="130" cy="270" r="4.6" fill="#8F271C" />
          <circle cx="130" cy="270" r="2" fill="#D07164" />

          <g class="cord-tails">
            <path d="M130 274 C 128 284, 121 289, 122 299" stroke="#BC3B2A" stroke-width="2.6" fill="none" stroke-linecap="round" />
            <path d="M130 274 C 133 284, 141 288, 140 298" stroke="#A62E20" stroke-width="2.4" fill="none" stroke-linecap="round" />
            <circle cx="122" cy="300" r="2.8" fill="#BC3B2A" />
            <circle cx="140" cy="299" r="2.6" fill="#A62E20" />
          </g>
        </g>

        <!-- 摇出来的那一支：从筒口弹出，落到地上 -->
        <g class="flying-stick" :class="{ 'is-flying': isDrawing }" aria-hidden="true">
          <rect x="125.5" y="80" width="9" height="80" rx="3.5" fill="#EAD8B4" stroke="#C9AE80" stroke-width="0.8" />
          <rect x="125.5" y="80" width="9" height="14" rx="3.5" fill="#BC3B2A" />
        </g>
      </svg>
    </button>

    <p class="draw-instruction" :class="{ 'is-drawing': isDrawing }">
      {{ isDrawing ? '……听着。' : instruction }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';
import { useAudio } from '../composables/useAudio';
import { getButtonInstruction } from '../constants/enmusubi';

const props = defineProps({
  category: {
    type: String,
    default: '爱情缘分'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'animation-start', 'animation-end', 'sound-error']);

const fortuneStore = useFortuneStore();
const isDrawing = ref(false);

const { play, hasError } = useAudio();

const instruction = computed(() => getButtonInstruction(fortuneStore.currentCategory));

const drawFortune = async () => {
  if (isDrawing.value || props.disabled) return;

  isDrawing.value = true;
  emit('animation-start');
  emit('click');

  try {
    await playWindChimeSound();

    await new Promise((resolve) => setTimeout(resolve, 1750));
    fortuneStore.drawFortune();
  } catch (error) {
    console.error('抽签失败:', error);
  } finally {
    setTimeout(() => {
      isDrawing.value = false;
      emit('animation-end');
    }, 500);
  }
};

const playWindChimeSound = async () => {
  try {
    await play('sounds/wind-chime.mp3', 0.7);
  } catch (error) {
    console.warn('播放音效失败:', error);
    emit('sound-error');
  }

  if (hasError.value) {
    emit('sound-error');
  }
};

defineExpose({ drawFortune });
</script>

<style scoped>
.onmyoji-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 4px auto 0;
}

.cylinder-btn {
  display: block;
  width: clamp(170px, 15vw, 206px);
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.cylinder-btn:focus-visible {
  outline: 2px solid var(--c-shu);
  outline-offset: 8px;
  border-radius: 10px;
}

.cylinder-btn.disabled {
  cursor: default;
}

.cylinder-svg {
  display: block;
  width: 100%;
  height: auto;
}

.cylinder-group {
  transform-box: fill-box;
  transform-origin: 50% 92%;
}

.cylinder-btn:hover .cylinder-group {
  animation: fc-tip 1.4s ease-in-out infinite;
}

.cylinder-btn.is-drawing .cylinder-group {
  animation: fc-shake 0.48s ease-in-out 3;
}

.sticks {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

.cylinder-btn.is-drawing .sticks {
  animation: fc-rattle 0.22s ease-in-out 7;
}

.cord-tails {
  transform-box: fill-box;
  transform-origin: 50% 0%;
}

.cylinder-btn:hover .cord-tails {
  animation: fc-sway 2.6s ease-in-out infinite;
}

.label-text {
  font-family: var(--font-display);
  font-family: var(--font-body);
  font-size: 20px;
  fill: var(--c-ink);
  text-anchor: middle;
}

.label-seal {
  font-family: var(--font-display);
  font-size: 15px;
  fill: #FFF6F0;
}

.draw-instruction {
  max-width: 230px;
  margin: 0;
  font-family: var(--font-ui);
  font-size: 12px;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: var(--c-ink-faint);
  text-align: center;
  transition: opacity 0.2s ease;
}

.draw-instruction.is-drawing {
  color: var(--c-shu);
}

.flying-stick {
  opacity: 0;
  transform-box: view-box;
  transform-origin: 130px 160px;
  pointer-events: none;
}

.flying-stick.is-flying {
  animation: fc-fall 0.7s cubic-bezier(0.3, 0.6, 0.5, 1) 0.85s forwards;
}

@keyframes fc-fall {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(0deg);
  }
  12% {
    opacity: 1;
    transform: translate(8px, -34px) rotate(-16deg);
  }
  40% {
    transform: translate(26px, -20px) rotate(18deg);
  }
  100% {
    opacity: 1;
    transform: translate(36px, 140px) rotate(90deg);
  }
}

@keyframes fc-shake {
  0%,
  100% {
    transform: rotate(0deg) translateY(0);
  }
  20% {
    transform: rotate(-4.5deg) translateY(-2px);
  }
  45% {
    transform: rotate(4.5deg) translateY(-1px);
  }
  70% {
    transform: rotate(-2.5deg) translateY(-1px);
  }
  88% {
    transform: rotate(1.6deg);
  }
}

@keyframes fc-rattle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes fc-tip {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-1.2deg);
  }
}

@keyframes fc-sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(3.5deg);
  }
}

@media (max-width: 860px) {
  .cylinder-btn {
    width: clamp(158px, 44vw, 190px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cylinder-btn:hover .cylinder-group,
  .cylinder-btn:hover .cord-tails,
  .cylinder-btn.is-drawing .cylinder-group,
  .cylinder-btn.is-drawing .sticks {
    animation: none;
  }
}
</style>
