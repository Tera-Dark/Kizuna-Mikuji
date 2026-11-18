<template>
  <header class="site-header">
    <div class="site-header-inner">
      <RouterLink to="/" class="site-brand" aria-label="缘结神社，回到求签">
        <span class="brand-seal">縁</span>
        <span class="brand-type">
          <strong>缘结神社</strong>
          <small>ENMUSUBI JINJA</small>
        </span>
      </RouterLink>

      <nav class="site-nav" aria-label="主导航">
        <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="nav-link">
          <AppIcon :name="item.icon" :size="15" :weight="1.4" class="nav-icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="site-meta">
        <span>{{ today }}</span>
        <span class="meta-sep" aria-hidden="true"></span>
        <span class="meta-note">香火：将断</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './icons/AppIcon.vue';

const items = [
  { to: '/', label: '求签', icon: 'bell' },
  { to: '/book', label: '缘分簿', icon: 'book' },
  { to: '/me', label: '名册', icon: 'user' },
  { to: '/about', label: '神明', icon: 'scroll' },
];

const today = computed(() => {
  const date = new Date();
  return `${date.getMonth() + 1}月${date.getDate()}日`;
});
</script>

<style scoped>
.site-header {
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--c-line);
  background: rgba(247, 241, 231, 0.86);
  backdrop-filter: blur(10px);
}

.site-header-inner {
  width: min(1120px, calc(100% - 48px));
  height: 68px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 36px;
}

.site-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--c-ink);
  text-decoration: none;
  flex: 0 0 auto;
}

.brand-seal {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 17px;
  line-height: 1;
  border-radius: 2px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.brand-type {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-type strong {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1.1;
}

.brand-type small {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--c-ink-faint);
  line-height: 1;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  color: var(--c-ink-soft);
  font-family: var(--font-ui);
  font-size: 13.5px;
  letter-spacing: 0.1em;
  text-decoration: none;
  border-radius: 2px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.nav-link:hover {
  color: var(--c-shu);
  background: var(--c-shu-wash);
}

.nav-link.router-link-active {
  color: var(--c-shu);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  background: var(--c-shu);
  border-radius: 50%;
}

.nav-icon {
  opacity: 0.7;
}

.site-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 22px;
  border-left: 1px solid var(--c-line);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--c-ink-faint);
  white-space: nowrap;
}

.meta-sep {
  width: 3px;
  height: 3px;
  background: var(--c-line-strong);
  border-radius: 50%;
}

.meta-note {
  color: var(--c-shu);
}

@media (max-width: 860px) {
  /* backdrop-filter 会为 fixed 子元素建立包含块，底部导航会粘在页头里 */
  .site-header {
    backdrop-filter: none;
  }

  .site-header-inner {
    width: calc(100% - 32px);
    height: 58px;
    gap: 16px;
  }

  .brand-type small,
  .site-meta {
    display: none;
  }

  .site-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    margin: 0;
    padding: 6px max(12px, env(safe-area-inset-left)) calc(6px + env(safe-area-inset-bottom));
    justify-content: space-around;
    background: rgba(250, 246, 238, 0.96);
    border-top: 1px solid var(--c-line);
    backdrop-filter: blur(14px);
  }

  .nav-link {
    flex-direction: column;
    gap: 3px;
    padding: 5px 10px;
    font-size: 12px;
    letter-spacing: 0.06em;
  }

  .nav-link.router-link-active::after {
    display: none;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
