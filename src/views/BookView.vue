<template>
  <main class="book-view">
    <header class="page-head">
      <div class="head-copy">
        <p class="eyebrow">记录 · 共 {{ entries.length }} 条</p>
        <h1>缘分簿</h1>
        <p class="head-note">摇过的签都在这。想翻旧账，自己翻。</p>
      </div>

      <div class="head-actions">
        <RouterLink to="/" class="plain-link">回神社</RouterLink>
        <button
          v-if="entries.length"
          type="button"
          class="clear-button"
          :class="{ confirming: confirmingClear }"
          @click="handleClear"
        >
          {{ confirmingClear ? '真清？' : '清空' }}
        </button>
      </div>
    </header>

    <section v-if="entries.length === 0" class="empty-book">
      <span class="empty-seal">空</span>
      <p class="empty-title">{{ voice.home.emptyBook }}</p>
      <p class="empty-note">去摇一签，簿子就有东西写了。</p>
      <RouterLink to="/" class="seal-link">去摇一签</RouterLink>
    </section>

    <section v-else class="book-list">
      <article
        v-for="(entry, index) in entries"
        :key="`${entry.date}-${index}`"
        class="book-item"
        :class="{ open: expanded === index }"
      >
        <button type="button" class="item-head" @click="toggle(index)">
          <span class="item-date">{{ formatDate(entry.date) }}</span>
          <span class="item-type">{{ entry.type || '未录' }}</span>
          <span class="item-poem">{{ plain(entry.poem) }}</span>
          <AppIcon name="arrowRight" :size="13" class="item-arrow" />
        </button>

        <div v-if="expanded === index" class="item-body">
          <p v-if="entry.poem" class="item-full-poem" v-html="entry.poem"></p>
          <p v-if="entry.interpretation" class="item-text">{{ entry.interpretation }}</p>
          <p v-if="entry.suggestion" class="item-suggestion">
            <span>顺手做一件事</span>{{ entry.suggestion }}
          </p>
          <div class="item-actions">
            <RouterLink v-if="entry.raw && entry.raw.sign1" to="/" class="plain-link">回神社看合盘</RouterLink>
            <button type="button" class="delete-link" @click.stop="remove(index)">划掉这一条</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppIcon from '../components/icons/AppIcon.vue';
import { voice } from '../constants/enmusubi';

const entries = ref([]);
const expanded = ref(-1);
const confirmingClear = ref(false);

const normalize = (item) => {
  if (!item) return null;
  if (item.fortune) {
    return {
      date: item.date,
      type: item.fortune.type,
      poem: item.fortune.poem,
      interpretation: item.fortune.interpretation,
      suggestion: item.fortune.suggestion,
      raw: item.fortune,
    };
  }
  return {
    date: item.date,
    type: item.type,
    poem: item.result,
    interpretation: item.interpretation || '',
    suggestion: item.suggestion || '',
    raw: item,
  };
};

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    entries.value = saved
      .map(normalize)
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    entries.value = [];
  }
};

const plain = (html) => {
  if (!html) return '';
  return String(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || '');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}.${day} ${hour}:${minute}`;
};

const toggle = (index) => {
  expanded.value = expanded.value === index ? -1 : index;
};

const remove = (index) => {
  entries.value.splice(index, 1);
  expanded.value = -1;
  persist();
};

const persist = () => {
  const raw = entries.value.map((entry) => ({ date: entry.date, fortune: entry.raw }));
  localStorage.setItem('fortuneHistory', JSON.stringify(raw));
};

const handleClear = () => {
  if (!confirmingClear.value) {
    confirmingClear.value = true;
    window.setTimeout(() => {
      confirmingClear.value = false;
    }, 2600);
    return;
  }
  entries.value = [];
  expanded.value = -1;
  confirmingClear.value = false;
  localStorage.setItem('fortuneHistory', '[]');
};

onMounted(load);
</script>

<style scoped>
.book-view {
  position: relative;
  z-index: 1;
  width: min(1000px, calc(100% - 48px));
  margin: 0 auto;
  padding: 44px 0 0;
}

.page-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: start;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--c-line);
}

.eyebrow {
  margin: 2px 0 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--c-ink-faint);
}

.head-copy h1 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1.1;
}

.head-note {
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--c-ink-soft);
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 6px;
}

.plain-link {
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-decoration: none;
  border-bottom: 1px solid var(--c-line);
  line-height: 1.7;
}

.plain-link:hover {
  color: var(--c-shu);
}

.clear-button {
  padding: 5px 10px;
  border: 1px solid var(--c-line-strong);
  background: none;
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.clear-button:hover,
.clear-button.confirming {
  color: var(--c-shu);
  border-color: var(--c-shu);
  background: var(--c-shu-wash);
}

/* 空簿 */
.empty-book {
  margin-top: 34px;
  padding: 56px 24px 60px;
  text-align: center;
  border: 1px solid var(--c-line);
  background: rgba(253, 249, 241, 0.5);
}

.empty-seal {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-bottom: 16px;
  border: 1px solid var(--c-line-strong);
  color: var(--c-shu);
  font-family: var(--font-display);
  font-size: 18px;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 17px;
  letter-spacing: 0.08em;
  color: var(--c-ink);
}

.empty-note {
  margin: 8px 0 20px;
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--c-ink-faint);
}

.seal-link {
  display: inline-flex;
  padding: 8px 20px;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.12em;
  text-decoration: none;
  border-radius: 1px;
}

.seal-link:hover {
  background: var(--c-shu-deep);
}

/* 列表 */
.book-list {
  margin-top: 8px;
}

.book-item {
  border-bottom: 1px solid var(--c-line);
}

.item-head {
  width: 100%;
  display: grid;
  grid-template-columns: 64px 64px minmax(0, 1fr) 16px;
  gap: 16px;
  align-items: baseline;
  padding: 15px 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

.item-date {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--c-ink-faint);
  font-variant-numeric: tabular-nums;
}

.item-type {
  font-family: var(--font-body);
  font-size: 13.5px;
  letter-spacing: 0.08em;
  color: var(--c-shu);
}

.item-poem {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13.5px;
  color: var(--c-ink-soft);
}

.item-arrow {
  color: var(--c-ink-faint);
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

.book-item.open .item-arrow {
  transform: rotate(-90deg);
  color: var(--c-shu);
}

.item-body {
  max-width: 780px;
  padding: 4px 0 18px 80px;
  animation: unfold 0.25s ease;
}

.item-full-poem {
  margin: 0 0 10px;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.9;
  color: var(--c-ink);
}

.item-text {
  margin: 0 0 10px;
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--c-ink-soft);
}

.item-suggestion {
  margin: 0;
  padding: 10px 14px;
  border-left: 2px solid var(--c-gold-soft);
  background: rgba(180, 136, 61, 0.06);
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--c-ink-soft);
}

.item-suggestion span {
  display: block;
  margin-bottom: 3px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--c-shu);
}

.item-actions {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.delete-link {
  border: 0;
  background: none;
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.06em;
  cursor: pointer;
}

.delete-link:hover {
  color: var(--c-shu);
}

@keyframes unfold {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 700px) {
  .book-view {
    width: calc(100% - 32px);
    padding-top: 28px;
  }

  .page-head {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .head-actions {
    padding-top: 0;
  }

  .item-head {
    grid-template-columns: 58px 64px minmax(0, 1fr) 14px;
    gap: 8px;
  }

  .item-type {
    font-size: 13px;
    white-space: nowrap;
  }

  .item-poem {
    display: block;
    font-size: 12px;
  }

  .item-body {
    padding-left: 0;
  }
}
</style>
