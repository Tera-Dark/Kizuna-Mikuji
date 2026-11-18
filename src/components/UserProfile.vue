<template>
  <div class="profile-container" :class="{ 'profile-open': isOpen }">
    <div class="scroll-handle top-handle">
      <div class="handle-deco"></div>
    </div>
    <div class="profile-scroll-wrapper">
      <div class="profile-scroll">
        <div class="profile-seal">
          <span class="seal-text">缘</span>
        </div>
        <div class="profile-content">
          <h3 class="profile-title">
            <span class="title-icon left-icon">—</span>
            {{ voice.profile.title }}
            <span class="title-icon right-icon">—</span>
          </h3>
          <p class="profile-intro">{{ voice.profile.intro }}</p>
          
          <div class="profile-form">
            <div class="form-group">
              <label for="userName" class="form-label">
                <AppIcon name="brush" :size="14" class="label-icon" />{{ voice.profile.labels.name }}
              </label>
              <input type="text" id="userName" v-model="userName" placeholder="在本神明面前，报上名来" class="themed-input">
            </div>
            
            <div class="form-group">
              <label for="birthdate" class="form-label">
                <AppIcon name="calendar" :size="14" class="label-icon" />{{ voice.profile.labels.birthday }}
              </label>
              <div class="date-select-container themed-date-select-container">
                <div class="select-wrapper">
                  <select 
                    v-model="birthYear" 
                    class="date-select year-select themed-select"
                    @change="updateBirthdate"
                  >
                    <option value="" disabled selected>年</option>
                    <option v-for="year in yearOptions" :key="`year-${year}`" :value="year">{{ year }}</option>
                  </select>
                </div>
                <div class="select-wrapper">
                  <select 
                    v-model="birthMonth" 
                    class="date-select month-select themed-select"
                    @change="updateBirthdate"
                  >
                    <option value="" disabled selected>月</option>
                    <option v-for="month in monthOptions" :key="`month-${month}`" :value="month">{{ month }}</option>
                  </select>
                </div>
                <div class="select-wrapper">
                  <select 
                    v-model="birthDay" 
                    class="date-select day-select themed-select"
                    @change="updateBirthdate"
                  >
                    <option value="" disabled selected>日</option>
                    <option 
                      v-for="day in getDayOptions(birthYear, birthMonth)" 
                      :key="`day-${day}`" 
                      :value="day"
                    >{{ day }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="form-group zodiac-group info-display-group">
              <label class="form-label">
                <AppIcon name="sparkles" :size="14" class="label-icon" />{{ voice.profile.labels.zodiac }}
              </label>
              <div class="info-display-box zodiac-display">
                <span class="zodiac-text">{{ zodiacSign }}</span>
                <div class="zodiac-icon-display" v-if="zodiacSign !== '未知'" :data-icon="getZodiacElement(zodiacSign)"></div>
              </div>
            </div>
            
            <div class="form-group luck-group info-display-group">
              <label class="form-label">
                 <AppIcon name="heart" :size="14" class="label-icon" />{{ voice.profile.labels.lucky }}
              </label>
              <div class="info-display-box lucky-display">
                <div class="lucky-number">{{ luckyNumber }}</div>
                <button class="themed-button refresh-button" @click="generateLuckyNumber">
                  <AppIcon name="refresh" :size="13" class="btn-icon" />更新
                </button>
              </div>
            </div>
            
            <div class="form-group info-display-group">
              <label class="form-label">
                <AppIcon name="omamori" :size="14" class="label-icon" />{{ voice.profile.labels.monthly }}
              </label>
              <div class="info-display-box monthly-fortune">
                {{ monthlyFortune }}
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button class="themed-button save-button" @click="saveProfile">
              <AppIcon name="check" :size="14" class="btn-icon" />{{ voice.profile.save }}
            </button>
            <button class="themed-button clear-button" @click="clearProfile">
              <AppIcon name="broom" :size="14" class="btn-icon" />{{ voice.profile.reset }}
            </button>
          </div>
          
          <div v-if="showSaveConfirmation" class="save-confirmation themed-confirmation">
            <div class="confirmation-icon"><AppIcon name="heart" :size="26" /></div>
            <div class="confirmation-inner">{{ confirmationText }}</div>
          </div>
        </div>
        <div class="scroll-ends left-end"></div>
        <div class="scroll-ends right-end"></div>
      </div>
    </div>
    <div class="scroll-handle bottom-handle">
      <div class="handle-deco"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { voice } from '../constants/enmusubi';
import AppIcon from './icons/AppIcon.vue';

// 状态
const isOpen = ref(false);
const userName = ref('');
const birthdate = ref('');
const luckyNumber = ref(0);
const showSaveConfirmation = ref(false);
const confirmationText = ref(voice.profile.saved);

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
    birthMonth.value = parseInt(month, 10).toString();
    birthDay.value = parseInt(day, 10).toString();
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
  
  const nameHash = userName.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
  confirmationText.value = voice.profile.saved;
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

  confirmationText.value = voice.profile.cleared;
  showSaveConfirmation.value = true;
  setTimeout(() => {
    showSaveConfirmation.value = false;
  }, 2000);
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
const getZodiacElement = (zodiacSign: string) => {
  const zodiacElements = {
    '白羊座': '火', '狮子座': '火', '射手座': '火',
    '金牛座': '土', '处女座': '土', '摩羯座': '土',
    '双子座': '风', '天秤座': '风', '水瓶座': '风',
    '巨蟹座': '水', '天蝎座': '水', '双鱼座': '水'
  };

  return zodiacElements[zodiacSign] || '星';
};
</script>

<style scoped>
/* 缘结神主题优化 - UserProfile.vue */
:root {
  --primary-color: var(--c-shu); /* 朱 */
  --secondary-color: var(--c-sakura); /* 淡粉红 */
  --accent-color: var(--c-gold); /* 金色 */
  --text-color: #5C3317; /* 深棕色，似木纹 */
  --text-light: #D38B6D; /* 浅棕色，用于辅助文字 */
  --bg-color: var(--c-paper); /* 米白，似宣纸 */
  --border-color: var(--c-line-strong);
  --highlight-bg: #FFE4E1; /* 选中或高亮背景 */
}

.profile-container {
  position: fixed;
  bottom: -100%; /* 从底部滑出 */
  left: 50%;
  transform: translateX(-50%);
  width: clamp(320px, 90vw, 500px); /* 响应式宽度 */
  max-height: 85vh;
  background-color: var(--c-paper);
  background-image: radial-gradient(100% 80% at 50% 0%, rgba(255, 255, 255, 0.8), transparent 70%);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -10px 40px rgba(48, 26, 20, 0.22);
  transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* 回弹动画 */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--c-line-strong);
  border-bottom: none;
}

.profile-container.profile-open {
  bottom: 0;
}

.scroll-handle {
  background-color: #C9A67F;
  height: 18px;
  width: calc(100% - 40px);
  margin: 0 auto;
  position: relative;
  border-radius: 3px 3px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.35), inset 0 -1px 2px rgba(80, 50, 30, 0.18);
}
.scroll-handle.bottom-handle {
  border-radius: 0 0 3px 3px;
  height: 14px;
}
.handle-deco {
  width: 60%;
  height: 5px;
  background-color: rgba(255,255,255,0.5);
  border-radius: 5px;
}

.profile-scroll-wrapper {
  overflow: hidden; /* 隐藏 scroll-ends 超出部分 */
  flex-grow: 1;
  position: relative;
  padding: 0 10px; /* 给卷轴内容区左右一点padding */
}

.profile-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 20px 25px; /* 内容区域内边距 */
  background-color: var(--bg-color); /* 卷轴主体背景 */
  position: relative;
  border-left: 12px solid #C9A67F;
  border-right: 12px solid #C9A67F;
  box-sizing: border-box;
}

/* 模拟卷轴两端的视觉效果 */
.scroll-ends {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  background-color: #B08E6E;
  box-shadow: inset 0 0 4px rgba(70, 40, 20, 0.25);
}
.scroll-ends.left-end { left: -12px; border-right: 1px solid #9C7A5B; }
.scroll-ends.right-end { right: -12px; border-left: 1px solid #9C7A5B; }

.profile-seal {
  position: absolute;
  top: -18px;
  right: 18px;
  width: 42px;
  height: 42px;
  background-color: var(--c-shu);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(143, 39, 28, 0.28);
  border: 1px solid var(--c-shu-deep);
  z-index: 10;
  overflow: hidden;
}

.seal-text {
  color: #FFF6F0;
  font-family: var(--font-display);
  font-size: 1.3em;
  font-weight: 600;
  line-height: 1; /* 确保文字垂直居中 */
  text-align: center;
}

/* .seal-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
} */ /* 移除图片样式 */

.profile-content {
  padding: 10px; /* 增加一些内边距 */
  position: relative;
  z-index: 1;
}

.profile-title {
  font-family: var(--font-display);
  color: var(--c-ink);
  text-align: center;
  font-size: 1.45em;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--c-line-strong);
  position: relative;
  font-weight: 600;
  letter-spacing: 0.18em;
}

.profile-intro {
  margin: 0 0 22px;
  text-align: center;
  font-size: 0.85em;
  line-height: 1.7;
  color: var(--c-ink-faint);
  letter-spacing: 0.04em;
}
.title-icon {
  color: var(--secondary-color);
  font-size: 0.7em;
  margin: 0 10px;
  vertical-align: middle;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 表单项之间的间距 */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 标签和输入控件之间的间距 */
}

.form-label {
  font-size: 1.1em;
  color: var(--text-color);
  font-weight: 600;
  font-family: var(--font-body);
  display: flex;
  align-items: center;
}
.label-icon {
  margin-right: 8px;
  color: var(--primary-color);
  font-size: 1.2em;
}

.themed-input, .themed-select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  background-color: #FFFCF6;
  color: var(--c-ink);
  font-size: 0.95em;
  font-family: var(--font-body);
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none; /* 移除默认样式，特别是select */
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box; /* 确保 padding 和 border 不会增加元素总宽度 */
}

.themed-input::placeholder {
  color: var(--c-ink-faint);
}

.themed-input:focus, .themed-select:focus {
  border-color: var(--c-shu);
  box-shadow: 0 0 0 3px var(--c-shu-wash);
  outline: none;
}

.date-select-container {
  display: flex;
  gap: 10px;
}
.select-wrapper {
  flex: 1;
  position: relative; /* 为自定义箭头定位 */
}
.select-wrapper::after { /* 自定义下拉箭头 */
  content: '';
  width: 7px;
  height: 7px;
  border-right: 1.5px solid var(--c-ink-faint);
  border-bottom: 1px solid var(--c-ink-faint);
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}
.themed-select {
  padding-right: 35px; /* 为自定义箭头留出空间 */
}

/* 信息展示区域统一样式 */
.info-display-group {
  margin-top: 5px;
}
.info-display-box {
  background-color: rgba(255, 254, 250, 0.6);
  border: 1px dashed var(--c-line-strong);
  border-radius: 2px;
  padding: 12px 15px;
  color: var(--text-color);
  font-size: 1em;
  min-height: 48px; /* 与输入框高度接近 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.5;
}
.info-display-box.zodiac-display .zodiac-text {
  font-weight: bold;
  color: var(--primary-color);
}
.zodiac-icon-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--c-line-strong);
  border-radius: 50%;
  color: var(--primary-color);
  font-family: var(--font-display);
  font-size: 0.78em;
}
.zodiac-icon-display::before {
  content: attr(data-icon);
}

.lucky-display .lucky-number {
  font-size: 1.6em;
  font-weight: 600;
  color: var(--c-shu);
  font-family: var(--font-display);
  font-variant-numeric: tabular-nums;
}

.monthly-fortune {
  font-style: italic;
  color: var(--text-light);
}
.monthly-fortune:empty::before {
  content: "缘分未卜……";
  color: var(--c-ink-faint);
}


/* 按钮通用样式 */
.themed-button {
  padding: 10px 20px;
  border-radius: 3px;
  border: none;
  font-size: 1em;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
  min-width: 120px;
}
.themed-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
.themed-button:active {
  transform: translateY(0px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.btn-icon {
  font-size: 1.2em;
}

.refresh-button {
  background-color: transparent;
  color: var(--c-shu);
  border: 1px solid var(--c-line-strong);
  padding: 7px 14px;
  font-size: 0.85em;
  min-width: auto;
}
.refresh-button:hover {
  background-color: var(--c-shu-wash);
}

.profile-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.save-button {
  background-color: var(--c-shu);
  color: #FFF8F0;
}
.save-button:hover {
  background-color: var(--c-shu-deep);
}

.clear-button {
  background-color: transparent;
  color: var(--c-ink-faint);
  border: 1px solid var(--c-line-strong);
}
.clear-button:hover {
  background-color: var(--c-shu-wash);
  color: var(--c-shu);
}

/* 保存成功提示 */
.themed-confirmation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--c-paper);
  color: var(--c-ink);
  padding: 13px 22px;
  border-radius: 3px;
  border: 1px solid var(--c-line-strong);
  box-shadow: var(--shadow-paper-sm);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1001; /* 比profile-container高一级 */
  font-family: var(--font-body);
  font-size: 1em;
  opacity: 0;
  animation: fadeInOutConfirmation 2.5s ease-in-out forwards;
}
.confirmation-icon {
  font-size: 1.5em;
}
.confirmation-inner {
  font-weight: bold;
}

@keyframes fadeInOutConfirmation {
  0%, 100% { opacity: 0; transform: translate(-50%, 20px); }
  10%, 90% { opacity: 1; transform: translate(-50%, 0); }
}


/* 滚动条样式 (Webkit) */
.profile-scroll::-webkit-scrollbar {
  width: 8px;
}
.profile-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.profile-scroll::-webkit-scrollbar-thumb {
  background-color: var(--c-shu-soft);
  border-radius: 2px;
}
.profile-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--c-shu);
}



</style> 