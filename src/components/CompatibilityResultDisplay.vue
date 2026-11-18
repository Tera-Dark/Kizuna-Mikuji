<template>
  <div class="compatibility-result-display-wrapper" v-if="result && result.sign1">
    <h4 class="result-main-title"><span class="title-deco">—</span> 星线合盘 <span class="title-deco">—</span></h4>

    <div class="signs-compared">
      <div class="person">
        <span class="sign-seal">{{ elementChar(result.element1) }}</span>
        <span class="sign-name">{{ result.sign1 }}</span>
      </div>
      <span class="themed-vs">缘</span>
      <div class="person">
        <span class="sign-seal">{{ elementChar(result.element2) }}</span>
        <span class="sign-name">{{ result.sign2 }}</span>
      </div>
    </div>

    <div class="score-row">
      <span class="score-value" :style="{ color: result.scoreColor }">{{ result.score }}</span>
      <span class="score-unit">分</span>
      <span class="score-type">{{ result.type }}</span>
    </div>
    <div class="score-bar"><i :style="{ width: (result.score || 0) + '%' }"></i></div>

    <p class="compatibility-summary">{{ result.interpretation }}</p>

    <div class="poem" v-html="result.poem"></div>

    <div class="advice">
      <span class="advice-label">本神明说</span>
      <p>{{ result.suggestion }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  result: {
    type: Object,
    default: () => null
  }
});

// 五行字，替代原来的彩色星座符号
function elementChar(element) {
  const map = { fire: '火', earth: '土', air: '风', water: '水', 火: '火', 土: '土', 风: '风', 水: '水' };
  return map[element] || '星';
}
</script>

<style scoped>
.compatibility-result-display-wrapper {
  width: 100%;
  margin-top: 22px;
  padding: 26px 28px 24px;
  background-color: var(--c-paper-2);
  background-image: radial-gradient(100% 90% at 50% 0%, rgba(255, 255, 255, 0.6), transparent 70%);
  border: 1px solid var(--c-line);
  border-top: 3px solid var(--c-shu);
  border-radius: 4px;
  box-shadow: var(--shadow-paper-sm);
  font-family: var(--font-body);
}

.result-main-title {
  text-align: center;
  color: var(--c-ink);
  font-size: 1.4em;
  margin: 0 0 22px;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.16em;
}

.title-deco {
  color: var(--c-shu-soft);
  margin: 0 10px;
  opacity: 0.7;
}

.signs-compared {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 18px;
}

.person {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sign-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--c-shu-soft);
  border-radius: 50%;
  color: var(--c-shu);
  font-family: var(--font-display);
  font-size: 0.78em;
}

.sign-name {
  font-family: var(--font-display);
  font-size: 1.02em;
  color: var(--c-ink);
  letter-spacing: 0.06em;
}

.themed-vs {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--c-shu);
  font-family: var(--font-display);
  font-size: 0.92em;
  letter-spacing: 0.1em;
}

.score-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.score-value {
  font-family: var(--font-display);
  font-size: 2.3em;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.score-unit {
  font-size: 0.8em;
  color: var(--c-ink-faint);
}

.score-type {
  margin-left: 12px;
  padding: 3px 12px;
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  color: var(--c-shu);
  font-size: 0.82em;
  letter-spacing: 0.1em;
}

.score-bar {
  height: 8px;
  margin: 14px auto 20px;
  max-width: 420px;
  background-color: rgba(188, 59, 42, 0.08);
  border: 1px solid var(--c-line);
  border-radius: 1px;
  overflow: hidden;
}

.score-bar i {
  display: block;
  height: 100%;
  background: var(--c-shu);
  transition: width 0.9s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.compatibility-summary {
  margin: 0 0 18px;
  color: var(--c-ink-soft);
  font-size: 0.94em;
  line-height: 1.9;
  text-align: justify;
}

.poem {
  padding: 16px 18px;
  margin-bottom: 18px;
  border-left: 2px solid var(--c-shu-soft);
  background-color: rgba(255, 254, 250, 0.6);
  color: var(--c-ink);
  font-family: var(--font-display);
  font-size: 1.02em;
  line-height: 2;
  text-align: center;
  letter-spacing: 0.08em;
}

.advice {
  display: flex;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px dashed var(--c-line-strong);
}

.advice-label {
  flex: 0 0 auto;
  color: var(--c-shu);
  font-size: 0.8em;
  letter-spacing: 0.12em;
  padding-top: 3px;
}

.advice p {
  margin: 0;
  color: var(--c-ink-soft);
  font-size: 0.9em;
  line-height: 1.85;
  text-align: justify;
}

@media (max-width: 560px) {
  .compatibility-result-display-wrapper { padding: 20px 16px; }
  .signs-compared { gap: 8px; }
  .sign-name { font-size: 0.92em; }
  .score-value { font-size: 1.9em; }
}
</style>
