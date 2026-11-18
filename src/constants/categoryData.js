/**
 * 签文分类定义
 * 包含所有支持的签文类别及其相关配置
 */
export const categoryData = [
  { id: 'love', name: '爱情缘分', icon: 'heart', color: '#e74c3c' },
  { id: 'past_life', name: '前世姻缘', icon: 'moon', color: '#8e44ad' },
  { id: 'couple', name: '姻缘配对', icon: 'rings', color: '#ff5e94' },
  { id: 'zodiac', name: '星座配对', icon: 'star', color: '#1abc9c' },
  { id: 'destiny_ball', name: '结缘御守', icon: 'omamori', color: '#9b59b6' },
  { id: 'name', name: '姓名解析', icon: 'brush', color: '#3f51b5' },
  { id: 'career', name: '事业运势', icon: 'briefcase', color: '#3498db' },
  { id: 'study', name: '学业考试', icon: 'book', color: '#2ecc71' },
  { id: 'general', name: '日常运势', icon: 'leaf', color: '#f39c12' },
  { id: 'daily', name: '每日一签', icon: 'sun', color: '#2ecc71' },
  { id: 'relationship', name: '人际关系', icon: 'user', color: '#3498db' },
  { id: 'health', name: '健康平安', icon: 'leaf', color: '#f39c12' }
];

/**
 * 根据ID获取分类信息
 * @param {string} id - 分类ID
 * @returns {Object|null} 分类对象或null
 */
export const getCategoryById = (id) => {
  return categoryData.find(category => category.id === id) || null;
};

/**
 * 获取分类名称
 * @param {string} id - 分类ID
 * @returns {string} 分类名称
 */
export const getCategoryName = (id) => {
  const category = getCategoryById(id);
  return category ? category.name : '未知分类';
}; 