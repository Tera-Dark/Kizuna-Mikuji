import { ref, watch } from 'vue';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

/**
 * 本地存储的组合式函数
 * @param {string} key - 存储的键名
 * @param {*} defaultValue - 默认值
 * @param {boolean} watchForChanges - 是否监听变化自动同步（默认是）
 * @returns {Object} 包含响应式状态和操作方法
 */
export function useLocalStorage(key, defaultValue = null, watchForChanges = true) {
  // 从本地存储加载初始值或使用默认值
  const storedValue = ref(getFromStorage(key, defaultValue));
  
  /**
   * 保存当前值到本地存储
   */
  const saveValue = () => {
    saveToStorage(key, storedValue.value);
  };
  
  /**
   * 重置为默认值
   */
  const resetToDefault = () => {
    storedValue.value = defaultValue;
    saveValue();
  };
  
  /**
   * 从本地存储中移除该项
   */
  const removeItem = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`移除${key}时出错:`, error);
    }
  };
  
  // 自动监听变化并保存
  if (watchForChanges) {
    watch(storedValue, () => {
      saveValue();
    }, { deep: true });
  }
  
  return {
    value: storedValue,
    save: saveValue,
    reset: resetToDefault,
    remove: removeItem
  };
} 