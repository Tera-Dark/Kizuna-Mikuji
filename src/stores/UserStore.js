import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { getUserLevel } from '../constants/fortuneLevels';

/**
 * 用户状态管理Store
 */
export const useUserStore = defineStore('user', () => {
  // 用户状态
  const username = ref(getFromStorage('username', ''));
  const fortuneCount = ref(getFromStorage('fortuneCount', 0));
  const visitCount = ref(getFromStorage('visitCount', 0));
  const lastVisit = ref(getFromStorage('lastVisit', ''));
  const preferences = ref(getFromStorage('preferences', {
    theme: 'light',
    soundEnabled: true,
    showHistory: true
  }));
  
  // 用户等级相关计算属性
  const userLevel = computed(() => getUserLevel(fortuneCount.value));
  
  /**
   * 更新用户名
   * @param {string} name - 新的用户名
   */
  function setUsername(name) {
    username.value = name;
    saveToStorage('username', name);
  }
  
  /**
   * 增加抽签次数
   */
  function incrementFortuneCount() {
    fortuneCount.value++;
    saveToStorage('fortuneCount', fortuneCount.value);
  }
  
  /**
   * 记录用户访问
   */
  function recordVisit() {
    visitCount.value++;
    lastVisit.value = new Date().toISOString();
    saveToStorage('visitCount', visitCount.value);
    saveToStorage('lastVisit', lastVisit.value);
  }
  
  /**
   * 更新用户偏好设置
   * @param {Object} newPreferences - 新的偏好设置
   */
  function updatePreferences(newPreferences) {
    preferences.value = { ...preferences.value, ...newPreferences };
    saveToStorage('preferences', preferences.value);
  }
  
  /**
   * 重置用户数据
   */
  function resetUserData() {
    username.value = '';
    fortuneCount.value = 0;
    saveToStorage('username', '');
    saveToStorage('fortuneCount', 0);
  }
  
  return {
    username,
    fortuneCount,
    visitCount,
    lastVisit,
    preferences,
    userLevel,
    setUsername,
    incrementFortuneCount,
    recordVisit,
    updatePreferences,
    resetUserData
  };
}); 