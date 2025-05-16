<template>
  <div class="history-container" :class="{ 'history-open': isOpen }">
    <div class="history-content">
      <h3 class="history-title">抽签历史</h3>
      
      <div v-if="fortuneHistory.length === 0" class="empty-history">
        <div class="empty-icon">📜</div>
        <p>暂无历史记录</p>
        <p class="empty-tip">每次求签后的结果都会记录在这里</p>
      </div>
      
      <div v-else class="history-list">
        <div v-for="(item, index) in fortuneHistory" :key="index" class="history-item"
             :class="{ 'expanded': expandedIndex === index }">
          <div class="history-item-header" @click="toggleExpand(index)">
            <span class="history-date">{{ formatDate(item.date) }}</span>
            <span class="history-type" :style="{ color: getTypeColor(item.fortune.type) }">
              {{ item.fortune.type }}
            </span>
            <span class="expand-icon">{{ expandedIndex === index ? '▲' : '▼' }}</span>
          </div>
          
          <div class="history-item-details" v-if="expandedIndex === index">
            <p class="history-poem" v-html="item.fortune.poem"></p>
            <div class="action-buttons">
              <button class="view-button" @click="viewFortune(item.fortune)">
                <span class="btn-icon">👁️</span>查看详情
              </button>
              <button class="delete-button" @click.stop="deleteHistoryItem(index)">
                <span class="btn-icon">🗑️</span>删除
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="history-actions" v-if="fortuneHistory.length > 0">
        <button class="clear-button" @click="clearHistory">
          <span class="btn-icon">🧹</span>清空历史
        </button>
      </div>
    </div>
    
    <div class="decoration-element top-left"></div>
    <div class="decoration-element top-right"></div>
    <div class="decoration-element bottom-left"></div>
    <div class="decoration-element bottom-right"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useFortuneStore } from '../stores/FortuneStore';

// 获取状态管理
const fortuneStore = useFortuneStore();

// 状态
const isOpen = ref(false);
const fortuneHistory = ref([]);
const expandedIndex = ref(-1);

// 切换历史记录面板显示/隐藏
const toggleHistory = () => {
  isOpen.value = !isOpen.value;
};

// 切换展开/折叠历史记录项
const toggleExpand = (index) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index;
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 获取签文类型颜色
const getTypeColor = (type) => {
  const typeColorMapping = {
    '上上大吉': '#ff4757',
    '大吉': '#e74c3c',
    '缘初现': '#ff6b81',
    '中吉': '#f39c12',
    '惜当下': '#2ecc71',
    '小吉': '#2ecc71',
    '吉': '#55efc4',
    '小确幸': '#fdcb6e',
    '待花开': '#00b894',
    '末吉': '#3498db',
    '化解结': '#74b9ff',
    '孤芳赏': '#a29bfe',
    '结善缘': '#6c5ce7',
    '迷雾散': '#ffeaa7',
    '修行时': '#81ecec',
    '再回首': '#fab1a0',
    '小凶': '#9b59b6',
    '莫强求': '#e17055',
    '清心咒': '#00cec9',
    '大凶警示': '#485460'
  };
  
  return typeColorMapping[type] || '#c0392b';
};

// 加载历史记录
const loadHistory = () => {
  const savedHistory = localStorage.getItem('fortuneHistory');
  if (savedHistory) {
    fortuneHistory.value = JSON.parse(savedHistory);
  }
};

// 保存历史记录
const saveHistory = () => {
  localStorage.setItem('fortuneHistory', JSON.stringify(fortuneHistory.value));
};

// 添加历史记录
const addToHistory = (fortune) => {
  fortuneHistory.value.unshift({
    date: new Date().toISOString(),
    fortune: fortune
  });
  
  // 限制历史记录最多保存20条
  if (fortuneHistory.value.length > 20) {
    fortuneHistory.value = fortuneHistory.value.slice(0, 20);
  }
  
  saveHistory();
};

// 查看签文详情
const viewFortune = (fortune) => {
  fortuneStore.selectedFortune = fortune;
  fortuneStore.isFortuneVisible = true;
  isOpen.value = false; // 关闭历史面板
};

// 删除历史记录项
const deleteHistoryItem = (index) => {
  fortuneHistory.value.splice(index, 1);
  expandedIndex.value = -1;
  saveHistory();
};

// 清空历史记录
const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    fortuneHistory.value = [];
    expandedIndex.value = -1;
    saveHistory();
  }
};

// 添加当前签文到历史记录 - 供父组件调用
const addCurrentFortuneToHistory = () => {
  if (fortuneStore.selectedFortune && fortuneStore.isFortuneVisible) {
    addToHistory(fortuneStore.selectedFortune);
  }
};

// 监听签文变化
const watchFortuneChanges = () => {
  // 不再需要在这里定义 addCurrentFortuneToHistory 函数
};

// 导出方法供父组件调用
defineExpose({
  toggleHistory,
  addCurrentFortuneToHistory
});

// 组件挂载时加载历史记录
onMounted(() => {
  loadHistory();
  watchFortuneChanges();
});
</script>

<style scoped>
.history-container {
  position: fixed;
  top: 80px;
  left: -350px;
  width: 330px;
  background-color: rgba(255, 245, 238, 0.97);
  border-radius: 0 15px 15px 0;
  box-shadow: 3px 0 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.2);
  transition: left 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 100;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgba(212, 175, 55, 0.4);
  border-top: 1px solid rgba(212, 175, 55, 0.4);
  border-bottom: 1px solid rgba(212, 175, 55, 0.4);
}

.history-open {
  left: 0;
  animation: slide-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes slide-in {
  0% { left: -350px; }
  100% { left: 0; }
}

.history-content {
  padding: 25px;
  overflow-y: auto;
  flex-grow: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 69, 19, 0.4) rgba(255, 248, 231, 0.5);
}

.history-content::-webkit-scrollbar {
  width: 6px;
}

.history-content::-webkit-scrollbar-track {
  background: rgba(255, 248, 231, 0.5);
}

.history-content::-webkit-scrollbar-thumb {
  background-color: rgba(139, 69, 19, 0.4);
  border-radius: 10px;
}

.history-title {
  color: #c0392b;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.4em;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 10px;
}

.history-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 2px;
  background: linear-gradient(to right, transparent, #c0392b, transparent);
}

.empty-history {
  text-align: center;
  padding: 40px 0;
  color: #95a5a6;
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 15px;
  opacity: 0.4;
}

.empty-tip {
  font-size: 0.9em;
  margin-top: 10px;
  font-style: italic;
  color: #a0a0a0;
}

.history-list {
  margin-bottom: 20px;
}

.history-item {
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform-origin: center;
  border: 1px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(255, 250, 245, 0.9);
  background-image: repeating-linear-gradient(
                     45deg,
                     rgba(139, 69, 19, 0.02) 0px,
                     rgba(139, 69, 19, 0.02) 1px,
                     transparent 1px,
                     transparent 10px
                   );
  background-size: cover;
  background-position: center;
}

.history-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.history-item.expanded {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(192, 57, 43, 0.2);
}

.history-item-header {
  padding: 12px 15px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  overflow: hidden;
}

.history-item-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent);
}

.history-item-header:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.history-date {
  font-size: 0.85em;
  color: #7f8c8d;
  flex-grow: 1;
  font-family: 'STFangsong', 'FangSong', serif;
}

.history-type {
  font-weight: bold;
  margin: 0 10px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  font-family: 'STKaiti', 'KaiTi', serif;
}

.expand-icon {
  font-size: 0.8em;
  color: #7f8c8d;
  transition: transform 0.3s ease;
}

.expanded .expand-icon {
  transform: rotate(180deg);
}

.history-item-details {
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  border-top: 1px dashed rgba(139, 69, 19, 0.2);
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.history-poem {
  margin-bottom: 15px;
  text-align: center;
  font-style: italic;
  color: #5a3d32;
  font-family: 'STKaiti', 'KaiTi', serif;
  line-height: 1.6;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.view-button,
.delete-button,
.clear-button {
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.view-button {
  background-color: #3498db;
  color: white;
  flex: 3;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  flex: 2;
}

.clear-button {
  background-color: rgba(149, 165, 166, 0.9);
  color: white;
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.view-button:hover,
.delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.clear-button:hover {
  background-color: rgba(149, 165, 166, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.view-button:active,
.delete-button:active,
.clear-button:active {
  transform: translateY(1px);
}

.btn-icon {
  font-size: 0.9em;
}

.history-actions {
  margin-top: 15px;
}

/* 装饰元素 */
.decoration-element {
  position: absolute;
  width: 40px;
  height: 40px;
  opacity: 0.15;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 0;
}

.top-left {
  top: 10px;
  left: 10px;
  background-color: rgba(212, 175, 55, 0.2);
  border-radius: 50%;
}

.top-right {
  top: 10px;
  right: 10px;
  background-color: rgba(212, 175, 55, 0.2);
  border-radius: 50%;
}

.bottom-left {
  bottom: 10px;
  left: 10px;
  background-color: rgba(212, 175, 55, 0.2);
  border-radius: 50%;
}

.bottom-right {
  bottom: 10px;
  right: 10px;
  background-color: rgba(212, 175, 55, 0.2);
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .history-container {
    top: 60px;
    width: 300px;
    left: -310px;
  }
  
  .history-content {
    padding: 20px 15px;
  }
  
  .history-title {
    font-size: 1.2em;
  }
}

@media (max-width: 480px) {
  .history-container {
    width: 280px;
    left: -290px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .view-button, .delete-button {
    width: 100%;
  }
  
  .decoration-element {
    width: 30px;
    height: 30px;
  }
}
</style> 