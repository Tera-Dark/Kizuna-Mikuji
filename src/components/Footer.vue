<template>
  <footer class="fortune-footer">
    <div class="footer-decoration"></div>
    <div class="footer-content">
      <p class="main-text">本占卜仅供娱乐，愿天下有情人终成眷属！</p>
      <p class="sub-text"><small>背景图片来源：阴阳师官方美术</small></p>
      <div class="social-links">
        <a href="#" class="social-link" title="分享到微信" @click.prevent="shareToSocial('wechat')">
          <span class="social-icon">💬</span>
        </a>
        <a href="#" class="social-link" title="分享到微博" @click.prevent="shareToSocial('weibo')">
          <span class="social-icon">🔖</span>
        </a>
      </div>
    </div>
    <div class="stamp-decoration"></div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const shareToSocial = (platform: string) => {
  const shareText = "我在'缘结良缘'求了一支签，快来一起体验缘分的奇妙吧！";
  const shareUrl = window.location.href;

  if (platform === 'wechat') {
    alert('请截图或复制链接，分享给微信好友：\n' + shareUrl);
  } else if (platform === 'weibo') {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(weiboUrl, '_blank');
  }
};
</script>

<style scoped>
.fortune-footer {
  margin-top: 40px;
  width: 100%;
  text-align: center;
  padding: 20px 0 5px;
  position: relative;
}

.footer-decoration {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(139, 69, 19, 0.4), transparent);
}

.footer-content {
  position: relative;
  padding: 10px 0;
  font-family: 'STFangsong', 'FangSong', serif;
}

.main-text {
  font-size: 1.05em;
  color: #8B4513;
  margin-bottom: 8px;
  font-family: 'STFangsong', 'FangSong', serif;
  position: relative;
  display: inline-block;
}

.main-text::before,
.main-text::after {
  content: "❧";
  font-size: 0.8em;
  color: rgba(139, 69, 19, 0.6);
  margin: 0 10px;
  vertical-align: middle;
}

.sub-text {
  font-size: 0.85em;
  color: #A57164;
  margin-bottom: 12px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: rgba(255, 248, 231, 0.8);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 1px solid rgba(212, 163, 85, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.9), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.social-link:hover::before {
  opacity: 0.8;
}

.social-link:active {
  transform: translateY(1px) scale(0.95);
}

.social-icon {
  font-size: 20px;
  position: relative;
  z-index: 2;
}

.stamp-decoration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  opacity: 0.15;
  background: radial-gradient(circle, #C0392B, #E74C3C);
  border-radius: 3px;
  transform: rotate(15deg);
}

.stamp-decoration::before {
  content: "缘";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 16px;
  color: #FFF8E7;
}

@media (max-width: 768px) {
  .fortune-footer {
    margin-top: 30px;
    padding: 15px 0 5px;
  }
  
  .main-text {
    font-size: 0.95em;
  }
  
  .main-text::before,
  .main-text::after {
    margin: 0 6px;
    font-size: 0.7em;
  }
  
  .sub-text {
    font-size: 0.8em;
  }
  
  .social-links {
    gap: 15px;
  }
  
  .social-link {
    width: 34px;
    height: 34px;
  }
  
  .stamp-decoration {
    width: 24px;
    height: 24px;
  }
  
  .stamp-decoration::before {
    font-size: 14px;
  }
}

/* 深色主题样式 */
:global(.dark-theme) .main-text {
  color: #D4A355;
}

:global(.dark-theme) .main-text::before,
:global(.dark-theme) .main-text::after {
  color: rgba(212, 163, 85, 0.6);
}

:global(.dark-theme) .sub-text {
  color: #A78B82;
}

:global(.dark-theme) .social-link {
  background-color: rgba(40, 44, 52, 0.8);
  border-color: rgba(212, 163, 85, 0.3);
}

:global(.dark-theme) .footer-decoration {
  background: linear-gradient(to right, transparent, rgba(212, 163, 85, 0.4), transparent);
}

:global(.dark-theme) .stamp-decoration {
  background: radial-gradient(circle, #7F3229, #C0392B);
}
</style> 