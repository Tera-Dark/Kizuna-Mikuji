<template>
  <Teleport to="body">
    <Transition name="tour">
      <div v-if="isVisible" class="tour-layer">
        <!-- 聚光挖洞 -->
        <div
          v-if="rect"
          class="tour-spotlight"
          :style="spotlightStyle"
          aria-hidden="true"
        ></div>

        <div
          ref="panelEl"
          class="tour-panel"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="step ? step.title : '新手引导'"
        >
          <div class="panel-rail" aria-hidden="true"></div>

          <div class="panel-top">
            <span class="step-seal">{{ numerals[current] }}</span>
            <span class="step-count">{{ current + 1 }} / {{ steps.length }}</span>
            <button class="skip-btn" type="button" @click="finish">{{ copy.skip }}</button>
          </div>

          <h3 class="panel-title">{{ step.title }}</h3>
          <p class="panel-body" v-html="step.body"></p>
          <p v-if="step.note" class="panel-note">{{ step.note }}</p>

          <div class="panel-foot">
            <div class="dots" aria-hidden="true">
              <span
                v-for="(_, i) in steps"
                :key="i"
                class="dot"
                :class="{ active: i === current, done: i < current }"
              ></span>
            </div>

            <div class="tour-btns">
              <button v-if="current > 0" class="btn ghost" type="button" @click="prev">
                {{ copy.prev }}
              </button>
              <button
                v-if="current < steps.length - 1"
                class="btn primary"
                type="button"
                @click="next"
              >
                {{ copy.next }}
                <AppIcon name="arrowRight" :size="14" />
              </button>
              <button v-else class="btn primary" type="button" @click="finish">
                {{ copy.finish }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

const props = defineProps({
  isVisible: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

const copy = voice.tutorial;
const steps = copy.steps;
const numerals = ['一', '二', '三', '四', '五', '六', '七', '八'];

const current = ref(0);
const rect = ref(null);
const placement = ref('center');
const panelEl = ref(null);
const panelSize = ref({ width: 340, height: 300 });

const step = computed(() => steps[current.value] || steps[0]);
const isCenter = computed(() => !rect.value);

/** 找目标元素；找不到就退回居中 */
const findTarget = (selector) => {
  if (!selector) return null;
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
};

const measure = () => {
  const el = panelEl.value;
  if (el) {
    panelSize.value = { width: el.offsetWidth, height: el.offsetHeight };
  }

  const target = findTarget(step.value.target);
  if (!target) {
    rect.value = null;
    placement.value = 'center';
    return;
  }

  const r = target.getBoundingClientRect();
  // 目标完全在视口外时也不画洞
  if (r.width === 0 || r.height === 0) {
    rect.value = null;
    placement.value = 'center';
    return;
  }

  rect.value = {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
    right: r.right,
    bottom: r.bottom,
  };
  placement.value = resolvePlacement(r, step.value.placement);
};

/** 空间不够就翻到另一边 */
const resolvePlacement = (r, wanted) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 16;
  const { width: pw, height: ph } = panelSize.value;

  const room = {
    bottom: vh - r.bottom - gap,
    top: r.top - gap,
    left: r.left - gap,
    right: vw - r.right - gap
  };

  const fits = {
    bottom: room.bottom >= ph,
    top: room.top >= ph,
    left: room.left >= pw,
    right: room.right >= pw
  };

  if (wanted && wanted !== 'center' && fits[wanted]) return wanted;

  // 右侧竖排按钮 -> 优先摆左边；顶部 -> 优先摆下面
  if (fits.right && pw < 380) return 'right';
  if (fits.bottom) return 'bottom';
  if (fits.left) return 'left';
  if (fits.top) return 'top';
  return wanted || 'bottom';
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const spotlightStyle = computed(() => {
  if (!rect.value) return {};
  const pad = 6;
  return {
    top: `${rect.value.top - pad}px`,
    left: `${rect.value.left - pad}px`,
    width: `${rect.value.width + pad * 2}px`,
    height: `${rect.value.height + pad * 2}px`
  };
});

const panelStyle = computed(() => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 14;
  const gap = 16;
  const { width: pw, height: ph } = panelSize.value;

  if (isCenter.value) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${Math.min(360, vw - margin * 2)}px`
    };
  }

  const r = rect.value;
  let top = 0;
  let left = 0;

  switch (placement.value) {
    case 'top':
      top = r.top - gap - ph;
      left = r.left + r.width / 2 - pw / 2;
      break;
    case 'left':
      top = r.top + r.height / 2 - ph / 2;
      left = r.left - gap - pw;
      break;
    case 'right':
      top = r.top + r.height / 2 - ph / 2;
      left = r.right + gap;
      break;
    default:
      top = r.bottom + gap;
      left = r.left + r.width / 2 - pw / 2;
  }

  return {
    top: `${clamp(top, margin, Math.max(margin, vh - ph - margin))}px`,
    left: `${clamp(left, margin, Math.max(margin, vw - pw - margin))}px`,
    width: `${Math.min(360, vw - margin * 2)}px`,
    transform: 'none'
  };
});

let scrollTimer = null;

const goTo = async (index) => {
  current.value = Math.max(0, Math.min(steps.length - 1, index));
  const target = findTarget(step.value.target);

  if (target) {
    target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(measure, 380);
  }

  await nextTick();
  measure();
  if (target) {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(measure, 420);
  }
};

const next = () => goTo(current.value + 1);
const prev = () => goTo(current.value - 1);

const finish = () => {
  localStorage.setItem('hasSeenTutorial', 'true');
  emit('close');
};

const handleKeydown = (e) => {
  if (!props.isVisible) return;
  if (e.key === 'Escape') {
    finish();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault();
    current.value < steps.length - 1 ? next() : finish();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prev();
  }
};

const onViewportChange = () => {
  if (props.isVisible) measure();
};

watch(
  () => props.isVisible,
  async (visible) => {
    if (visible) {
      current.value = 0;
      await nextTick();
      measure();
      const target = findTarget(step.value.target);
      if (target) {
        target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
        setTimeout(measure, 400);
      }
    } else {
      rect.value = null;
    }
  }
);

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('scroll', onViewportChange, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', onViewportChange);
  window.removeEventListener('scroll', onViewportChange);
  clearTimeout(scrollTimer);
});
</script>

<style scoped>
.tour-layer {
  position: fixed;
  inset: 0;
  z-index: 2000;
}

/* 挖洞：巨大的外阴影就是遮罩 */
.tour-spotlight {
  position: fixed;
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(34, 22, 20, 0.66);
  border: 1px solid rgba(255, 236, 226, 0.55);
  transition: top 0.28s ease, left 0.28s ease, width 0.28s ease, height 0.28s ease;
  pointer-events: none;
}

.tour-spotlight::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 11px;
  border: 1px solid rgba(188, 59, 42, 0.55);
  animation: spot-breathe 2.4s ease-in-out infinite;
}

@keyframes spot-breathe {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.85; }
}

/* 引导面板：一张纸 */
.tour-panel {
  position: fixed;
  padding: 16px 18px 15px;
  border-radius: var(--radius-slip);
  background-color: var(--c-paper);
  background-image: linear-gradient(180deg, #FFFCF5, #F8EFE1);
  border: 1px solid var(--c-line-strong);
  box-shadow: 0 18px 48px rgba(34, 22, 20, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  color: var(--c-ink);
  max-height: calc(100vh - 28px);
  overflow-y: auto;
  transition: top 0.28s ease, left 0.28s ease;
}

.panel-rail {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--c-shu), rgba(188, 59, 42, 0.25));
  border-radius: var(--radius-slip) 0 0 var(--radius-slip);
}

.panel-top {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
}

.step-seal {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.76em;
  color: #FFF6F0;
  background: var(--c-shu);
  border-radius: 2px;
}

.step-count {
  font-family: var(--font-ui);
  font-size: 0.68em;
  letter-spacing: 0.12em;
  color: var(--c-ink-faint);
}

.skip-btn {
  margin-left: auto;
  padding: 2px 0;
  border: none;
  background: none;
  font-family: var(--font-ui);
  font-size: 0.68em;
  letter-spacing: 0.1em;
  color: var(--c-ink-faint);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--c-line-strong);
}

.skip-btn:hover { color: var(--c-shu); }

.panel-title {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 1.14em;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--c-ink);
}

.panel-body {
  margin: 0;
  font-size: 0.86em;
  line-height: 1.85;
  color: var(--c-ink-soft);
}

.panel-body :deep(.highlight) {
  color: var(--c-shu);
  font-weight: 700;
  padding: 0 1px;
  border-bottom: 1px solid rgba(188, 59, 42, 0.35);
}

.panel-note {
  margin: 9px 0 0;
  padding: 7px 10px;
  font-size: 0.76em;
  line-height: 1.7;
  color: var(--c-ink-faint);
  background: rgba(188, 59, 42, 0.05);
  border-left: 2px solid rgba(188, 59, 42, 0.35);
  border-radius: 0 3px 3px 0;
}

.panel-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding-top: 11px;
  border-top: 1px dashed var(--c-line);
}

.dots {
  display: flex;
  gap: 5px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(143, 39, 28, 0.18);
  transition: all 0.25s ease;
}

.dot.done { background: rgba(143, 39, 28, 0.45); }
.dot.active {
  width: 14px;
  border-radius: 3px;
  background: var(--c-shu);
}

.tour-btns {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 7px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 13px;
  font-family: var(--font-ui);
  font-size: 0.76em;
  letter-spacing: 0.06em;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.ghost {
  border: 1px solid var(--c-line-strong);
  background: transparent;
  color: var(--c-ink-soft);
}

.btn.ghost:hover { border-color: var(--c-shu); color: var(--c-shu); }

.btn.primary {
  border: 1px solid var(--c-shu-deep);
  background: var(--c-shu);
  color: #FFF6F0;
}

.btn.primary:hover { background: var(--c-shu-deep); }

.tour-enter-active,
.tour-leave-active { transition: opacity 0.25s ease; }

.tour-enter-from,
.tour-leave-to { opacity: 0; }

@media (max-width: 520px) {
  .tour-panel { padding: 14px 15px 13px; }
  .panel-title { font-size: 1.05em; }
  .panel-body { font-size: 0.82em; }
  .panel-note { font-size: 0.72em; }
}
</style>
