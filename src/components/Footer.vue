<template>
  <footer class="shrine-footer">
    <div class="foot-rule" aria-hidden="true">
      <span class="rule-line"></span>
      <span class="rule-knot"></span>
      <span class="rule-line"></span>
    </div>

    <p class="main-text">{{ voice.footer.main }}</p>
    <p class="sub-text">{{ voice.footer.sub }}</p>
    <p class="credit-text">{{ voice.footer.credit }}</p>

    <div class="foot-actions">
      <button class="foot-btn" type="button" title="复制分享文案" @click="copyShareLink">
        <AppIcon name="mail" :size="15" />
        <span>抄一份</span>
      </button>
      <button class="foot-btn" type="button" title="分享出去" @click="shareToSocial('weibo')">
        <AppIcon name="link" :size="15" />
        <span>递出去</span>
      </button>
    </div>

    <span class="foot-seal" aria-hidden="true">縁</span>

    <Transition name="toast">
      <div class="copy-success-toast" v-if="showCopyToast" ref="toastRef">
        {{ voice.footer.copySuccess }}
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { site, voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

const shareToSocial = (platform: string) => {
  const shareText = voice.footer.weiboText;
  const shareUrl = window.location.href;

  if (platform === 'weibo') {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(weiboUrl, '_blank');
  }
};

const showCopyToast = ref(false);
const toastRef = ref(null);

const copyShareLink = async () => {
  const shareUrl = 'https://tera-dark.github.io/Kizuna-Mikuji/';
  const shareText = `【${site.name}】${voice.footer.shareText}`;
  const fullShareContent = `${shareText}\n\n${shareUrl}`;

  try {
    await navigator.clipboard.writeText(fullShareContent);
    flashToast();
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = fullShareContent;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      flashToast();
    } catch (err) {
      alert(`${voice.share.failed}\n\n${fullShareContent}`);
    }

    document.body.removeChild(textArea);
  }
};

const flashToast = () => {
  showCopyToast.value = true;
  setTimeout(() => {
    showCopyToast.value = false;
  }, 2200);
};
</script>

<style scoped>
.shrine-footer {
  position: relative;
  width: 100%;
  padding: 20px 8px 16px;
  text-align: center;
}

.foot-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
}

.rule-line {
  width: 44px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-line-strong));
}

.rule-line:last-child {
  background: linear-gradient(90deg, var(--c-line-strong), transparent);
}

.rule-knot {
  width: 7px;
  height: 7px;
  border: 1px solid var(--c-shu);
  transform: rotate(45deg);
}

.main-text {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: 0.95em;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--c-ink);
}

.sub-text {
  margin: 0 0 3px;
  font-family: var(--font-ui);
  font-size: 0.7em;
  letter-spacing: 0.12em;
  color: var(--c-ink-faint);
}

.credit-text {
  margin: 0 0 13px;
  font-family: var(--font-ui);
  font-size: 0.64em;
  letter-spacing: 0.06em;
  color: var(--c-ink-faint);
  opacity: 0.7;
}

.foot-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.foot-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  font-family: var(--font-ui);
  font-size: 0.7em;
  letter-spacing: 0.08em;
  color: var(--c-shu);
  background: transparent;
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.foot-btn:hover {
  background: var(--c-shu);
  border-color: var(--c-shu-deep);
  color: #FFF6F0;
}

.foot-seal {
  position: absolute;
  right: 8px;
  bottom: 10px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--c-shu);
  border: 1.5px solid rgba(188, 59, 42, 0.5);
  border-radius: 2px;
  transform: rotate(-7deg);
  opacity: 0.65;
  user-select: none;
}

.copy-success-toast {
  position: fixed;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: var(--c-paper);
  color: var(--c-shu);
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  font-family: var(--font-ui);
  font-size: 0.8em;
  letter-spacing: 0.06em;
  z-index: 2100;
  box-shadow: var(--shadow-paper-sm);
}

.toast-enter-active,
.toast-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translate(-50%, 8px); }

@media (max-width: 480px) {
  .main-text { font-size: 0.88em; }
  .credit-text { display: none; }
  .foot-seal { width: 28px; height: 28px; font-size: 15px; right: 2px; }
  .rule-line { width: 30px; }
}
</style>
