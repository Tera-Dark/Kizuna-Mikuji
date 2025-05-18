<script setup>
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
      <h3 class="main-title"><span class="deco-icon left">💞</span> 双人姻缘合卦 <span class="deco-icon right">💞</span></h3>
      <p class="intro-text">执子之手，与子偕老。在此诚邀两位小主，<br>一同卜算心心相印的缘分指数，<br>探寻那份专属於你们的浪漫篇章。</p>
      <button class="start-couple-btn themed-button primary-button" @click="togglePartnerInput">
        <span class="btn-icon">💌</span> 启此良缘合卦
      </button>
    </div>
    
    <div class="partner-input themed-section-box" v-if="showPartnerInput && !coupleResult.title">
      <h3 class="section-title"><span class="deco-icon left">❦</span> 请入双方结缘信息 <span class="deco-icon right">❦</span></h3>
      
      <div class="couple-form-grid">
        <!-- User Info -->
        <div class="form-section user-section">
          <h4 class="form-section-title">缘主·其一</h4>
          <div class="input-group themed-input-group">
            <label for="userName">芳名：</label>
            <input id="userName" v-model="userName" placeholder="轻启玉指，输入芳名" class="themed-input" />
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
          <h4 class="form-section-title">缘主·其二</h4>
          <div class="input-group themed-input-group">
            <label for="partnerName">TA之名：</label>
            <input id="partnerName" v-model="partnerName" placeholder="轻启玉指，输入TA名" class="themed-input" />
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
        <button class="cancel-btn themed-button secondary-button" @click="togglePartnerInput">返回</button>
        <button class="draw-btn themed-button primary-button" @click="drawCoupleResult">
          <span class="btn-icon">💖</span> 合此良缘天定
        </button>
      </div>
    </div>
    
    <div class="couple-result" v-if="coupleResult.title">
      <div class="compatibility-meter">
        <div class="meter-title">缘分指数</div>
        <div class="meter-value">{{ coupleResult.compatibility }}%</div>
        <div class="meter-bar">
          <div class="meter-fill" :style="{width: coupleResult.compatibility + '%'}"></div>
        </div>
      </div>
      
      <div class="result-content">
        <h3>{{ coupleResult.title }}</h3>
        <p class="result-description">{{ coupleResult.description }}</p>
        <p class="result-advice">【缘分建议】{{ coupleResult.advice }}</p>
      </div>
      
      <button class="try-again-btn themed-button secondary-button" @click="togglePartnerInput">重新测算</button>
    </div>
  </div>
</template>

<style scoped>
.couple-fortune-container.themed-container {
  background-color: var(--theme-color-background-light, rgba(255, 245, 248, 0.95)); 
  border-radius: 25px;
  padding: 30px 35px;
  margin: 25px auto;
  box-shadow: 0 8px 25px var(--theme-color-shadow-light, rgba(217, 84, 77, 0.15)), 
              0 0 0 2px var(--theme-color-border-subtle, rgba(229, 109, 97, 0.2));
  max-width: 700px; 
  text-align: center;
  font-family: var(--font-family-sans-serif);
  border: 1px solid transparent; /* Ensure box-shadow border shows correctly */
}

.decorative-section {
  padding: 20px;
  border-radius: 18px;
  background-color: rgba(255, 250, 250, 0.8); /* Light washi paper feel */
  margin-bottom: 30px;
}

.couple-intro .main-title,
.partner-input .section-title {
  color: var(--theme-color-dark, #B8433E);
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  font-size: 2.2em;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-input .section-title {
  font-size: 1.8em;
  margin-bottom: 25px;
}

.deco-icon {
  color: var(--theme-color-red, #E56D61);
  font-size: 0.7em;
  margin: 0 10px;
  opacity: 0.9;
}

.couple-intro .intro-text {
  color: var(--theme-color-text-subtle, #8C3835);
  font-size: 1.05em;
  line-height: 1.8;
  margin-bottom: 25px;
  font-family: var(--font-family-sans-serif);
}

.themed-button {
  padding: 12px 25px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  border-radius: 30px; /* Pill shape */
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
}

.themed-button .btn-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}
.themed-button:hover .btn-icon {
  transform: scale(1.2) rotate(-10deg);
}

.themed-button.primary-button {
  background: linear-gradient(145deg, var(--theme-color-red, #E56D61), var(--theme-color-dark, #B8433E));
  color: white;
  box-shadow: 0 4px 12px rgba(184, 67, 62, 0.25), 0 0 0 1.5px rgba(255,255,255,0.3) inset;
}
.themed-button.primary-button:hover {
  background: linear-gradient(145deg, var(--theme-color-dark, #B8433E), var(--theme-color-red, #E56D61));
  box-shadow: 0 6px 16px rgba(184, 67, 62, 0.35), 0 0 0 1.5px rgba(255,255,255,0.4) inset;
  transform: translateY(-2px);
}

.themed-button.secondary-button {
  background-color: #fff;
  color: var(--theme-color-red, #E56D61);
  border: 2px solid var(--theme-color-red, #E56D61);
  box-shadow: 0 2px 8px rgba(217, 84, 77, 0.1);
}
.themed-button.secondary-button:hover {
  background-color: var(--theme-color-extralight-pink, #FFF5F5);
  border-color: var(--theme-color-dark, #B8433E);
  color: var(--theme-color-dark, #B8433E);
  transform: translateY(-1px);
}

/* Partner Input Section */
.partner-input.themed-section-box {
  padding: 25px 30px;
  background-color: rgba(255, 250, 248, 0.9); /* Slightly different light washi */
  border-radius: 18px; 
  box-shadow: 0 6px 20px rgba(217, 84, 77, 0.1), 0 0 0 1.5px rgba(229, 109, 97, 0.2);
  border: 1px solid transparent; 
}

.couple-form-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Gap between two form sections */
  margin-bottom: 25px;
}

.form-section {
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  background-color: rgba(255, 252, 250, 0.8);
  border: 1px solid var(--theme-color-border-very-subtle, rgba(229, 109, 97, 0.15));
}

.form-section-title {
  font-family: var(--font-family-serif-decorative, 'Ma Shan Zheng', cursive);
  color: var(--theme-color-red, #D9544D);
  font-size: 1.3em;
  margin-bottom: 18px;
  border-bottom: 1px dashed var(--theme-color-border-subtle, rgba(229, 109, 97, 0.3));
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
  color: var(--theme-color-dark, #B8433E);
  margin-bottom: 6px;
  font-weight: 600;
  font-family: var(--font-family-sans-serif);
}

.themed-input,
.themed-select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--theme-color-border-subtle, rgba(229, 109, 97, 0.3));
  background-color: #fff;
  font-size: 0.95em;
  color: var(--theme-color-text, #5C2827);
  font-family: var(--font-family-sans-serif);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.themed-input:focus,
.themed-select:focus {
  border-color: var(--theme-color-red, #E56D61);
  box-shadow: 0 0 0 3px rgba(229, 109, 97, 0.2);
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
  width: 1.5px;
  background-color: var(--theme-color-border-subtle, rgba(229, 109, 97, 0.3));
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

/* Result display styles will be added here in the next step */

</style> 