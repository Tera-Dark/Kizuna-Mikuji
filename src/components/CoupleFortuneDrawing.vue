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
  <div class="couple-fortune-container">
    <div class="couple-intro" v-if="!showPartnerInput">
      <h3>双人姻缘合卦</h3>
      <p>天赐良缘，姻缘天定。与心上人一起测算你们的缘分指数吧！</p>
      <button class="start-couple-btn" @click="togglePartnerInput">开始双人抽签</button>
    </div>
    
    <div class="partner-input" v-if="showPartnerInput && !coupleResult.title">
      <h3>请输入双方信息</h3>
      <div class="input-group">
        <label>您的姓名：</label>
        <input v-model="userName" placeholder="请输入您的姓名" />
      </div>
      
      <div class="input-group">
        <label>您的生日：</label>
        <div class="date-select-container">
          <select 
            v-model="userBirthYear" 
            class="date-select year-select"
            @change="updateBirthdate"
          >
            <option value="" disabled selected>年</option>
            <option v-for="year in yearOptions" :key="`user-year-${year}`" :value="year">{{ year }}年</option>
          </select>
          <select 
            v-model="userBirthMonth" 
            class="date-select month-select"
            @change="updateBirthdate"
          >
            <option value="" disabled selected>月</option>
            <option v-for="month in monthOptions" :key="`user-month-${month}`" :value="month">{{ month }}月</option>
          </select>
          <select 
            v-model="userBirthDay" 
            class="date-select day-select"
            @change="updateBirthdate"
          >
            <option value="" disabled selected>日</option>
            <option 
              v-for="day in getDayOptions(userBirthYear, userBirthMonth)" 
              :key="`user-day-${day}`" 
              :value="day"
            >{{ day }}日</option>
          </select>
        </div>
      </div>
      
      <div class="input-separator"></div>
      
      <div class="input-group">
        <label>对方姓名：</label>
        <input v-model="partnerName" placeholder="请输入对方姓名" />
      </div>
      
      <div class="input-group">
        <label>对方生日：</label>
        <div class="date-select-container">
          <select 
            v-model="partnerBirthYear" 
            class="date-select year-select"
            @change="updateBirthdate"
          >
            <option value="" disabled selected>年</option>
            <option v-for="year in yearOptions" :key="`partner-year-${year}`" :value="year">{{ year }}年</option>
          </select>
          <select 
            v-model="partnerBirthMonth" 
            class="date-select month-select"
            @change="updateBirthdate"
          >
            <option value="" disabled selected>月</option>
            <option v-for="month in monthOptions" :key="`partner-month-${month}`" :value="month">{{ month }}月</option>
          </select>
          <select 
            v-model="partnerBirthDay" 
            class="date-select day-select"
            @change="updateBirthdate"
          >
            <option value="" disabled selected>日</option>
            <option 
              v-for="day in getDayOptions(partnerBirthYear, partnerBirthMonth)" 
              :key="`partner-day-${day}`" 
              :value="day"
            >{{ day }}日</option>
          </select>
        </div>
      </div>
      
      <div class="couple-buttons">
        <button class="cancel-btn" @click="togglePartnerInput">取消</button>
        <button class="draw-btn" @click="drawCoupleResult">测算缘分</button>
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
      
      <button class="try-again-btn" @click="togglePartnerInput">重新测算</button>
    </div>
  </div>
</template>

<style scoped>
.couple-fortune-container {
  background-color: rgba(255, 245, 238, 0.92);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 550px;
  border: 1px solid #d4af37;
}

.couple-intro h3, .partner-input h3, .couple-result h3 {
  color: #d4546a;
  font-weight: normal;
  margin-bottom: 15px;
}

.start-couple-btn, .draw-btn {
  background: linear-gradient(135deg, #ff5e94, #ff3366);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
  transition: all 0.3s;
}

.start-couple-btn:hover, .draw-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 94, 148, 0.4);
}

.input-group {
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.input-group label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}

.input-group input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-separator {
  height: 1px;
  background-color: #eee;
  margin: 15px 0;
}

.couple-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.compatibility-meter {
  text-align: center;
  margin: 20px 0;
}

.meter-title {
  font-size: 16px;
  color: #666;
}

.meter-value {
  font-size: 36px;
  font-weight: bold;
  color: #ff3366;
  margin: 10px 0;
}

.meter-bar {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  margin: 10px 0;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(to right, #ffcc33, #ff3366);
  border-radius: 5px;
  transition: width 1s ease-in-out;
}

.result-content {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
}

.result-description {
  line-height: 1.6;
  margin-bottom: 15px;
}

.result-advice {
  color: #d4546a;
}

.try-again-btn {
  background-color: transparent;
  color: #ff3366;
  border: 1px solid #ff3366;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
}

/* 深色主题适配 */
:deep(.dark-theme) .couple-fortune-container {
  background-color: rgba(40, 44, 52, 0.92);
  border-color: #bc9d2e;
}

:deep(.dark-theme) .couple-intro h3, 
:deep(.dark-theme) .partner-input h3, 
:deep(.dark-theme) .couple-result h3 {
  color: #ff7c98;
}

:deep(.dark-theme) .result-content {
  background-color: rgba(60, 64, 72, 0.6);
}

:deep(.dark-theme) .input-separator {
  background-color: #555;
}

:deep(.dark-theme) .input-group input {
  background-color: rgba(30, 34, 42, 0.8);
  color: #eee;
  border-color: #555;
}

:deep(.dark-theme) .result-advice {
  color: #ff7c98;
}

/* 日期选择器样式 */
.date-select-container {
  display: flex;
  flex: 1;
  gap: 8px;
}

.date-select {
  padding: 8px 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23888' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.date-select:hover {
  border-color: #c0c0c0;
}

.date-select:focus {
  border-color: #ff3366;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 51, 102, 0.2);
}

.year-select {
  flex: 1.2;
}

.month-select {
  flex: 0.9;
}

.day-select {
  flex: 0.9;
}

/* 深色主题适配 */
:deep(.dark-theme) .date-select {
  background-color: rgba(30, 34, 42, 0.8);
  color: #eee;
  border-color: #555;
}

:deep(.dark-theme) .date-select:hover {
  border-color: #777;
}

:deep(.dark-theme) .date-select:focus {
  border-color: #ff7c98;
  box-shadow: 0 0 0 3px rgba(255, 124, 152, 0.2);
}
</style> 