<template>
  <footer class="fortune-footer">
    <div class="footer-decoration top-knot"></div>
    <div class="footer-content">
      <p class="main-text">本占卜仅供娱乐，愿天下有情人终成眷属！</p>
      <p class="sub-text"><small>背景图片素材鸣谢 阴阳师项目组</small></p>
      <div class="social-links">
        <a href="#" class="social-link" title="复制分享链接" @click.prevent="copyShareLink">
          <span class="social-icon">💌</span>
        </a>
        <a href="#" class="social-link" title="分享到社交平台" @click.prevent="shareToSocial('weibo')">
          <span class="social-icon">🔗</span>
        </a>
      </div>
    </div>
    <div class="stamp-decoration">
      <span class="stamp-text">缘</span>
    </div>
    <div class="footer-decoration bottom-knot"></div>
    <div class="copy-success-toast" v-if="showCopyToast" ref="toastRef">
      文案和链接已复制，快去分享吧！
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const shareToSocial = (platform: string) => {
  const shareText = "我在'缘结良缘'求了一支签，快来一起体验缘分的奇妙吧！";
  const shareUrl = window.location.href;

  if (platform === 'weibo') {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(weiboUrl, '_blank');
  }
};

const showCopyToast = ref(false);
const toastRef = ref(null);

const copyShareLink = async () => {
  const shareUrl = "https://tera-dark.github.io/Kizuna-Mikuji/";
  const shareText = "【缘结良缘】听说命运红线由缘结神掌管？这款唯美日系应用能预测你的前世姻缘，看你和TA是否有神赐缘分，红线一牵，姻缘天成，快来测试吧！";
  
  // 组合文案和链接
  const fullShareContent = `${shareText}\n\n${shareUrl}`;
  
  try {
    // 复制完整内容（文案+链接）到剪贴板
    await navigator.clipboard.writeText(fullShareContent);
    
    // 显示复制成功提示
    showCopyToast.value = true;
    setTimeout(() => {
      showCopyToast.value = false;
    }, 2000);
    
  } catch (err) {
    // 如果复制失败，使用备用方法
    const textArea = document.createElement("textarea");
    textArea.value = fullShareContent;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      
      // 显示复制成功提示
      showCopyToast.value = true;
      setTimeout(() => {
        showCopyToast.value = false;
      }, 2000);
      
    } catch (err) {
      alert(`無法複製內容，請手動複製:\n\n${fullShareContent}`);
    }
    
    document.body.removeChild(textArea);
  }
};
</script>

<style scoped>
/* 日系风格的页脚样式 */
.fortune-footer {
  margin-top: 30px;
  width: 100%;
  text-align: center;
  padding: 25px 0 20px;
  position: relative;
  background-color: rgba(255, 235, 235, 0.75);
  color: #B8433E;
  border-top: 2px solid rgba(229, 109, 97, 0.5);
  border-bottom: 2px solid rgba(229, 109, 97, 0.5);
  box-shadow: 0 -4px 15px rgba(217, 84, 77, 0.1), 0 4px 15px rgba(217, 84, 77, 0.1);
  overflow: visible;
  border-radius: 20px;
}

/* 移除原有的斜向条纹和白色粗条纹，简化背景，依赖App.vue的背景 */
.fortune-footer::before, 
.fortune-footer::after {
  display: none;
}
.footer-bottom-stripe {
  display: none;
}

/* 顶部和底部的装饰性绳结/线条 */
.footer-decoration {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 60%; 
  height: 1.5px;
  background: linear-gradient(to right, transparent, rgba(217, 84, 77, 0.6), transparent);
  z-index: 1;
}
.footer-decoration.top-knot {
  top: 10px;
}
.footer-decoration.bottom-knot {
  bottom: 10px;
}
/* 可以在绳结/线条两端添加小装饰 */
.footer-decoration::before, .footer-decoration::after {
  content: '\2766';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(217, 84, 77, 0.7);
  font-size: 10px;
}
.footer-decoration::before {
  left: -15px;
}
.footer-decoration::after {
  right: -15px;
}

.footer-content {
  position: relative;
  padding: 10px 0; 
  font-family: var(--font-family-sans-serif);
  z-index: 2;
}

.main-text {
  font-size: 1.1em; 
  color: #B8433E;
  margin-bottom: 8px; 
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive, var(--font-family-serif));
  position: relative;
  display: inline-block;
  text-shadow: 0 1px 2px rgba(255,255,255,0.5); 
}

.main-text::before,
.main-text::after {
  content: "\7D50";
  font-size: 0.8em;
  color: #D9544D;
  margin: 0 10px;
  vertical-align: middle;
  font-family: var(--font-family-serif);
  opacity: 0.8;
}

.sub-text {
  font-size: 0.85em;
  color: #C74840;
  margin-bottom: 15px; 
  opacity: 0.85;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 25px; 
  margin-top: 18px; 
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px; 
  height: 42px;
  border-radius: 50%;
  background-color: rgba(255, 245, 245, 0.9);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 1.5px solid #E56D61;
  box-shadow: 0 3px 8px rgba(217, 84, 77, 0.2); 
  position: relative;
}

.social-link:hover {
  transform: translateY(-3px) scale(1.1);
  background-color: #FFF0F0;
  border-color: #D9544D;
  box-shadow: 0 5px 12px rgba(217, 84, 77, 0.3);
}

.social-link:active {
  transform: translateY(0px) scale(1.05);
}

.social-icon {
  font-size: 20px; 
  position: relative;
  z-index: 2;
  color: #C74840;
}

/* 印章样式 */
.stamp-decoration {
  position: absolute;
  bottom: 15px;
  right: 20px;
  width: 55px;
  height: 55px;
  background-color: #D9544D;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: bold;
  transform: rotate(-10deg);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.15);
  border: 2px solid #B8433E;
  z-index: 3;
  opacity: 0.9;
}
.stamp-decoration .stamp-text {
  padding-bottom: 3px;
}

.copy-success-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 0.95em;
  z-index: 1001;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .fortune-footer {
    padding: 20px 0 15px;
    border-radius: 15px;
  }
  .main-text {
    font-size: 1em;
  }
  .sub-text {
    font-size: 0.8em;
  }
  .social-link {
    width: 38px;
    height: 38px;
  }
  .social-icon {
    font-size: 18px;
  }
  .stamp-decoration {
    width: 48px;
    height: 48px;
    font-size: 24px;
    bottom: 10px;
    right: 15px;
  }
}

@media (max-width: 480px) {
  .footer-decoration {
    width: 75%;
  }
   .footer-decoration::before, .footer-decoration::after {
    display: none;
  }
  .main-text {
    font-size: 0.9em;
  }
  .main-text::before,
  .main-text::after {
    margin: 0 6px;
    font-size: 0.75em;
  }
  .sub-text {
    font-size: 0.75em;
  }
  .stamp-decoration {
    width: 42px;
    height: 42px;
    font-size: 20px;
    transform: rotate(-8deg);
  }
  .copy-success-toast {
    padding: 10px 20px;
    font-size: 0.9em;
    width: calc(100% - 40px);
    box-sizing: border-box;
  }
}

/* 深色主题样式 */
:global(.dark-theme) .main-text {
  color: #B19CD9;
}

:global(.dark-theme) .main-text::before,
:global(.dark-theme) .main-text::after {
  color: rgba(177, 156, 217, 0.6);
}

:global(.dark-theme) .sub-text {
  color: #D8BFD8;
}

:global(.dark-theme) .social-link {
  background-color: rgba(40, 44, 52, 0.8);
  border-color: rgba(153, 50, 204, 0.3);
}

:global(.dark-theme) .footer-decoration {
  background: linear-gradient(to right, transparent, rgba(153, 50, 204, 0.4), transparent);
}

:global(.dark-theme) .stamp-decoration {
  background: radial-gradient(circle, #9932CC, #8A2BE2);
}
</style> 