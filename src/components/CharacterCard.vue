<template>
  <Teleport to="body">
    <Transition name="archive">
      <div v-if="isOpen" class="archive-overlay" @click.self="close">
        <div class="archive-panel" role="dialog" aria-modal="true" aria-label="缘结神档案">
          <!-- 顶部红线 -->
          <div class="thread-line"></div>

          <button class="archive-close" type="button" @click="close" aria-label="关闭档案">
            <AppIcon name="close" :size="15" />
          </button>

          <header class="archive-head">
            <div class="portrait">
              <img src="/images/缘结神头像.png" alt="缘结神" />
              <span class="portrait-ring"></span>
            </div>
            <div class="head-text">
              <p class="head-kicker">{{ deity.title }}</p>
              <h2 class="head-name">{{ deity.name }}</h2>
              <p class="head-sub">{{ deity.jpName }} ／ {{ deity.reading }}</p>
              <p class="head-meta">CV {{ deity.cv }} · 出身 {{ deity.origin }} · 居所 {{ deity.residence }}</p>
            </div>
          </header>

          <div class="archive-body">
            <!-- 三句话 -->
            <section class="section intro-section">
              <p v-for="(line, i) in introLines" :key="i" class="intro-line">
                <span class="intro-index">{{ ['一', '二', '三'][i] }}</span>{{ line }}
              </p>
            </section>

            <!-- 档案 -->
            <section class="section">
              <h3 class="section-title">档案</h3>
              <dl class="basics">
                <div v-for="item in profile.basics" :key="item.label" class="basic-row">
                  <dt>{{ item.label }}</dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
              <div class="traits">
                <div class="trait-block">
                  <span class="trait-label">喜欢</span>
                  <span v-for="t in profile.likes" :key="t" class="chip chip-like">{{ t }}</span>
                </div>
                <div class="trait-block">
                  <span class="trait-label">讨厌</span>
                  <span v-for="t in profile.dislikes" :key="t" class="chip chip-dislike">{{ t }}</span>
                </div>
                <div class="trait-block">
                  <span class="trait-label">拿手</span>
                  <span v-for="t in profile.strengths" :key="t" class="chip">{{ t }}</span>
                </div>
                <div class="trait-block">
                  <span class="trait-label">不拿手</span>
                  <span v-for="t in profile.weaknesses" :key="t" class="chip chip-plain">{{ t }}</span>
                </div>
              </div>
            </section>

            <!-- 故事 -->
            <section class="section">
              <h3 class="section-title">她的三段线</h3>
              <article v-for="story in stories" :key="story.title" class="story">
                <h4 class="story-title">{{ story.title }}</h4>
                <p class="story-body">{{ story.body }}</p>
              </article>
            </section>

            <!-- 关系 -->
            <section class="section">
              <h3 class="section-title">缠在身上的线</h3>
              <ul class="relations">
                <li v-for="rel in relations" :key="rel.name" class="relation">
                  <span class="relation-name">{{ rel.name }}</span>
                  <span class="relation-desc">{{ rel.desc }}</span>
                </li>
              </ul>
            </section>

            <!-- 台词 -->
            <section class="section">
              <h3 class="section-title">她说过的话</h3>
              <ul class="quote-list">
                <li v-for="(q, i) in quotes" :key="i" class="quote-item">「{{ q }}」</li>
              </ul>
            </section>

            <p class="archive-foot">
              角色与世界观版权归网易《阴阳师》所有。本页为非商业同人整理，仅供娱乐。
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import AppIcon from './icons/AppIcon.vue';
import { deity, introLines, profile, stories, relations, quotes } from '../constants/enmusubi';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const close = () => emit('close');

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) close();
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<style scoped>
.archive-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(38, 24, 20, 0.62);
  backdrop-filter: blur(4px);
}

.archive-panel {
  position: relative;
  width: 100%;
  max-width: 660px;
  max-height: min(86vh, 900px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 30px 30px 26px;
  border-radius: 4px;
  border: 1px solid var(--c-line-strong);
  background-color: var(--c-paper);
  background-image:
    radial-gradient(100% 80% at 50% 0%, rgba(255, 255, 255, 0.8), transparent 70%),
    linear-gradient(180deg, #FCF7EE, #F8EFE2);
  box-shadow: 0 30px 70px rgba(48, 26, 20, 0.4);
  scrollbar-width: thin;
  scrollbar-color: rgba(188, 59, 42, 0.4) transparent;
}

.archive-panel::-webkit-scrollbar { width: 6px; }
.archive-panel::-webkit-scrollbar-thumb {
  background: rgba(188, 59, 42, 0.4);
  border-radius: 1px;
}

.thread-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(188, 59, 42, 0.15), #BC3B2A 22%, #8F271C 50%, #BC3B2A 78%, rgba(188, 59, 42, 0.15));
}

.archive-close {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  background: transparent;
  color: var(--c-ink-soft);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  z-index: 2;
}

.archive-close:hover {
  background: var(--c-shu);
  border-color: var(--c-shu);
  color: #FFF8F0;
}

.archive-head {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 22px;
  border-bottom: 1px dashed var(--c-line-strong);
}

.portrait {
  position: relative;
  flex: 0 0 auto;
  width: 92px;
  height: 92px;
}

.portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--c-shu);
  position: relative;
  z-index: 1;
}

.portrait-ring {
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 1px dashed var(--c-line-strong);
  animation: ring-spin 24s linear infinite;
}

@keyframes ring-spin {
  to { transform: rotate(360deg); }
}

.head-kicker {
  margin: 0 0 2px;
  font-size: 0.74em;
  letter-spacing: 0.22em;
  color: var(--c-shu);
  opacity: 0.85;
}

.head-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.1em;
  line-height: 1.1;
  color: var(--c-ink);
  letter-spacing: 0.14em;
}

.head-sub {
  margin: 4px 0 0;
  font-size: 0.82em;
  color: var(--c-ink-soft);
  letter-spacing: 1px;
}

.head-meta {
  margin: 8px 0 0;
  font-size: 0.75em;
  color: var(--c-ink-faint);
}

.archive-body { padding-top: 6px; }

.section { padding: 20px 0 4px; }

.section-title {
  position: relative;
  margin: 0 0 14px;
  padding-left: 14px;
  font-family: var(--font-display);
  font-size: 1.02em;
  letter-spacing: 0.18em;
  color: var(--c-ink);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 16px;
  border-radius: 1px;
  background: var(--c-shu);
}

.intro-section {
  padding: 16px 18px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid var(--c-line);
}

.intro-line {
  margin: 0 0 9px;
  font-size: 0.92em;
  line-height: 1.75;
  color: var(--c-ink-soft);
}

.intro-line:last-child { margin-bottom: 0; }

.intro-index {
  display: inline-block;
  width: 20px;
  margin-right: 6px;
  color: var(--c-shu);
  font-family: var(--font-display);
  font-weight: 600;
}

.basics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
  gap: 2px 22px;
  margin: 0 0 16px;
}

.basic-row {
  display: flex;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dotted var(--c-line);
}

.basic-row dt {
  flex: 0 0 62px;
  font-size: 0.82em;
  color: var(--c-ink-faint);
}

.basic-row dd {
  margin: 0;
  font-size: 0.86em;
  color: var(--c-ink-soft);
  line-height: 1.5;
}

.trait-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.trait-label {
  flex: 0 0 52px;
  font-size: 0.78em;
  color: var(--c-ink-faint);
  letter-spacing: 1px;
}

.chip {
  padding: 3px 10px;
  border-radius: 2px;
  font-size: 0.76em;
  color: var(--c-ink-soft);
  background: rgba(255, 253, 248, 0.6);
  border: 1px solid var(--c-line);
}

.chip-like { color: var(--c-shu); background: var(--c-shu-wash); border-color: rgba(188, 59, 42, 0.2); }
.chip-dislike { color: #6F6772; background: rgba(240, 236, 240, 0.6); border-color: rgba(140, 130, 145, 0.22); }
.chip-plain { color: var(--c-ink-faint); background: rgba(248, 242, 236, 0.6); }

.story {
  position: relative;
  padding: 14px 16px 14px 18px;
  margin-bottom: 12px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--c-line);
  border-left: 2px solid var(--c-shu-soft);
}

.story-title {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: 0.92em;
  letter-spacing: 0.14em;
  color: var(--c-shu);
}

.story-body {
  margin: 0;
  font-size: 0.86em;
  line-height: 1.85;
  color: var(--c-ink-soft);
  text-align: justify;
}

.relations {
  margin: 0;
  padding: 0;
  list-style: none;
}

.relation {
  display: flex;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px dotted var(--c-line);
  font-size: 0.86em;
}

.relation:last-child { border-bottom: none; }

.relation-name {
  flex: 0 0 110px;
  color: var(--c-ink);
  font-weight: 600;
}

.relation-desc {
  color: var(--c-ink-soft);
  line-height: 1.6;
}

.quote-list {
  margin: 0;
  padding: 0;
  list-style: none;
  columns: 1;
}

.quote-item {
  padding: 7px 0 7px 16px;
  font-family: var(--font-display);
  font-size: 0.86em;
  line-height: 1.7;
  color: var(--c-ink-soft);
  position: relative;
}

.quote-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 16px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid var(--c-shu-soft);
}

.archive-foot {
  margin: 20px 0 0;
  padding-top: 14px;
  border-top: 1px dashed var(--c-line-strong);
  font-size: 0.72em;
  line-height: 1.7;
  color: var(--c-ink-faint);
  text-align: center;
}

.archive-enter-active,
.archive-leave-active {
  transition: opacity 0.3s ease;
}

.archive-enter-active .archive-panel,
.archive-leave-active .archive-panel {
  transition: transform 0.35s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease;
}

.archive-enter-from,
.archive-leave-to { opacity: 0; }

.archive-enter-from .archive-panel,
.archive-leave-to .archive-panel {
  transform: translateY(24px) scale(0.97);
  opacity: 0;
}

@media (max-width: 560px) {
  .archive-overlay { padding: 10px; align-items: flex-end; }
  .archive-panel {
    max-height: 90vh;
    padding: 28px 18px 24px;
    border-radius: 18px;
  }
  .archive-head { gap: 14px; }
  .portrait { width: 68px; height: 68px; }
  .head-name { font-size: 1.9em; }
  .head-meta { font-size: 0.7em; }
  .basics { grid-template-columns: 1fr; }
  .relation { flex-direction: column; gap: 3px; }
  .relation-name { flex: none; }
}
</style>
