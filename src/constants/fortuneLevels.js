/**
 * 签文等级定义
 * 不同等级的签文及其解锁条件
 */
export const fortuneLevels = {
  1: { name: '初级签文', description: '入门缘分测试', requiredDraws: 0 },
  2: { name: '中级签文', description: '更深层次的缘分指引', requiredDraws: 10 },
  3: { name: '高级签文', description: '揭示隐藏的缘分密码', requiredDraws: 30 },
  4: { name: '神级签文', description: '最精准的缘分天机', requiredDraws: 50 }
};

/**
 * 获取用户当前解锁的最高签文等级
 * @param {number} drawCount - 用户抽签次数
 * @returns {number} 解锁的最高等级
 */
export const getUserLevel = (drawCount) => {
  let level = 1;
  for (let i = 4; i > 0; i--) {
    if (drawCount >= fortuneLevels[i].requiredDraws) {
      level = i;
      break;
    }
  }
  return level;
};

/**
 * 检查用户是否解锁了指定签文等级
 * @param {number} drawCount - 用户抽签次数
 * @param {number} level - 要检查的等级
 * @returns {boolean} 是否已解锁
 */
export const hasUnlockedLevel = (drawCount, level) => {
  return drawCount >= fortuneLevels[level].requiredDraws;
};

/**
 * 获取下一等级所需的抽签次数
 * @param {number} drawCount - 当前抽签次数
 * @returns {Object} 包含下一等级信息和所需次数
 */
export const getNextLevelInfo = (drawCount) => {
  const currentLevel = getUserLevel(drawCount);
  
  // 已经是最高级别
  if (currentLevel >= 4) {
    return { level: 4, required: fortuneLevels[4].requiredDraws, remaining: 0, isMax: true };
  }
  
  const nextLevel = currentLevel + 1;
  const required = fortuneLevels[nextLevel].requiredDraws;
  const remaining = required - drawCount;
  
  return {
    level: nextLevel,
    required,
    remaining,
    isMax: false
  };
}; 