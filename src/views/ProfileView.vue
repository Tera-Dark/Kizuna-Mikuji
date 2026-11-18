<template>
  <main class="profile-view">
    <header class="page-head">
      <p class="eyebrow">缘主 · 名册</p>
      <h1>缘主名册</h1>
      <p class="head-note">{{ voice.profile.intro }}</p>
    </header>

    <div class="profile-grid">
      <section class="form-sheet">
        <label class="field">
          <span class="field-label">姓名</span>
          <input
            v-model.trim="userName"
            class="field-input"
            type="text"
            maxlength="12"
            placeholder="写你平时用的名字就行"
            @keyup.enter="save"
          />
        </label>

        <div class="field">
          <span class="field-label">降世之日</span>
          <div class="date-row">
            <span class="select-wrap">
              <select v-model="birthYear" class="field-select">
                <option value="">年</option>
                <option v-for="year in yearOptions" :key="year" :value="String(year)">{{ year }}</option>
              </select>
            </span>
            <span class="select-wrap">
              <select v-model="birthMonth" class="field-select">
                <option value="">月</option>
                <option v-for="month in 12" :key="month" :value="String(month)">{{ month }}</option>
              </select>
            </span>
            <span class="select-wrap">
              <select v-model="birthDay" class="field-select">
                <option value="">日</option>
                <option v-for="day in dayOptions" :key="day" :value="String(day)">{{ day }}</option>
              </select>
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="save-button" @click="save">记下</button>
          <button v-if="hasSaved" type="button" class="clear-link" @click="clear">划掉</button>
          <p v-if="notice" class="notice">{{ notice }}</p>
        </div>
      </section>

      <aside class="profile-aside">
        <div class="aside-seal">缘</div>
        <dl class="aside-list">
          <div class="aside-row">
            <dt>星命</dt>
            <dd>{{ zodiacSign }}</dd>
          </div>
          <div class="aside-row">
            <dt>今日缘数</dt>
            <dd class="aside-number">{{ luckyNumber || '—' }}</dd>
          </div>
          <div class="aside-row">
            <dt>来过</dt>
            <dd>{{ visitCount }} 次</dd>
          </div>
          <div class="aside-row">
            <dt>摇过</dt>
            <dd>{{ drawCount }} 签</dd>
          </div>
        </dl>
        <p class="aside-note">名册只放在你自己的浏览器里。本神明不往外说。</p>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { voice } from '../constants/enmusubi';
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore();

const userName = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const luckyNumber = ref(0);
const notice = ref('');
const hasSaved = ref(false);

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);
const dayOptions = computed(() => {
  if (!birthYear.value || !birthMonth.value) return 31;
  return new Date(Number(birthYear.value), Number(birthMonth.value), 0).getDate();
});

const birthdate = computed(() => {
  if (!birthYear.value || !birthMonth.value || !birthDay.value) return '';
  return `${birthYear.value}-${String(birthMonth.value).padStart(2, '0')}-${String(birthDay.value).padStart(2, '0')}`;
});

const zodiacSign = computed(() => {
  if (!birthdate.value) return '未知';
  const [year, month, day] = birthdate.value.split('-').map(Number);
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座';
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
  return '双鱼座';
});

const visitCount = computed(() => userStore.visitCount || 1);
const drawCount = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('fortuneHistory') || '[]').length;
  } catch {
    return 0;
  }
});

watch(birthDay, () => {
  if (birthDay.value && Number(birthDay.value) > dayOptions.value) {
    birthDay.value = String(dayOptions.value);
  }
});

const hashNumber = (text) => {
  const sum = Array.from(text).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (sum % 99) + 1;
};

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('userProfile') || 'null');
    if (!saved) return;
    hasSaved.value = true;
    userName.value = saved.name || '';
    luckyNumber.value = saved.luckyNumber || 0;
    if (saved.birthdate) {
      const [year, month, day] = saved.birthdate.split('-');
      birthYear.value = year;
      birthMonth.value = String(Number(month));
      birthDay.value = String(Number(day));
    }
  } catch {
    hasSaved.value = false;
  }
};

const save = () => {
  if (!userName.value) {
    notice.value = '名字总得留一个。';
    window.setTimeout(() => (notice.value = ''), 2200);
    return;
  }
  if (!luckyNumber.value) {
    luckyNumber.value = hashNumber(`${userName.value}${birthdate.value}`);
  }
  const data = {
    name: userName.value,
    birthdate: birthdate.value,
    luckyNumber: luckyNumber.value,
  };
  localStorage.setItem('userProfile', JSON.stringify(data));
  userStore.setUsername(userName.value);
  hasSaved.value = true;
  notice.value = voice.profile.saved;
  window.setTimeout(() => (notice.value = ''), 2200);
};

const clear = () => {
  userName.value = '';
  birthYear.value = '';
  birthMonth.value = '';
  birthDay.value = '';
  luckyNumber.value = 0;
  hasSaved.value = false;
  localStorage.removeItem('userProfile');
  userStore.setUsername('');
  notice.value = voice.profile.cleared;
  window.setTimeout(() => (notice.value = ''), 2200);
};

onMounted(load);
</script>

<style scoped>
.profile-view {
  position: relative;
  z-index: 1;
  width: min(1000px, calc(100% - 48px));
  margin: 0 auto;
  padding: 44px 0 0;
}

.page-head {
  padding-bottom: 26px;
  border-bottom: 1px solid var(--c-line);
}

.eyebrow {
  margin: 0 0 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--c-ink-faint);
}

.page-head h1 {
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

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 64px;
  align-items: start;
  padding-top: 34px;
}

.field {
  display: block;
  margin-bottom: 28px;
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--c-ink-faint);
}

.field-input,
.field-select {
  width: 100%;
  padding: 9px 0;
  border: 0;
  border-bottom: 1px solid var(--c-line-strong);
  outline: none;
  background: transparent;
  color: var(--c-ink);
  font-family: var(--font-display);
  font-size: 19px;
  letter-spacing: 0.04em;
}

.field-input::placeholder {
  color: var(--c-ink-faint);
  font-size: 15.5px;
  letter-spacing: 0;
}

.field-input:focus,
.field-select:focus {
  border-bottom-color: var(--c-shu);
}

.date-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.select-wrap {
  position: relative;
  display: block;
}

.select-wrap::after {
  content: '';
  position: absolute;
  right: 2px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-right: 1px solid var(--c-ink-faint);
  border-bottom: 1px solid var(--c-ink-faint);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.field-select {
  appearance: none;
  padding-right: 18px;
  font-size: 16.5px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
}

.save-button {
  padding: 9px 28px;
  border: 1px solid var(--c-shu-deep);
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.16em;
  cursor: pointer;
  border-radius: 1px;
}

.save-button:hover {
  background: var(--c-shu-deep);
}

.clear-link {
  border: 0;
  background: none;
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.clear-link:hover {
  color: var(--c-shu);
}

.notice {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--c-shu);
}

.profile-aside {
  position: relative;
  padding: 24px 22px 20px;
  border: 1px solid var(--c-line);
  background: rgba(253, 249, 241, 0.6);
}

.aside-seal {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 14.5px;
}

.aside-list {
  margin: 0;
  padding: 0;
}

.aside-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px dotted var(--c-line);
}

.aside-row dt {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--c-ink-faint);
}

.aside-row dd {
  margin: 0;
  font-family: var(--font-body);
  font-size: 15.5px;
  color: var(--c-ink);
}

.aside-number {
  font-size: 22px !important;
  color: var(--c-shu) !important;
  font-variant-numeric: tabular-nums;
}

.aside-note {
  margin-top: 16px;
  font-family: var(--font-ui);
  font-size: 12px;
  line-height: 1.8;
  color: var(--c-ink-faint);
}

@media (max-width: 760px) {
  .profile-view {
    width: calc(100% - 32px);
    padding-top: 28px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .profile-aside {
    order: -1;
  }
}
</style>
