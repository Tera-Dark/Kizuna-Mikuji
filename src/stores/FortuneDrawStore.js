/**
 * @deprecated 此文件已弃用，功能已合并到 FortuneStore.js 中。
 * 考虑在将来的版本中移除此文件，并使用 FortuneStore.js 中的功能。
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { getTypeColor } from '../constants/typeColorMapping';
import { useUserStore } from './UserStore';
import { useHistoryStore } from './HistoryStore';
import { playSound } from '../utils/audioUtils';

// 签文数据导入
import { getLoveFortuneData } from '../data/loveFortuneData';
import { getPastLifeFortuneData } from '../data/pastLifeFortuneData';
import { getCareerFortuneData } from '../data/careerFortuneData';

/**
 * 签文抽取状态管理Store
 */
export const useFortuneDrawStore = defineStore('fortuneDraw', () => {
  // 状态
  const currentCategory = ref(getFromStorage('currentCategory', 'love'));
  const selectedFortune = ref(null);
  const isDrawing = ref(false);
  
  // Store引用
  const userStore = useUserStore();
  const historyStore = useHistoryStore();
  
  // 计算属性：签文类型对应的颜色
  const fortuneTypeColor = computed(() => {
    if (!selectedFortune.value) return '';
    return getTypeColor(selectedFortune.value.type);
  });
  
  /**
   * 设置当前签文类别
   * @param {string} categoryId - 类别ID
   */
  function setCategory(categoryId) {
    currentCategory.value = categoryId;
    saveToStorage('currentCategory', categoryId);
  }
  
  /**
   * 获取对应类别的签文数据
   * @param {string} categoryId - 类别ID
   * @returns {Array} 签文数据数组
   */
  function getFortuneData(categoryId) {
    const category = categoryId || currentCategory.value;
    
    switch (category) {
      case 'love':
        return getLoveFortuneData();
      case 'past_life':
        return getPastLifeFortuneData();
      case 'career':
        return getCareerFortuneData();
      default:
        return getLoveFortuneData(); // 默认返回爱情缘分签文
    }
  }
  
  /**
   * 抽取签文
   * @param {string} categoryId - 类别ID，可选
   */
  function drawFortune(categoryId = null) {
    if (isDrawing.value) return;
    isDrawing.value = true;
    
    if (categoryId) {
      setCategory(categoryId);
    }
    
    // 获取该类别的所有签文
    const fortuneData = getFortuneData(currentCategory.value);
    
    // 随机选择一条签文
    const randomIndex = Math.floor(Math.random() * fortuneData.length);
    selectedFortune.value = fortuneData[randomIndex];
    
    // 增加用户抽签次数并记录到历史
    userStore.incrementFortuneCount();
    
    // 使用audioUtils播放音效
    playSound('sounds/reveal.mp3', 0.4, (err) => {
      console.warn('音效播放失败:', err);
    }).catch(error => {
      console.error('音效创建失败:', error);
    });
    
    // 保存到历史
    setTimeout(() => {
      historyStore.addToHistory({
        ...selectedFortune.value,
        category: currentCategory.value,
        date: new Date().toISOString()
      });
      isDrawing.value = false;
    }, 1000);
    
    return selectedFortune.value;
  }
  
  /**
   * 重置当前签文
   */
  function resetFortune() {
    selectedFortune.value = null;
  }
  
  return {
    currentCategory,
    selectedFortune,
    isDrawing,
    fortuneTypeColor,
    setCategory,
    drawFortune,
    resetFortune,
    getFortuneData
  };
}); 