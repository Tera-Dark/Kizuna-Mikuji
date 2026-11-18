<template>
  <main class="home-view">
    <section class="home-hero">
      <div class="hero-portrait">
        <img src="/images/avatar-256.webp" alt="缘结神" width="256" height="256" fetchpriority="high" decoding="async" />
        <span class="portrait-seal">缘</span>
      </div>

      <div class="hero-copy">
        <p class="hero-eyebrow">{{ copy.eyebrow }}</p>
        <h1>{{ copy.title }}</h1>
        <p class="hero-note">{{ copy.note }}</p>
        <div class="hero-links">
          <RouterLink to="/about" class="text-link">{{ copy.about }}</RouterLink>
          <button type="button" class="text-link" @click="showTutorial = true">怎么用</button>
        </div>
      </div>

      <div class="hero-stamp" aria-hidden="true">
        <span>本日</span>
        <strong>{{ todayLabel }}</strong>
      </div>
    </section>

    <section class="rite-section">
      <header class="section-head">
        <span class="section-index">一</span>
        <h2>{{ copy.riteTitle }}</h2>
        <span class="section-rule"></span>
      </header>
      <p class="section-note">{{ copy.riteNote }}</p>

      <div class="rite-grid">
        <button type="button" class="rite-card primary" @click="openTool(tools[2])">
          <span class="rite-seal" aria-hidden="true">缘</span>
          <span class="rite-copy">
            <strong>{{ copy.riteCouple }}</strong>
            <span>{{ copy.riteCoupleNote }}</span>
          </span>
          <AppIcon name="thread" :size="20" class="rite-icon" />
        </button>
        <button type="button" class="rite-card" @click="openTool(tools[1])">
          <span class="rite-copy">
            <strong>{{ copy.riteZodiac }}</strong>
            <span>{{ copy.riteZodiacNote }}</span>
          </span>
          <AppIcon name="star" :size="18" class="rite-icon" />
        </button>
      </div>
    </section>

    <section class="ask-grid">
      <div class="ask-lines">
        <header class="section-head">
          <span class="section-index">二</span>
          <h2>{{ copy.askTitle }}</h2>
          <span class="section-rule"></span>
        </header>
        <p class="section-note">{{ copy.askNote }}</p>

        <button
          v-for="(line, index) in primaryLines"
          :key="line.id"
          type="button"
          class="ask-line"
          :class="{ active: selectedLineId === line.id && !activeTool }"
          @click="selectLine(line)"
        >
          <span class="ask-no">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="ask-body">
            <span class="ask-label">{{ line.label }}</span>
            <span class="ask-note">{{ line.note }}</span>
          </span>
          <AppIcon name="arrowRight" :size="14" class="ask-arrow" />
        </button>

        <button type="button" class="more-toggle" @click="moreOpen = !moreOpen">
          <span>{{ copy.more }}</span>
          <span class="more-count">{{ moreLines.length }}</span>
          <AppIcon name="plus" :size="12" :class="{ rotated: moreOpen }" />
        </button>

        <div v-if="moreOpen" class="more-lines">
          <button
            v-for="line in moreLines"
            :key="line.id"
            type="button"
            class="more-line"
            :class="{ active: selectedLineId === line.id && !activeTool }"
            @click="selectLine(line)"
          >
            <AppIcon :name="line.icon" :size="14" />
            <span class="more-label">{{ line.label }}</span>
            <span class="more-note">{{ line.note }}</span>
          </button>
        </div>
      </div>

      <div ref="drawStage" class="draw-stage" data-tour="draw">
        <div class="stage-head">
          <span class="stage-kicker">{{ copy.current }}</span>
          <span class="stage-name">{{ stageName }}</span>
          <span class="stage-index">{{ stageIndex }}</span>
        </div>

        <FortuneButton
          v-if="!activeTool"
          ref="fortuneButtonRef"
          :category="selectedLine.label"
          :disabled="isAnimating"
          @click="pendingReveal = true"
          @animation-start="isAnimating = true"
          @animation-end="isAnimating = false"
          @sound-error="handleSoundError"
        />

        <div v-else class="stage-tool">
          <p>这条线不靠摇。</p>
          <span class="stage-tool-note">往下填。填完本神明再看。</span>
        </div>

        <p v-if="!activeTool" class="stage-foot">{{ copy.drawFoot }}</p>
      </div>
    </section>

    <section v-if="activeTool" ref="toolSection" class="tool-section">
      <header class="section-head">
        <span class="section-index">三</span>
        <h2>{{ activeTool.label }}</h2>
        <span class="section-rule"></span>
        <button type="button" class="back-link" @click="closeTool">{{ copy.back }}</button>
      </header>
      <p class="section-note">{{ activeTool.longNote }}</p>
      <div class="tool-mount">
        <component :is="toolComponents[activeTool.id]" />
      </div>
    </section>

    <section ref="resultSection" class="result-section">
      <FortuneResult
        v-if="fortuneStore.selectedFortune && !activeTool"
        :fortune="fortuneStore.selectedFortune"
        :type-color="fortuneStore.fortuneTypeColor"
        @draw-again="handleDrawAgain"
      />
    </section>

    <section class="tool-directory">
      <header class="section-head">
        <span class="section-index">四</span>
        <h2>{{ copy.toolsTitle }}</h2>
        <span class="section-rule"></span>
      </header>
      <p class="section-note">{{ copy.toolsNote }}</p>

      <div class="tool-grid">
        <button
          v-for="tool in tools"
          :key="tool.id"
          type="button"
          class="tool-item"
          :class="{ active: activeTool && activeTool.id === tool.id }"
          @click="openTool(tool)"
        >
          <span class="tool-icon"><AppIcon :name="tool.icon" :size="17" /></span>
          <span class="tool-copy">
            <span class="tool-label">{{ tool.label }}</span>
            <span class="tool-note">{{ tool.note }}</span>
          </span>
          <AppIcon name="arrowRight" :size="12" class="tool-arrow" />
        </button>
      </div>
    </section>

    <SoundMissingHint :is-visible="showSoundError" @close="showSoundError = false" />
    <OnboardingTour :is-visible="showTutorial" @close="closeTutorial" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, defineAsyncComponent } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';
import { voice } from '../constants/enmusubi';
import AppIcon from '../components/icons/AppIcon.vue';
import FortuneButton from '../components/FortuneButton.vue';
import FortuneResult from '../components/FortuneResult.vue';
import SoundMissingHint from '../components/SoundMissingHint.vue';
import OnboardingTour from '../components/OnboardingTour.vue';

const NameFortune = defineAsyncComponent(() => import('../components/NameFortune.vue'));
const ZodiacCompatibility = defineAsyncComponent(() => import('../components/ZodiacCompatibility.vue'));
const CoupleFortuneDrawing = defineAsyncComponent(() => import('../components/CoupleFortuneDrawing.vue'));
const DestinyBall = defineAsyncComponent(() => import('../components/DestinyBall.vue'));

const copy = voice.home;
const fortuneStore = useFortuneStore();

const primaryLines = [
  { id: 'daily', label: '今天', note: '就看今天。明天的事，明天再说。', icon: 'sun' },
  { id: 'love', label: '感情', note: '你心里那个人。别装没有。', icon: 'heart' },
  { id: 'relationship', label: '人际', note: '谁近谁远，谁欠你一句话。', icon: 'branches' },
  { id: 'career', label: '饭碗', note: '工作、钱、要不要辞职。', icon: 'briefcase' },
  { id: 'health', label: '身体', note: '别的都能扛，这个别硬扛。', icon: 'leaf' },
];

const moreLines = [
  { id: 'past_life', label: '上辈子', note: '没说完的话', icon: 'hourglass' },
  { id: 'study', label: '读书', note: '考试、论文、学不进去', icon: 'book' },
  { id: 'general', label: '随便问问', note: '没什么大事，就想听人说两句', icon: 'moon' },
];

const tools = [
  { id: 'name', label: '姓名', note: '名字里的线头', longNote: '报上名字。本神明看看这名字里缠着什么。', icon: 'brush' },
  { id: 'zodiac', label: '星座', note: '两颗星合不合', longNote: '报两个星座。本神明看看你们是互相照亮，还是互相挡光。', icon: 'star' },
  { id: 'couple', label: '配对', note: '两个人的名字', longNote: '报两个名字。本神明量一量这条线缠得紧不紧。', icon: 'rings' },
  { id: 'destiny_ball', label: '御守', note: '问一件具体的事', longNote: '心里想一件具体的事。别太贪心，御守装不下。', icon: 'omamori' },
];

const toolComponents = {
  name: NameFortune,
  zodiac: ZodiacCompatibility,
  couple: CoupleFortuneDrawing,
  destiny_ball: DestinyBall,
};

const allLines = [...primaryLines, ...moreLines];

const selectedLineId = ref('daily');
const moreOpen = ref(false);
const activeTool = ref(null);
const isAnimating = ref(false);
const pendingReveal = ref(false);
const showTutorial = ref(false);
const showSoundError = ref(false);
const fortuneButtonRef = ref(null);
const drawStage = ref(null);
const toolSection = ref(null);
const resultSection = ref(null);

const selectedLine = computed(
  () => allLines.find((line) => line.id === selectedLineId.value) || primaryLines[0]
);
const selectedLineIndex = computed(() =>
  String(allLines.findIndex((line) => line.id === selectedLineId.value) + 1).padStart(2, '0')
);
const stageName = computed(() => (activeTool.value ? activeTool.value.label : selectedLine.value.label));
const stageIndex = computed(() => (activeTool.value ? '工具' : selectedLineIndex.value));

const todayLabel = computed(() => {
  const date = new Date();
  return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, '0')}`;
});

const scrollTo = (el, block = 'start') => {
  if (!el) return;
  window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block }), 80);
};

const selectLine = (line) => {
  activeTool.value = null;
  selectedLineId.value = line.id;
  fortuneStore.setCategory(line.id);
  if (window.innerWidth < 860) scrollTo(drawStage.value);
};

const openTool = async (tool) => {
  activeTool.value = tool;
  selectedLineId.value = tool.id;
  moreOpen.value = false;
  fortuneStore.setCategory(tool.id);
  await nextTick();
  scrollTo(toolSection.value);
};

const closeTool = () => {
  activeTool.value = null;
  selectedLineId.value = 'daily';
  fortuneStore.setCategory('daily');
  scrollTo(drawStage.value);
};

const handleSoundError = () => {
  if (localStorage.getItem('soundHintDismissed') !== 'true') {
    showSoundError.value = true;
  }
};

const closeTutorial = () => {
  showTutorial.value = false;
  localStorage.setItem('hasSeenTutorial', 'true');
};

const handleDrawAgain = () => {
  fortuneStore.resetFortune();
  window.setTimeout(() => fortuneButtonRef.value?.drawFortune(), 280);
};

watch(
  () => fortuneStore.selectedFortune,
  async (fortune) => {
    if (!fortune || !pendingReveal.value) return;
    pendingReveal.value = false;
    await nextTick();
    scrollTo(resultSection.value);
  }
);

const onKeydown = (event) => {
  if (event.shiftKey && event.key === 'T') {
    showTutorial.value = true;
  }
  if (event.shiftKey && event.key === 'R') {
    localStorage.removeItem('hasSeenTutorial');
    showTutorial.value = true;
  }
};

onMounted(() => {
  fortuneStore.setCategory('daily');
  fortuneStore.resetFortune();

  if (localStorage.getItem('hasSeenTutorial') !== 'true') {
    window.setTimeout(() => {
      showTutorial.value = true;
    }, 1100);
  }

  window.addEventListener('keydown', onKeydown);
  window.addEventListener('enmusubi:tutorial', openTutorial);
});

const openTutorial = () => {
  showTutorial.value = true;
};

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('enmusubi:tutorial', openTutorial);
});
</script>

<style scoped>
.home-view {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 34px 0 0;
}

/* ---------- 开场 ---------- */
.home-hero {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  padding-bottom: 34px;
  border-bottom: 1px solid var(--c-line);
}

.hero-portrait {
  position: relative;
  width: 78px;
  height: 78px;
}

.hero-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--c-line-strong);
  filter: saturate(0.9);
}

.portrait-seal {
  position: absolute;
  right: -4px;
  bottom: -2px;
  width: 21px;
  height: 21px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 13px;
  border-radius: 1px;
}

.hero-eyebrow {
  margin-bottom: 10px;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--c-ink-faint);
}

.hero-copy h1 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: clamp(1.95rem, 3.9vw, 2.95rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.04em;
  color: var(--c-ink);
}

.hero-note {
  max-width: 34em;
  font-size: 15.5px;
  line-height: 1.8;
  color: var(--c-ink-soft);
  text-wrap: balance;
}

.hero-links {
  display: flex;
  gap: 18px;
  margin-top: 14px;
}

.text-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--c-shu);
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
  border-bottom: 1px solid var(--c-line-strong);
  line-height: 1.6;
}

.text-link:hover {
  border-bottom-color: var(--c-shu);
}

.hero-stamp {
  width: 58px;
  padding: 8px 0 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--c-line-strong);
  color: var(--c-shu);
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.16em;
}

.hero-stamp strong {
  font-family: var(--font-display);
  font-size: 15.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ---------- 问签 ---------- */
.rite-section {
  padding-top: 44px;
}

.rite-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.rite-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  text-align: left;
  background: rgba(253, 249, 241, 0.62);
  border: 1px solid var(--c-line);
  color: inherit;
  cursor: pointer;
  transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}

.rite-card.primary {
  background: linear-gradient(180deg, rgba(188, 59, 42, 0.09), rgba(188, 59, 42, 0.04));
  border-color: var(--c-line-strong);
}

.rite-card:hover {
  transform: translateY(-2px);
  border-color: var(--c-shu);
}

.rite-card:focus-visible {
  outline: 2px solid var(--c-shu);
  outline-offset: 3px;
}

.rite-seal {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  border-radius: 2px;
}

.rite-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.rite-copy strong {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--c-ink);
}

.rite-copy span {
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.65;
  color: var(--c-ink-soft);
  text-wrap: pretty;
}

.rite-icon {
  flex: 0 0 auto;
  margin-left: auto;
  color: var(--c-shu);
}

.ask-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(330px, 0.96fr);
  gap: 56px;
  align-items: start;
  padding: 42px 0 6px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-index {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 13px;
  border-radius: 1px;
}

.section-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--c-ink);
  white-space: nowrap;
}

.section-rule {
  flex: 1;
  height: 1px;
  background: var(--c-line);
}

.section-note {
  margin: 10px 0 20px;
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.7;
  color: var(--c-ink-faint);
  letter-spacing: 0.04em;
}

.ask-line {
  width: 100%;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 14px;
  padding: 14px 10px 14px 0;
  border: 0;
  border-bottom: 1px solid var(--c-line);
  border-left: 2px solid transparent;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.ask-line:hover {
  background: rgba(255, 253, 248, 0.6);
}

.ask-line.active {
  border-left-color: var(--c-shu);
  background: var(--c-shu-wash);
}

.ask-no {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--c-ink-faint);
  font-variant-numeric: tabular-nums;
}

.ask-line.active .ask-no {
  color: var(--c-shu);
}

.ask-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ask-label {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--c-ink);
}

.ask-note {
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-ink-faint);
}

.ask-arrow {
  color: var(--c-ink-faint);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.ask-line:hover .ask-arrow,
.ask-line.active .ask-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--c-shu);
}

.more-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 4px 0;
  border: 0;
  background: none;
  color: var(--c-ink-soft);
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.more-toggle:hover {
  color: var(--c-shu);
}

.more-count {
  display: inline-grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--c-line-strong);
  border-radius: 50%;
  font-size: 11px;
  color: var(--c-ink-faint);
}

.more-toggle svg {
  transition: transform 0.2s ease;
}

.more-toggle svg.rotated {
  transform: rotate(45deg);
}

.more-lines {
  margin-top: 8px;
  border-top: 1px dashed var(--c-line);
  padding-top: 6px;
}

.more-line {
  width: 100%;
  display: grid;
  grid-template-columns: 20px 64px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border: 0;
  background: none;
  text-align: left;
  color: var(--c-ink-faint);
  cursor: pointer;
}

.more-line:hover,
.more-line.active {
  color: var(--c-shu);
}

.more-label {
  font-family: var(--font-body);
  font-size: 14.5px;
  letter-spacing: 0.06em;
}

.more-note {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--c-ink-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- 签筒 ---------- */
.draw-stage {
  overflow: hidden;
  position: sticky;
  top: 92px;
  padding: 18px 20px 16px;
  background-color: rgba(253, 249, 241, 0.72);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(246, 237, 223, 0.4));
  border: 1px solid var(--c-line);
  scroll-margin-top: 88px;
}

.draw-stage::before {
  content: '縁';
  position: absolute;
  right: -26px;
  bottom: -46px;
  font-family: var(--font-display);
  font-size: 190px;
  line-height: 1;
  color: rgba(188, 59, 42, 0.045);
  pointer-events: none;
  z-index: 0;
}

.stage-head,
.stage-tool,
.stage-foot {
  position: relative;
  z-index: 1;
}

.draw-stage :deep(.onmyoji-button-container) {
  position: relative;
  z-index: 1;
}

.stage-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--c-line);
}

.stage-kicker {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--c-ink-faint);
}

.stage-name {
  font-family: var(--font-body);
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--c-ink);
}

.stage-index {
  margin-left: auto;
  font-family: var(--font-ui);
  font-size: 11px;
  color: var(--c-shu);
  font-variant-numeric: tabular-nums;
}

.stage-foot {
  margin-top: 2px;
  text-align: center;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--c-ink-faint);
}

.stage-tool-note {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--c-ink-faint);
}

.stage-tool {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: var(--font-display);
  font-size: 16.5px;
  color: var(--c-ink-soft);
}

/* ---------- 偏门工具 ---------- */
.tool-section {
  margin-top: 46px;
  padding-top: 26px;
  border-top: 1px solid var(--c-line);
  scroll-margin-top: 88px;
}

.back-link {
  margin-left: auto;
  border: 0;
  background: none;
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.back-link:hover {
  color: var(--c-shu);
}

.tool-mount {
  margin-top: 20px;
}

.result-section {
  scroll-margin-top: 88px;
}

:deep(.fortune-result) {
  max-width: 720px;
  margin: 46px auto 0;
}

.tool-directory {
  margin-top: 52px;
  padding-top: 26px;
  border-top: 1px solid var(--c-line);
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 24px;
  border-top: 1px solid var(--c-line);
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
  border: 0;
  border-bottom: 1px solid var(--c-line);
  background: none;
  text-align: left;
  cursor: pointer;
  color: var(--c-ink-soft);
  transition: color 0.2s ease;
}

.tool-item:hover,
.tool-item.active {
  color: var(--c-shu);
}

.tool-icon {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--c-line);
  color: var(--c-shu);
}

.tool-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.tool-label {
  font-family: var(--font-body);
  font-size: 14.5px;
  letter-spacing: 0.1em;
}

.tool-note {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--c-ink-faint);
  white-space: nowrap;
}

.tool-arrow {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tool-item:hover .tool-arrow {
  opacity: 1;
}

@media (max-width: 980px) {
  .ask-grid {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 36px;
  }

  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .rite-grid {
    grid-template-columns: 1fr;
  }

  .rite-card {
    padding: 18px 18px;
  }

  .home-hero {
    align-items: start;
  }

  .home-view {
    width: calc(100% - 32px);
    padding-top: 22px;
  }

  .home-hero {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 16px;
    padding-bottom: 24px;
  }

  .hero-portrait {
    width: 56px;
    height: 56px;
  }

  .hero-eyebrow {
    font-size: 11px;
    letter-spacing: 0.1em;
  }

  .hero-copy h1 {
    font-size: clamp(1.7rem, 7vw, 2.2rem);
  }

  .hero-note {
    font-size: 14.5px;
  }

  .hero-stamp {
    display: none;
  }

  .ask-grid {
    grid-template-columns: 1fr;
    gap: 30px;
    padding-top: 30px;
  }

  .draw-stage {
    position: static;
    padding: 16px 16px 14px;
  }

  .section-note {
    margin-bottom: 14px;
  }

  .tool-grid {
    grid-template-columns: 1fr;
  }

  .tool-directory {
    margin-top: 38px;
  }

  .more-note {
    white-space: normal;
  }
}
</style>
