/**
 * 本地存储工具函数
 * 提供localStorage操作的封装和错误处理
 */

/**
 * 从localStorage获取数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 如果不存在时的默认值
 * @returns {*} 解析后的数据或默认值
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    return JSON.parse(value);
  } catch (error) {
    console.warn(`从localStorage获取${key}时出错:`, error);
    return defaultValue;
  }
};

/**
 * 保存数据到localStorage
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的数据
 * @returns {boolean} 是否保存成功
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`保存到localStorage时出错:`, error);
    return false;
  }
};

/**
 * 从localStorage移除数据
 * @param {string} key - 要移除的键名
 * @returns {boolean} 是否移除成功
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`从localStorage移除${key}时出错:`, error);
    return false;
  }
};

/**
 * 检查localStorage中是否存在指定键
 * @param {string} key - 要检查的键名
 * @returns {boolean} 是否存在
 */
export const hasInStorage = (key) => {
  return localStorage.getItem(key) !== null;
};

/**
 * 清空所有localStorage数据
 * @returns {boolean} 是否清空成功
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清空localStorage时出错:', error);
    return false;
  }
};

/**
 * 获取所有localStorage键值对
 * @returns {Object} 包含所有数据的对象
 */
export const getAllStorage = () => {
  const result = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      result[key] = getFromStorage(key);
    }
  } catch (error) {
    console.error('获取所有localStorage数据时出错:', error);
  }
  return result;
}; 