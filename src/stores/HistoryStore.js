import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

/**
 * 签文历史记录状态管理Store
 */
export const useHistoryStore = defineStore('history', () => {
  // 签文历史记录
  const historyList = ref(getFromStorage('fortuneHistory', []));
  const isHistoryVisible = ref(false);
  
  // 计算属性
  const historyCount = computed(() => historyList.value.length);
  
  // 按日期排序的历史记录
  const sortedHistory = computed(() => {
    return [...historyList.value].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });
  
  // 按分类筛选的历史记录
  const getHistoryByCategory = (category) => {
    return historyList.value.filter(item => item.category === category);
  };
  
  /**
   * 添加签文到历史记录
   * @param {Object} fortune - 签文数据对象
   */
  function addToHistory(fortune) {
    if (!fortune) return;
    
    // 添加日期和唯一ID
    const historyItem = {
      ...fortune,
      id: Date.now().toString(),
      date: fortune.date || new Date().toISOString()
    };
    
    historyList.value.push(historyItem);
    
    // 如果历史记录太多，则保留最近的50条
    if (historyList.value.length > 50) {
      historyList.value = historyList.value.slice(-50);
    }
    
    // 保存到本地存储
    saveToStorage('fortuneHistory', historyList.value);
  }
  
  /**
   * 从历史记录中删除指定签文
   * @param {string} id - 要删除的签文ID
   */
  function removeFromHistory(id) {
    historyList.value = historyList.value.filter(item => item.id !== id);
    saveToStorage('fortuneHistory', historyList.value);
  }
  
  /**
   * 清空历史记录
   */
  function clearHistory() {
    historyList.value = [];
    saveToStorage('fortuneHistory', []);
  }
  
  /**
   * 显示历史记录面板
   */
  function showHistory() {
    isHistoryVisible.value = true;
  }
  
  /**
   * 隐藏历史记录面板
   */
  function hideHistory() {
    isHistoryVisible.value = false;
  }
  
  /**
   * 切换历史记录面板显示状态
   */
  function toggleHistory() {
    isHistoryVisible.value = !isHistoryVisible.value;
  }
  
  return {
    historyList,
    isHistoryVisible,
    historyCount,
    sortedHistory,
    getHistoryByCategory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    showHistory,
    hideHistory,
    toggleHistory
  };
}); 