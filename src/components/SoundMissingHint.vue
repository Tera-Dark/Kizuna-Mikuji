<template>
  <div class="sound-missing-hint" v-if="isVisible">
    <div class="hint-content">
      <div class="hint-icon"><AppIcon name="volume" :size="22" /></div>
      <div class="hint-message">
        <p>{{ voice.sound.title }}</p>
        <p class="hint-detail">{{ voice.sound.detail }}</p>
      </div>
      <button class="close-button" @click="closeHint">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const closeHint = () => {
  localStorage.setItem('soundHintDismissed', 'true');
  emit('close');
};
</script>

<style scoped>
.sound-missing-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  max-width: 500px;
  width: 90%;
  animation: slideUp 0.5s ease;
}

.hint-content {
  display: flex;
  align-items: center;
  background-color: var(--c-paper);
  border: 1px solid var(--c-line-strong);
  border-left: 3px solid var(--c-shu);
  border-radius: 2px;
  padding: 12px 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.hint-icon {
  font-size: 1.8em;
  margin-right: 15px;
  color: var(--c-shu);
}

.hint-message {
  flex: 1;
}

.hint-message p {
  margin: 0;
  font-size: 0.95em;
}

.hint-message p:first-child {
  font-weight: bold;
  margin-bottom: 3px;
}

.hint-detail {
  color: #6c757d;
  font-size: 0.85em !important;
}

code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
  padding: 0 0 0 10px;
}

.close-button:hover {
  color: #343a40;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hint-content {
    padding: 10px;
  }
  
  .hint-icon {
    font-size: 1.5em;
    margin-right: 10px;
  }
  
  .hint-message p {
    font-size: 0.9em;
  }
  
  .hint-detail {
    font-size: 0.8em !important;
  }
}
</style> 