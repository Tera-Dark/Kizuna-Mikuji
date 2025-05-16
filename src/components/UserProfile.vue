<template>
  <div class="profile-container" :class="{ 'profile-open': isOpen }">
    <div class="scroll-handle top-handle"></div>
    <div class="profile-scroll">
      <div class="profile-seal"></div>
      <div class="profile-content">
        <h3 class="profile-title">缘主信息</h3>
        
        <div class="profile-form">
          <div class="form-group">
            <label for="userName">法名</label>
            <input type="text" id="userName" v-model="userName" placeholder="请输入您的姓名">
          </div>
          
          <div class="form-group">
            <label for="birthdate">降世之日</label>
            <div class="date-select-container">
              <select 
                v-model="birthYear" 
                class="date-select year-select"
                @change="updateBirthdate"
              >
                <option value="" disabled selected>年</option>
                <option v-for="year in yearOptions" :key="`year-${year}`" :value="year">{{ year }}年</option>
              </select>
              <select 
                v-model="birthMonth" 
                class="date-select month-select"
                @change="updateBirthdate"
              >
                <option value="" disabled selected>月</option>
                <option v-for="month in monthOptions" :key="`month-${month}`" :value="month">{{ month }}月</option>
              </select>
              <select 
                v-model="birthDay" 
                class="date-select day-select"
                @change="updateBirthdate"
              >
                <option value="" disabled selected>日</option>
                <option 
                  v-for="day in getDayOptions(birthYear, birthMonth)" 
                  :key="`day-${day}`" 
                  :value="day"
                >{{ day }}日</option>
              </select>
            </div>
          </div>
          
          <div class="form-group zodiac-group">
            <label>星命</label>
            <div class="zodiac-display">
              <span class="zodiac-text">{{ zodiacSign }}</span>
              <div class="zodiac-icon" v-if="zodiacSign !== '未知'" :data-icon="getZodiacIcon(zodiacSign)"></div>
            </div>
          </div>
          
          <div class="form-group luck-group">
            <label>今日缘数</label>
            <div class="lucky-display">
              <div class="lucky-number">{{ luckyNumber }}</div>
              <button class="refresh-button" @click="generateLuckyNumber">
                <span>更新</span>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>本月签运</label>
            <div class="monthly-fortune">{{ monthlyFortune }}</div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="save-button" @click="saveProfile">
            <span>保存</span>
          </button>
          <button class="clear-button" @click="clearProfile">
            <span>清除</span>
          </button>
        </div>
        
        <div v-if="showSaveConfirmation" class="save-confirmation">
          <div class="confirmation-inner">缘信已记</div>
        </div>
      </div>
      <div class="scroll-ends left-end"></div>
      <div class="scroll-ends right-end"></div>
    </div>
    <div class="scroll-handle bottom-handle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// 状态
const isOpen = ref(false);
const userName = ref('');
const birthdate = ref('');
const luckyNumber = ref(0);
const showSaveConfirmation = ref(false);

// 日期选择相关状态
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');

// 生成年份选项：1950年-当前年
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

// 生成月份选项：1-12月
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

// 根据年月生成对应的天数选项
const getDayOptions = (year: string | number, month: string | number) => {
  if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
  
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

// 更新birthdate值
const updateBirthdate = () => {
  if (birthYear.value && birthMonth.value && birthDay.value) {
    birthdate.value = `${birthYear.value}-${birthMonth.value.toString().padStart(2, '0')}-${birthDay.value.toString().padStart(2, '0')}`;
  }
};

// 从birthdate更新年月日选择器值
const updateDateSelectors = () => {
  if (birthdate.value) {
    const [year, month, day] = birthdate.value.split('-');
    birthYear.value = year;
    birthMonth.value = parseInt(month, 10);
    birthDay.value = parseInt(day, 10);
  }
};

// 监听birthdate变化
watch(birthdate, () => {
  if (birthdate.value) {
    updateDateSelectors();
  }
});

// 切换个人资料面板显示/隐藏
const toggleProfile = () => {
  isOpen.value = !isOpen.value;
};

// 计算星座
const zodiacSign = computed(() => {
  if (!birthdate.value) return '未知';
  
  const date = new Date(birthdate.value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座';
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
  return '双鱼座';
});

// 生成幸运数字
const generateLuckyNumber = () => {
  luckyNumber.value = Math.floor(Math.random() * 99) + 1;
};

// 本月签运
const monthlyFortune = computed(() => {
  const fortunes = [
    '诸事顺遂，心想事成',
    '贵人相助，福运临门',
    '应守静待，勿急进取',
    '事有波折，终有所成',
    '机遇将至，把握当下',
    '宜修身养性，待时而动',
    '吉星高照，百事可为',
    '逢凶化吉，转危为安',
    '静心修行，福缘自来'
  ];
  
  // 根据姓名和当前月份选择签运
  if (!userName.value) return '尚未知晓';
  
  const nameHash = [...userName.value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const currentMonth = new Date().getMonth();
  const index = (nameHash + currentMonth) % fortunes.length;
  
  return fortunes[index];
});

// 保存个人资料
const saveProfile = () => {
  const profileData = {
    name: userName.value,
    birthdate: birthdate.value,
    luckyNumber: luckyNumber.value
  };
  
  localStorage.setItem('userProfile', JSON.stringify(profileData));
  
  // 显示保存确认
  showSaveConfirmation.value = true;
  setTimeout(() => {
    showSaveConfirmation.value = false;
  }, 2000);
};

// 清除个人资料
const clearProfile = () => {
  userName.value = '';
  birthdate.value = '';
  generateLuckyNumber();
  localStorage.removeItem('userProfile');
};

// 加载个人资料
const loadProfile = () => {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    const profileData = JSON.parse(savedProfile);
    userName.value = profileData.name || '';
    birthdate.value = profileData.birthdate || '';
    luckyNumber.value = profileData.luckyNumber || 0;
    
    // 更新日期选择器
    if (birthdate.value) {
      updateDateSelectors();
    }
  } else {
    generateLuckyNumber();
  }
};

// 组件挂载时加载个人资料
onMounted(() => {
  loadProfile();
});

// 导出 toggleProfile 方法，使其可以在父组件中调用
defineExpose({
  toggleProfile
});

// 根据星座获取对应的Unicode符号
const getZodiacIcon = (zodiacSign: string) => {
  const zodiacIcons = {
    '白羊座': '♈',
    '金牛座': '♉',
    '双子座': '♊',
    '巨蟹座': '♋',
    '狮子座': '♌',
    '处女座': '♍',
    '天秤座': '♎',
    '天蝎座': '♏',
    '射手座': '♐',
    '摩羯座': '♑',
    '水瓶座': '♒',
    '双鱼座': '♓'
  };
  
  return zodiacIcons[zodiacSign] || '❖';
};
</script>

<style scoped>
.profile-container {
  position: fixed;
  top: 80px;
  right: -330px;
  width: 320px;
  transition: right 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 100;
  font-family: 'STFangsong', 'FangSong', 'KaiTi', serif;
}

.profile-open {
  right: 0;
}

.profile-scroll {
  position: relative;
  background: radial-gradient(ellipse at center, #FFF8E7, #F2E8CB);
  background-size: 100% auto;
  border-radius: 16px 0 0 16px;
  box-shadow: -3px 5px 15px rgba(0, 0, 0, 0.3);
  padding: 30px 25px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 4px double #D4A355;
  border-top: 1px solid #D4A355;
  border-bottom: 1px solid #D4A355;
}

/* 添加卷轴纹理 */
.profile-scroll::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to right,
    rgba(139, 69, 19, 0.03) 0px,
    rgba(139, 69, 19, 0.03) 1px,
    transparent 1px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 0;
}

.profile-scroll::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to top, rgba(139, 69, 19, 0.1), transparent);
  pointer-events: none;
}

.scroll-ends {
  position: absolute;
  width: 20px;
  height: 40px;
  background-color: #8B4513;
  border-radius: 10px;
}

.left-end {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
}

.right-end {
  display: none;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.profile-seal {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #E74C3C, #C0392B);
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFF8E7;
  font-size: 1rem;
  transform: rotate(15deg);
  z-index: 1;
}

.profile-seal::before {
  content: "缘";
  font-family: 'STKaiti', 'KaiTi', 'KaiTi_GB2312', serif;
  font-weight: bold;
}

.profile-seal::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 1px solid #FFF8E7;
  border-radius: 50%;
  opacity: 0.8;
}

.profile-content {
  position: relative;
  z-index: 2;
}

.profile-title {
  color: #8B4513;
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
  font-weight: normal;
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  position: relative;
}

.profile-title::before,
.profile-title::after {
  content: "❖";
  position: absolute;
  color: #D4A355;
  font-size: 0.8em;
  top: 50%;
  transform: translateY(-50%);
}

.profile-title::before {
  left: 30px;
}

.profile-title::after {
  right: 30px;
}

.profile-form {
  margin-bottom: 30px;
  position: relative;
}

.profile-form::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(to right, transparent, #D4A355, transparent);
}

.form-group {
  margin-bottom: 18px;
  position: relative;
}

.form-group::after {
  content: "";
  display: block;
  clear: both;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #8B4513;
  font-size: 1.1em;
  position: relative;
  padding-left: 15px;
}

.form-group label::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #D4A355;
}

input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #D4A355;
  background-color: rgba(255, 248, 231, 0.7);
  border-radius: 5px;
  font-size: 1em;
  color: #5D4037;
  font-family: 'STFangsong', 'FangSong', serif;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

input[type="text"]:focus,
input[type="date"]:focus {
  outline: none;
  border-color: #C0392B;
  box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.2);
  transform: translateY(-2px);
}

.zodiac-group, .luck-group {
  position: relative;
}

.zodiac-display, .monthly-fortune {
  padding: 12px 15px;
  background-color: rgba(255, 248, 231, 0.7);
  border: 1px solid #D4A355;
  border-radius: 5px;
  text-align: center;
  color: #5D4037;
  font-size: 1.1em;
  position: relative;
  overflow: hidden;
  min-height: 24px;
}

.zodiac-display::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, #C0392B, #E74C3C, #C0392B);
  opacity: 0.8;
}

.lucky-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lucky-number {
  flex-grow: 1;
  padding: 12px 15px;
  background-color: rgba(255, 248, 231, 0.7);
  border: 1px solid #D4A355;
  border-radius: 5px;
  text-align: center;
  color: #C0392B;
  font-size: 1.5em;
  font-weight: bold;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease;
}

.lucky-number:hover {
  transform: scale(1.05);
}

.refresh-button {
  background-color: #8B4513;
  color: #FFF8E7;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'STFangsong', 'FangSong', serif;
  padding: 8px 12px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.refresh-button:hover {
  background-color: #A0522D;
  transform: translateY(-2px);
}

.refresh-button:active {
  transform: translateY(1px);
}

.profile-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.save-button,
.clear-button {
  padding: 10px 0;
  width: 45%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'STFangsong', 'FangSong', serif;
  font-size: 1em;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.save-button {
  background-color: #27AE60;
  color: white;
}

.clear-button {
  background-color: #C0392B;
  color: white;
}

.save-button span,
.clear-button span,
.refresh-button span {
  position: relative;
  z-index: 2;
}

.save-button::before,
.clear-button::before,
.refresh-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.save-button:hover::before,
.clear-button:hover::before,
.refresh-button:hover::before {
  opacity: 1;
}

.save-button:hover,
.clear-button:hover {
  transform: translateY(-3px);
}

.save-button:active,
.clear-button:active {
  transform: translateY(1px);
}

.save-confirmation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 248, 231, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInOut 2s ease-in-out;
  z-index: 10;
}

.confirmation-inner {
  background-color: #C0392B;
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.2em;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.confirmation-inner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, white, transparent);
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

/* 滚动轴样式 */
.scroll-handle {
  position: absolute;
  height: 16px;
  left: 15px;
  right: 0;
  background: linear-gradient(to right, #8B4513, #A0522D);
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 3;
}

.top-handle {
  top: 75px;
}

.bottom-handle {
  bottom: 75px;
}

/* 滚动轴纹理 */
.scroll-handle::before {
  content: "";
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 10px;
  right: 10px;
  background: repeating-linear-gradient(
    to right,
    rgba(255, 248, 231, 0.2) 0px,
    rgba(255, 248, 231, 0.2) 2px,
    transparent 2px,
    transparent 10px
  );
  border-radius: 4px;
}

.zodiac-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  font-size: 1.8em;
  opacity: 0.7;
  color: #C0392B;
}

.zodiac-icon::before {
  content: attr(data-icon);
}

/* 本月签运鼠标悬停效果 */
.monthly-fortune {
  position: relative;
  transition: all 0.3s ease;
}

.monthly-fortune:hover {
  background-color: rgba(255, 248, 231, 0.9);
  box-shadow: 0 0 10px rgba(212, 163, 85, 0.3);
}

/* 日期选择器样式 */
.date-select-container {
  display: flex;
  width: 100%;
  gap: 8px;
}

.date-select {
  padding: 10px 15px;
  border: 1px solid #D4A355;
  background-color: rgba(255, 248, 231, 0.7);
  border-radius: 5px;
  font-size: 1em;
  color: #5D4037;
  font-family: 'STFangsong', 'FangSong', serif;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%238B4513' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-select:focus {
  outline: none;
  border-color: #C0392B;
  box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.2);
  transform: translateY(-2px);
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
</style> 