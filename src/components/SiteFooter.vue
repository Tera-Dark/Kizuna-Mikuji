<template>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <p class="footer-line">缘结神社 · 香火自理</p>
      <p class="footer-note">本站不收香火钱，也不保证姻缘。红线要自己握紧。</p>
      <p class="footer-credit">背景素材鸣谢 阴阳师项目组</p>
      <button type="button" class="footer-help" @click="replayTour">怎么用</button>
    </div>
  </footer>
</template>

<script setup>
const replayTour = () => {
  window.dispatchEvent(new Event('enmusubi:tutorial'));
};
</script>

<style scoped>
.site-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--c-line);
  margin-top: 72px;
}

.site-footer-inner {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 26px 0 40px;
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--c-ink-faint);
}

.footer-line {
  color: var(--c-ink-soft);
  letter-spacing: 0.16em;
}

.footer-note {
  margin-right: auto;
}

.footer-help {
  padding: 0;
  border: 0;
  background: none;
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  cursor: pointer;
  border-bottom: 1px solid var(--c-line);
}

.footer-help:hover {
  color: var(--c-shu);
}

@media (max-width: 860px) {
  .site-footer {
    margin-top: 44px;
    padding-bottom: 54px;
  }

  .site-footer-inner {
    width: calc(100% - 32px);
    flex-direction: column;
    gap: 6px;
    padding: 20px 0 24px;
  }
}
</style>
