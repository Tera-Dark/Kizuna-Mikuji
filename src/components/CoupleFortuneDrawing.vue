<script setup>
import AppIcon from './icons/AppIcon.vue';
import { ref, reactive } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';

const fortuneStore = useFortuneStore();
const userName = ref('');
const userBirthdate = ref('');
const partnerName = ref('');
const partnerBirthdate = ref('');
const showPartnerInput = ref(false);
const coupleResult = reactive({
  compatibility: 0,
  title: '',
  description: '',
  advice: ''
});

// 添加日期选择相关状态
const userBirthYear = ref('');
const userBirthMonth = ref('');
const userBirthDay = ref('');
const partnerBirthYear = ref('');
const partnerBirthMonth = ref('');
const partnerBirthDay = ref('');

// 生成年份选项：1950年-当前年
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

// 生成月份选项：1-12月
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

// 根据年月生成对应的天数选项
const getDayOptions = (year, month) => {
  if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
  
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

// 监听年月变化，更新日期值
const updateBirthdate = () => {
  if (userBirthYear.value && userBirthMonth.value && userBirthDay.value) {
    userBirthdate.value = `${userBirthYear.value}-${userBirthMonth.value.toString().padStart(2, '0')}-${userBirthDay.value.toString().padStart(2, '0')}`;
  }
  
  if (partnerBirthYear.value && partnerBirthMonth.value && partnerBirthDay.value) {
    partnerBirthdate.value = `${partnerBirthYear.value}-${partnerBirthMonth.value.toString().padStart(2, '0')}-${partnerBirthDay.value.toString().padStart(2, '0')}`;
  }
};

const togglePartnerInput = () => {
  showPartnerInput.value = !showPartnerInput.value;
  if (!showPartnerInput.value) {
    coupleResult.title = '';
  }
};

const calculateCompatibility = () => {
  // 简单的兼容性计算逻辑
  if (!userName.value || !userBirthdate.value || !partnerName.value || !partnerBirthdate.value) {
    return 0;
  }
  
  // 基于生日计算兼容性
  const userDate = new Date(userBirthdate.value);
  const partnerDate = new Date(partnerBirthdate.value);
  
  // 使用日期数字之和取模计算基础兼容值
  const userSum = userDate.getDate() + userDate.getMonth() + 1;
  const partnerSum = partnerDate.getDate() + partnerDate.getMonth() + 1;
  
  // 生成60-99之间的兼容性分数
  const baseScore = (userSum * partnerSum) % 40 + 60;
  
  // 根据名字长度调整，增加随机性
  const nameAdjustment = (userName.value.length + partnerName.value.length) % 5;
  
  return Math.min(99, baseScore + nameAdjustment);
};

const drawCoupleResult = () => {
  if (!userName.value || !userBirthdate.value || !partnerName.value || !partnerBirthdate.value) {
    alert('请完整填写双方信息');
    return;
  }
  
  const compatibility = calculateCompatibility();
  coupleResult.compatibility = compatibility;
  
  // 根据兼容性评分设置结果
  if (compatibility >= 90) {
    coupleResult.title = '天作之合';
    coupleResult.description = '你们是天生一对，缘分深厚，心有灵犀。彼此理解与包容，能够共同成长。';
    coupleResult.advice = '珍惜这段难得的缘分，相互扶持，共创美好未来。';
  } else if (compatibility >= 80) {
    coupleResult.title = '良缘佳偶';
    coupleResult.description = '你们的缘分深厚，性格互补，在一起能激发彼此的最佳状态。';
    coupleResult.advice = '在生活的点滴中增进了解，用心经营这段感情。';
  } else if (compatibility >= 70) {
    coupleResult.title = '相濡以沫';
    coupleResult.description = '你们的关系需要用心经营，但只要共同努力，定能走得长远。';
    coupleResult.advice = '多沟通、多理解，学会欣赏彼此的不同。';
  } else {
    coupleResult.title = '缘分考验';
    coupleResult.description = '你们之间存在不少挑战，需要更多的包容与妥协。';
    coupleResult.advice = '学会换位思考，尊重对方的不同，或许能发现意想不到的契合点。';
  }
  
  fortuneStore.saveToHistory({
    type: '双人合卦',
    date: new Date().toLocaleDateString(),
    result: `${coupleResult.title} (${coupleResult.compatibility}分)`,
    user: userName.value,
    partner: partnerName.value
  });
};
</script>

<template>
  <div class="couple-fortune-container themed-container">
    <div class="couple-intro decorative-section" v-if="!showPartnerInput">
      <h3 class="main-title"><span class="deco-icon left"><AppIcon name="rings" :size="18" /></span> 两个人的线 <span class="deco-icon right"><AppIcon name="rings" :size="18" /></span></h3>
      <p class="intro-text">两个人站到一起，线是缠紧、打结，还是各走各的？<br>本神明量一量就知道了。<br>——先把名字报上来。</p>
      <button class="start-couple-btn themed-button primary-button" @click="togglePartnerInput">
        <AppIcon name="mail" :size="15" class="btn-icon" /> 那就量一量
      </button>
    </div>
    
    <div class="partner-input themed-section-box" v-if="showPartnerInput && !coupleResult.title">
      <h3 class="section-title"><span class="deco-icon left"><AppIcon name="thread" :size="16" /></span> 两个人的名字，都写下来 <span class="deco-icon right"><AppIcon name="thread" :size="16" /></span></h3>
      
      <div class="couple-form-grid">
        <!-- User Info -->
        <div class="form-section user-section">
          <h4 class="form-section-title">其一</h4>
          <div class="input-group themed-input-group">
            <label for="userName">姓名：</label>
            <input id="userName" v-model="userName" placeholder="你的名字" class="themed-input" />
          </div>
          
          <div class="input-group themed-input-group">
            <label>生辰：</label>
            <div class="date-select-container themed-date-select">
              <select v-model="userBirthYear" class="date-select year-select themed-select" @change="updateBirthdate">
                <option value="" disabled selected>年</option>
                <option v-for="year in yearOptions" :key="`user-year-${year}`" :value="year">{{ year }}</option>
              </select>
              <select v-model="userBirthMonth" class="date-select month-select themed-select" @change="updateBirthdate">
                <option value="" disabled selected>月</option>
                <option v-for="month in monthOptions" :key="`user-month-${month}`" :value="month">{{ month }}</option>
              </select>
              <select v-model="userBirthDay" class="date-select day-select themed-select" @change="updateBirthdate">
                <option value="" disabled selected>日</option>
                <option v-for="day in getDayOptions(userBirthYear, userBirthMonth)" :key="`user-day-${day}`" :value="day">{{ day }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="input-separator-vertical"></div>

        <!-- Partner Info -->
        <div class="form-section partner-section">
          <h4 class="form-section-title">其二</h4>
          <div class="input-group themed-input-group">
            <label for="partnerName">TA 的名字：</label>
            <input id="partnerName" v-model="partnerName" placeholder="TA 的名字" class="themed-input" />
          </div>
          
          <div class="input-group themed-input-group">
            <label>TA生辰：</label>
            <div class="date-select-container themed-date-select">
              <select v-model="partnerBirthYear" class="date-select year-select themed-select" @change="updateBirthdate">
                 <option value="" disabled selected>年</option>
                <option v-for="year in yearOptions" :key="`partner-year-${year}`" :value="year">{{ year }}</option>
              </select>
              <select v-model="partnerBirthMonth" class="date-select month-select themed-select" @change="updateBirthdate">
                <option value="" disabled selected>月</option>
                <option v-for="month in monthOptions" :key="`partner-month-${month}`" :value="month">{{ month }}</option>
              </select>
              <select v-model="partnerBirthDay" class="date-select day-select themed-select" @change="updateBirthdate">
                <option value="" disabled selected>日</option>
                <option v-for="day in getDayOptions(partnerBirthYear, partnerBirthMonth)" :key="`partner-day-${day}`" :value="day">{{ day }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div class="couple-buttons button-row">
        <button class="cancel-btn themed-button secondary-button" @click="togglePartnerInput">算了</button>
        <button class="draw-btn themed-button primary-button" @click="drawCoupleResult">
          <AppIcon name="heart" :size="15" class="btn-icon" /> 牵线
        </button>
      </div>
    </div>
    
    <div class="couple-result" v-if="coupleResult.title">
      <div class="compatibility-meter">
        <div class="meter-title">缘线粗细</div>
        <div class="meter-value">{{ coupleResult.compatibility }}%</div>
        <div class="meter-bar">
          <div class="meter-fill" :style="{width: coupleResult.compatibility + '%'}"></div>
        </div>
      </div>
      
      <div class="result-content">
        <h3>{{ coupleResult.title }}</h3>
        <p class="result-description">{{ coupleResult.description }}</p>
        <p class="result-advice">【本神明说】{{ coupleResult.advice }}</p>
      </div>
      
      <button class="try-again-btn themed-button secondary-button" @click="togglePartnerInput">换两个人再量</button>
    </div>
  </div>
</template>

<style scoped>
.couple-fortune-container.themed-container {
  background-color: var(--c-paper-2);
  background-image:
    radial-gradient(100% 90% at 50% 0%, rgba(255, 255, 255, 0.6), transparent 70%);
  border-radius: 6px;
  padding: 30px 34px 26px;
  margin: 24px auto;
  box-shadow: var(--shadow-paper-sm);
  max-width: 700px;
  text-align: center;
  font-family: var(--font-body);
  border: 1px solid var(--c-line);
  border-top: 3px solid var(--c-shu);
}

.decorative-section {
  padding: 4px 8px;
  margin-bottom: 22px;
}

.couple-intro .main-title,
.partner-input .section-title {
  color: var(--c-ink);
  font-family: var(--font-display);
  font-size: 1.65em;
  font-weight: 600;
  letter-spacing: 0.14em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-input .section-title {
  font-size: 1.8em;
  margin-bottom: 25px;
}

.deco-icon {
  color: var(--c-shu);
  font-size: 0.65em;
  margin: 0 12px;
  opacity: 0.75;
}

.couple-intro .intro-text {
  color: var(--c-ink-soft);
  font-size: 1em;
  line-height: 2;
  margin-bottom: 24px;
  font-family: var(--font-body);
}

.themed-button {
  padding: 11px 26px;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-body);
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.themed-button .btn-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}
.themed-button:hover .btn-icon {
  transform: scale(1.2) rotate(-10deg);
}

.themed-button.primary-button {
  background-color: var(--c-shu);
  color: #FFF8F0;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.18) inset, 0 3px 8px rgba(143, 39, 28, 0.18);
}
.themed-button.primary-button:hover {
  background-color: var(--c-shu-deep);
  transform: translateY(-1px);
}

.themed-button.secondary-button {
  background-color: transparent;
  color: var(--c-shu);
  border: 1px solid var(--c-line-strong);
  box-shadow: none;
}
.themed-button.secondary-button:hover {
  background-color: var(--c-shu-wash);
  border-color: var(--c-shu);
  color: var(--c-shu-deep);
}

/* Partner Input Section */
.partner-input.themed-section-box {
  padding: 22px 24px;
  background-color: rgba(255, 252, 246, 0.72);
  border-radius: 4px;
  border: 1px solid var(--c-line);
}

.couple-form-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Gap between two form sections */
  margin-bottom: 25px;
}

.form-section {
  flex: 1;
  padding: 14px 16px;
  border-radius: 3px;
  background-color: rgba(255, 254, 250, 0.6);
  border: 1px solid var(--c-line);
}

.form-section-title {
  font-family: var(--font-display);
  color: var(--c-shu);
  font-size: 1.05em;
  letter-spacing: 0.18em;
  margin-bottom: 18px;
  border-bottom: 1px dashed var(--c-line-strong);
  padding-bottom: 8px;
}

.input-group.themed-input-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Labels on left */
  text-align: left;
}

.input-group.themed-input-group label {
  font-size: 0.95em;
  color: var(--c-ink-soft);
  margin-bottom: 6px;
  font-weight: 600;
  font-family: var(--font-ui);
  font-size: 0.88em;
  letter-spacing: 0.05em;
}

.themed-input,
.themed-select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 2px;
  border: 1px solid var(--c-line-strong);
  background-color: #FFFCF6;
  font-size: 0.95em;
  color: var(--c-ink);
  font-family: var(--font-body);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.themed-input:focus,
.themed-select:focus {
  border-color: var(--c-shu);
  box-shadow: 0 0 0 3px var(--c-shu-wash);
  outline: none;
}

.themed-input::placeholder {
  color: var(--theme-color-placeholder, #bcaaaa);
  font-style: italic;
}

.date-select-container.themed-date-select {
  display: flex;
  gap: 8px;
  width: 100%;
}

.date-select.themed-select {
  flex-grow: 1;
}

.input-separator-vertical {
  width: 1px;
  background-color: var(--c-line);
  align-self: stretch; /* Make it full height of the flex container */
  margin: 10px 0; /* Optional: add some vertical margin if sections have padding */
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 650px) {
  .couple-form-grid {
    flex-direction: column;
  }
  .input-separator-vertical {
    width: 100%;
    height: 1.5px;
    margin: 20px 0;
  }
  .couple-fortune-container.themed-container {
    padding: 20px;
  }
  .couple-intro .main-title,
  .partner-input .section-title {
    font-size: 1.9em;
  }
}

/* Result display */
.couple-result {
  padding-top: 4px;
}

.compatibility-meter {
  margin: 6px 0 22px;
  text-align: center;
}

.meter-title {
  font-size: 0.76em;
  letter-spacing: 0.22em;
  color: var(--c-ink-faint);
  margin-bottom: 4px;
}

.meter-value {
  font-family: var(--font-display);
  font-size: 2.4em;
  line-height: 1.1;
  color: var(--c-shu);
  font-variant-numeric: tabular-nums;
}

.meter-bar {
  max-width: 420px;
  height: 8px;
  margin: 12px auto 0;
  background-color: rgba(188, 59, 42, 0.08);
  border: 1px solid var(--c-line);
  border-radius: 1px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: var(--c-shu);
  transition: width 0.9s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.result-content h3 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: 1.35em;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--c-ink);
}

.result-description {
  margin: 0 0 16px;
  color: var(--c-ink-soft);
  font-size: 0.94em;
  line-height: 1.9;
}

.result-advice {
  margin: 0 0 8px;
  padding: 14px 16px;
  border-left: 2px solid var(--c-shu-soft);
  background-color: rgba(255, 254, 250, 0.6);
  color: var(--c-ink-soft);
  font-size: 0.9em;
  line-height: 1.85;
  text-align: left;
}

</style> 