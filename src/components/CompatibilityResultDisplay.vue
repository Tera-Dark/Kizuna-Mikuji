<template>
  <div class="compatibility-result-display-wrapper themed-section-box reveal-item" v-if="result && result.sign1">
    <h4 class="result-main-title"><span class="title-deco left">❀</span> 缘分解析结果 <span class="title-deco right">❀</span></h4>
    <div class="result-overview themed-subsection">
      <div class="signs-compared">
        <span class="sign-emoji">{{ result.sign1?.emoji }}</span> 
        <span class="sign-name">{{ result.sign1?.name }}</span>
        <span class="vs-text themed-vs">엮</span>
        <span class="sign-emoji">{{ result.sign2?.emoji }}</span>
        <span class="sign-name">{{ result.sign2?.name }}</span>
      </div>
      <div class="overall-score">
        <span class="score-label">缘分指数：</span>
        <div class="score-badge">
          <span class="score-value" :style="{ color: result.scoreColor }">{{ result.score }}</span>
          <span class="score-unit">分</span>
        </div>
      </div>
      <p class="compatibility-summary">{{ result.summary }}</p>
    </div>
    <div class="result-details">
      <div class="detail-section themed-subsection">
        <h5 class="detail-title good"><span class="deco-icon">💖</span> 缘定优点</h5>
        <p>{{ result.strengths }}</p>
      </div>
      <div class="detail-section themed-subsection">
        <h5 class="detail-title challenging"><span class="deco-icon">🎐</span> 缘浅挑战</h5>
        <p>{{ result.weaknesses }}</p>
      </div>
      <div class="detail-section advice themed-subsection">
        <h5 class="detail-title advice-title"><span class="deco-icon">📜</span> 相处之道</h5>
        <p>{{ result.advice }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  result: {
    type: Object,
    default: () => null // Default to null if no result is passed
  }
});
</script>

<style scoped>
.themed-section-box {
  margin-top: 25px;
  padding: 25px 30px;
  background-color: rgba(255, 250, 248, 0.92);
  border-radius: 20px; 
  box-shadow: 0 8px 28px rgba(217, 84, 77, 0.12), 0 0 0 2px rgba(229, 109, 97, 0.3);
  width: 100%;
  max-width: 780px; 
  border: 1px solid transparent;
  animation: resultFadeInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes resultFadeInUp {
  from { opacity: 0; transform: translateY(25px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.result-main-title {
  text-align: center;
  color: #B8433E;
  font-size: 1.9em;
  margin-bottom: 25px;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  font-weight: 600;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-deco {
  font-size: 0.8em;
  color: #E56D61;
  opacity: 0.85;
}

.themed-subsection {
  background-color: #FFFDFB; 
  padding: 20px 25px;
  border-radius: 15px;
  border: 1px solid rgba(229, 109, 97, 0.25);
  box-shadow: 0 3px 10px rgba(217, 84, 77, 0.07);
  margin-bottom: 20px;
}
.result-overview {
  text-align: center;
  padding-bottom: 20px;
}

.signs-compared {
  font-size: 1.2em; 
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px; 
}

.sign-emoji {
  font-size: 2.2em; 
  opacity: 0.9;
}

.sign-name {
  font-weight: 600;
  color: #8C3835;
  font-family: var(--font-family-sans-serif);
}

.themed-vs {
  color: #D9544D;
  font-weight: bold;
  font-size: 1.5em;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  padding: 0 5px;
}

.overall-score {
  font-size: 1.3em; 
  font-weight: 500;
  color: #C74840;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.score-label {
}

.score-badge {
  background: linear-gradient(135deg, #F8CACC, #E56D61);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 1.1em; 
  font-weight: bold;
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  box-shadow: 0 2px 5px rgba(184, 67, 62, 0.3);
  min-width: 70px; 
  text-align: center;
  justify-content: center;
}

.score-value {
  font-size: 1.3em;
  line-height: 1; 
}
.score-unit {
  font-size: 0.8em;
  margin-left: 2px;
}

.compatibility-summary {
  font-size: 1em; 
  color: #6D4C41;
  line-height: 1.75;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  font-family: var(--font-family-serif);
  text-align: justify;
}

.result-details .detail-section {
}

.detail-title {
  font-size: 1.35em; 
  margin-bottom: 12px;
  border-bottom: 1.5px solid rgba(229, 109, 97, 0.2);
  padding-bottom: 10px;
  font-weight: 500;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-title .deco-icon {
  font-size: 1.1em;
  opacity: 0.8;
}

.detail-title.good {
  color: #D9544D;
}
.detail-title.good .deco-icon {
  color: #E56D61;
}

.detail-title.challenging {
  color: #795548;
}
.detail-title.challenging .deco-icon {
  color: #A1887F;
}

.detail-title.advice-title {
  color: #B8433E;
}
.detail-title.advice-title .deco-icon {
  color: #E58F87;
}

.result-details p {
  font-size: 0.95em;
  color: #5D4037;
  line-height: 1.8;
  text-align: justify;
  padding: 8px 10px;
  border-left: 3px solid;
  background-color: rgba(255, 250, 248, 0.5);
  border-radius: 0 5px 5px 0;
}

.detail-section.themed-subsection:nth-child(1) p {
  border-left-color: #F8CACC;
}
.detail-section.themed-subsection:nth-child(2) p {
  border-left-color: #FFCDD2;
}
.detail-section.advice.themed-subsection p {
  border-left-color: #FFBFAB;
}

@media (max-width: 768px) {
  .themed-section-box {
    padding: 20px 15px;
  }
  .result-main-title {
    font-size: 1.6em;
    gap: 8px;
  }
  .themed-subsection {
    padding: 15px;
  }
  .signs-compared {
    font-size: 1.1em;
    gap: 10px;
  }
   .sign-emoji {
    font-size: 2em;
  }
  .themed-vs {
    font-size: 1.3em;
  }
  .overall-score {
    font-size: 1.15em;
    flex-direction: column;
    gap: 8px;
  }
  .score-badge {
    font-size: 1em;
    padding: 4px 10px;
  }
  .score-value {
    font-size: 1.2em;
  }
  .compatibility-summary {
    font-size: 0.9em;
  }
  .detail-title {
    font-size: 1.2em;
  }
  .result-details p {
    font-size: 0.9em;
    line-height: 1.7;
    padding: 6px 8px;
  }
}

</style> 