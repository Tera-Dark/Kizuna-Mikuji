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
            <span class="title-icon left-icon">❀</span>
            缘主信息
            <span class="title-icon right-icon">❀</span>
          </h3>
          
          <div class="profile-form">
            <div class="form-group">
              <label for="userName" class="form-label">
                <span class="label-icon">📜</span>法名
              </label>
              <input type="text" id="userName" v-model="userName" placeholder="请输入您的姓名" class="themed-input">
            </div>
            
            <div class="form-group">
              <label for="birthdate" class="form-label">
                <span class="label-icon">📅</span>降世之日
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
                <span class="label-icon">✨</span>星命
              </label>
              <div class="info-display-box zodiac-display">
                <span class="zodiac-text">{{ zodiacSign }}</span>
                <div class="zodiac-icon-display" v-if="zodiacSign !== '未知'" :data-icon="getZodiacIcon(zodiacSign)"></div>
              </div>
            </div>
            
            <div class="form-group luck-group info-display-group">
              <label class="form-label">
                 <span class="label-icon">💖</span>今日缘数
              </label>
              <div class="info-display-box lucky-display">
                <div class="lucky-number">{{ luckyNumber }}</div>
                <button class="themed-button refresh-button" @click="generateLuckyNumber">
                  <span class="btn-icon">🔄</span>更新
                </button>
              </div>
            </div>
            
            <div class="form-group info-display-group">
              <label class="form-label">
                <span class="label-icon">🧧</span>本月签运
              </label>
              <div class="info-display-box monthly-fortune">
                {{ monthlyFortune }}
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button class="themed-button save-button" @click="saveProfile">
              <span class="btn-icon">💾</span>保存
            </button>
            <button class="themed-button clear-button" @click="clearProfile">
              <span class="btn-icon">🧹</span>清除
            </button>
          </div>
          
          <div v-if="showSaveConfirmation" class="save-confirmation themed-confirmation">
            <div class="confirmation-icon">🌸</div>
            <div class="confirmation-inner">缘信已录，佳期可待</div>
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
/* 缘结神主题优化 - UserProfile.vue */
:root {
  --primary-color: #D9544D; /* 缘结红 */
  --secondary-color: #FFB6C1; /* 淡粉红 */
  --accent-color: #FFD700; /* 金色 */
  --text-color: #5C3317; /* 深棕色，似木纹 */
  --text-light: #D38B6D; /* 浅棕色，用于辅助文字 */
  --bg-color: #FFF5EE; /* 米白，似宣纸 */
  --border-color: rgba(217, 84, 77, 0.3); /* 缘结红边框 */
  --highlight-bg: #FFE4E1; /* 选中或高亮背景 */
}

.profile-container {
  position: fixed;
  bottom: -100%; /* 从底部滑出 */
  left: 50%;
  transform: translateX(-50%);
  width: clamp(320px, 90vw, 500px); /* 响应式宽度 */
  max-height: 85vh;
  background: linear-gradient(160deg, #fff0f5 0%, #ffe4e1 100%); /* 淡雅渐变背景 */
  border-radius: 30px 30px 0 0; /* 顶部圆角 */
  box-shadow: 0 -5px 25px rgba(217, 84, 77, 0.2);
  transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* 回弹动画 */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--primary-color);
  border-bottom: none;
}

.profile-container.profile-open {
  bottom: 0;
}

.scroll-handle {
  background-color: #E0A09A; /* 卷轴手柄颜色 */
  height: 25px;
  width: calc(100% - 40px); /* 留出边距 */
  margin: 0 auto;
  position: relative;
  border-radius: 10px 10px 0 0; /* 顶部手柄圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.scroll-handle.bottom-handle {
  border-radius: 0 0 10px 10px; /* 底部手柄圆角 */
  height: 20px;
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
  border-left: 15px solid #E0A09A; /* 卷轴左边厚度 */
  border-right: 15px solid #E0A09A; /* 卷轴右边厚度 */
  box-sizing: border-box;
}

/* 模拟卷轴两端的视觉效果 */
.scroll-ends {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15px; /* 卷轴轴心宽度 */
  background-color: #D38B6D; /* 卷轴轴心颜色 */
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
}
.scroll-ends.left-end { left: -15px; border-right: 1px solid #b07050; }
.scroll-ends.right-end { right: -15px; border-left: 1px solid #b07050; }

.profile-seal {
  position: absolute;
  top: -30px; /* 调整位置，使其一半在卷轴内，一半在外 */
  right: 20px; /* 调整右边距 */
  width: 55px; /* 调整大小 */
  height: 55px;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 5px; */ /* 移除内边距，让文字更好地居中 */
  box-shadow: 0 3px 8px rgba(0,0,0,0.25); /* 调整阴影使其更柔和 */
  border: 3px solid white; /* 加粗白色边框 */
  z-index: 10;
  overflow: hidden; /* 确保文字不出界 */
}

.seal-text {
  color: white;
  font-family: 'KaiTi', 'SimSun', serif; /* 使用楷体或宋体 */
  font-size: 1.8em; /* 调整文字大小 */
  font-weight: bold;
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
  font-family: 'KaiTi', 'SimSun', serif; /* 更雅致的字体 */
  color: var(--primary-color);
  text-align: center;
  font-size: 2em; /* 增大标题字号 */
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--accent-color); /* 金色下划线 */
  position: relative;
  font-weight: bold;
  letter-spacing: 2px;
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
  font-family: 'FangSong', 'SimSun', serif;
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
  padding: 12px 15px;
  border: 1.5px solid var(--border-color);
  border-radius: 12px; /* 更圆润的边角 */
  background-color: white;
  color: var(--text-color);
  font-size: 1em;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  transition: border-color 0.3s, box-shadow 0.3s;
  appearance: none; /* 移除默认样式，特别是select */
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box; /* 确保 padding 和 border 不会增加元素总宽度 */
}

.themed-input::placeholder {
  color: #aaa;
  font-style: italic;
}

.themed-input:focus, .themed-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 8px rgba(217, 84, 77, 0.3);
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
  content: '▼';
  font-size: 0.8em;
  color: var(--primary-color);
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* 防止遮挡select点击 */
}
.themed-select {
  padding-right: 35px; /* 为自定义箭头留出空间 */
}

/* 信息展示区域统一样式 */
.info-display-group {
  margin-top: 5px;
}
.info-display-box {
  background-color: #fffaf0; /* 淡雅的象牙白 */
  border: 1px dashed var(--secondary-color); /* 粉色虚线边框 */
  border-radius: 10px;
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
  font-size: 1.5em;
  color: var(--primary-color);
}
.zodiac-icon-display::before {
  content: attr(data-icon);
}

.lucky-display .lucky-number {
  font-size: 1.8em;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Georgia', serif;
  text-shadow: 1px 1px 0px var(--highlight-bg);
}

.monthly-fortune {
  font-style: italic;
  color: var(--text-light);
}
.monthly-fortune:empty::before {
  content: "缘分未卜...";
  color: #bbb;
}


/* 按钮通用样式 */
.themed-button {
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  font-size: 1.1em;
  font-weight: bold;
  font-family: 'KaiTi', 'SimSun', serif;
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
  background-color: var(--accent-color);
  color: var(--text-color);
  padding: 8px 15px;
  font-size: 0.9em;
  min-width: auto;
}
.refresh-button:hover {
  background-color: #FFC107; /* 金色加深 */
}

.profile-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.save-button {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 5px rgba(217, 84, 77, 0.3);
}
.save-button:hover {
  background-color: #c7433c; /* 主色加深 */
}

.clear-button {
  background-color: #f8f8f8;
  color: var(--text-light);
  border: 1px solid #ddd;
}
.clear-button:hover {
  background-color: #eee;
}

/* 保存成功提示 */
.themed-confirmation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 182, 193, 0.95); /* 淡粉红，更柔和 */
  color: var(--primary-color); /* 深红色文字 */
  padding: 15px 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(217, 84, 77, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1001; /* 比profile-container高一级 */
  font-family: 'KaiTi', 'SimSun', serif;
  font-size: 1.1em;
  border: 1px solid rgba(217, 84, 77, 0.3);
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
  background: #fff0f5; /* 淡粉色轨道 */
  border-radius: 10px;
}
.profile-scroll::-webkit-scrollbar-thumb {
  background-color: var(--secondary-color); /* 粉色滑块 */
  border-radius: 10px;
  border: 2px solid #fff0f5; /* 与轨道同色边框，产生内嵌感 */
}
.profile-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #ff9eb2; /* 悬停时颜色加深 */
}

/* 为了更好的Unicode符号显示 */
.label-icon, .btn-icon, .title-icon, .confirmation-icon, .zodiac-icon-display::before {
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;
}

</style> 