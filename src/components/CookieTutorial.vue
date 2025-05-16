<template>
  <div class="tutorial-overlay" v-if="isVisible" @click="handleOutsideClick">
    <div class="tutorial-content" @click.stop>
      <div class="tutorial-header">
        <h2>欢迎使用缘结良缘</h2>
        <button class="close-button" @click="closeTutorial">×</button>
      </div>
      
      <div class="tutorial-body">
        <div class="tutorial-step">
          <div class="step-number">{{ currentStep + 1 }}/{{ steps.length }}</div>
          <div class="step-content">
            <h3>{{ currentStepData ? currentStepData.title : '' }}</h3>
            <p v-if="currentStepData" v-html="currentStepData.description"></p>
            <p class="step-tip" v-if="currentStepData && currentStepData.tip">
              <strong>小贴士：</strong>{{ currentStepData.tip }}
            </p>
          </div>
        </div>
        
        <div class="tutorial-nav">
          <button 
            class="nav-button prev" 
            @click="prevStep" 
            :disabled="currentStep === 0"
            type="button"
          >上一步</button>
          
          <div class="step-dots">
            <span 
              v-for="(_, index) in steps" 
              :key="'dot-' + index" 
              class="dot"
              :class="{ active: currentStep === index }"
              @click="goToStep(index)"
            ></span>
          </div>
          
          <button 
            class="nav-button next" 
            @click="nextStep" 
            v-if="currentStep < steps.length - 1"
            type="button"
          >下一步</button>
          
          <button 
            class="nav-button finish" 
            @click="closeTutorial" 
            v-else
            type="button"
          >开始体验</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const currentStep = ref(0);
const hasSeenTutorial = ref(false);
const showDebug = ref(false);

const steps = [
  {
    title: '缘结良缘 - 寻找你的命定姻缘',
    description: '欢迎来到<span class="highlight">缘结良缘</span>！这是一款充满东方韵味的爱情占卜应用。在这里，缘结神将为你指引前方的缘分之路。让我们开始一段奇妙的占卜之旅吧！',
    tip: '每次占卜都会被记录下来，当你的占卜次数增加，将会解锁更高级的签文。'
  },
  {
    title: '选择签文类型',
    description: '您可以从多种签文类型中进行选择，包括<span class="highlight">爱情缘分、前世姻缘、双人合卦、星座配对</span>等。每种类型都有其独特的解读方式，满足您不同的占卜需求。',
    tip: '不同类型的签文会给您提供不同角度的缘分解读，建议您都尝试一下。'
  },
  {
    title: '摇铃求签',
    description: '点击中央的<span class="highlight">铃铛</span>或使用右下角的快捷按钮，即可开始抽签。摇铃的过程中伴随着清脆的风铃声，寓意着唤醒沉睡的缘分。',
    tip: '铃铛的摇动需要一定的诚意，在抽签前可以默默许下心愿，增加灵验度。'
  },
  {
    title: '查看签文结果',
    description: '每一签都包含<span class="highlight">诗词、解读和建议</span>三个部分。诗词蕴含玄机，解读阐明含义，建议则为您的行动提供指引。仔细阅读，感受缘结神为您指引的方向。',
    tip: '每个签文都有自己的颜色，代表着不同的运势强度。签文的含义需要结合自身情况理解。'
  },
  {
    title: '个人资料设置',
    description: '点击右下角的<span class="highlight">个人头像按钮</span>，可以设置您的姓名、生日等信息。系统会根据您的生日计算星座，并生成与您相关的幸运数字。',
    tip: '完善个人资料后，系统能提供更加个性化的占卜结果，特别是在姓名解析和星座配对中。'
  },
  {
    title: '查看历史记录',
    description: '点击右下角的<span class="highlight">历史记录按钮</span>，可以查看您之前的所有占卜结果。历史记录会按时间排序，方便您回顾和对比不同时期的运势变化。',
    tip: '定期查看历史记录，可以帮助您发现缘分的规律和变化趋势，指导您把握时机。'
  },
  {
    title: '开始你的缘分之旅',
    description: '现在，您已经了解了<span class="highlight">缘结良缘</span>的基本功能。请记住，占卜只是为您提供参考和启发，真正的缘分需要您用心经营和把握。祝您早日寻得良缘！',
    tip: '本应用纯属娱乐，请理性看待占卜结果。最重要的是保持积极心态，勇敢追寻自己的幸福！'
  }
];

const currentStepData = computed(() => {
  return steps[currentStep.value] || null;
});

const nextStep = () => {
  console.log('点击下一步按钮，当前步骤:', currentStep.value, '总步骤:', steps.length);
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    console.log('下一步后的步骤:', currentStep.value);
  }
};

const prevStep = () => {
  console.log('点击上一步按钮，当前步骤:', currentStep.value);
  if (currentStep.value > 0) {
    currentStep.value--;
    console.log('上一步后的步骤:', currentStep.value);
  }
};

const goToStep = (step) => {
  console.log('跳转到步骤:', step, '当前步骤:', currentStep.value);
  currentStep.value = step;
};

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    console.log('教程显示，重置步骤到0');
    currentStep.value = 0;
  }
}, { immediate: true });

const closeTutorial = () => {
  console.log('关闭教程');
  localStorage.setItem('hasSeenTutorial', 'true');
  hasSeenTutorial.value = true;
  emit('close');
};

const handleOutsideClick = (e) => {
  if (e.target.classList.contains('tutorial-overlay')) {
    closeTutorial();
  }
};

onMounted(() => {
  hasSeenTutorial.value = localStorage.getItem('hasSeenTutorial') === 'true';
  console.log('组件挂载，hasSeenTutorial:', hasSeenTutorial.value);
  
  currentStep.value = 0;
  console.log('组件挂载完成，当前步骤:', currentStep.value);
});

defineExpose({
  hasSeenTutorial,
  nextStep,
  prevStep,
  goToStep
});
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.tutorial-content {
  background-color: #fff;
  width: 90%;
  max-width: 550px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease;
  border: 2px solid #e74c3c;
  position: relative;
}

.tutorial-header {
  background-color: #e74c3c;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tutorial-header h2 {
  margin: 0;
  font-size: 1.5em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8em;
  cursor: pointer;
  outline: none;
  transition: transform 0.3s;
}

.close-button:hover {
  transform: scale(1.2);
}

.tutorial-body {
  padding: 20px;
  position: relative;
}

.tutorial-step {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
  position: relative;
  transition: opacity 0.5s ease;
  min-height: 200px;
}

.step-number {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.step-content {
  min-height: 150px;
}

.step-content h3 {
  color: #e74c3c;
  margin-top: 0;
  font-size: 1.3em;
}

.step-content p {
  line-height: 1.6;
  color: #555;
  font-size: 1.05em;
}

.step-tip {
  background-color: #f8f8f8;
  padding: 10px 15px;
  border-left: 4px solid #e74c3c;
  margin-top: 15px;
  font-size: 0.95em;
  color: #666;
}

.highlight {
  color: #e74c3c;
  font-weight: bold;
}

.tutorial-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.nav-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3);
}

.nav-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
}

.nav-button:active {
  transform: translateY(0);
}

.nav-button:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}

.step-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background-color: #e74c3c;
  transform: scale(1.2);
}

.finish {
  background-color: #2ecc71;
  padding: 8px 25px;
}

.finish:hover {
  background-color: #27ae60;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .tutorial-content {
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .tutorial-header h2 {
    font-size: 1.2em;
  }
  
  .step-content h3 {
    font-size: 1.2em;
  }
  
  .step-content p {
    font-size: 1em;
  }
  
  .nav-button {
    padding: 6px 12px;
    font-size: 0.9em;
  }
}
</style> 