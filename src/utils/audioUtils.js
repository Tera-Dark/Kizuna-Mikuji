/**
 * 音频工具函数
 * 提供音频加载、播放和错误处理的通用功能
 */

// 缓存已加载的音频
const audioCache = new Map();

/**
 * 获取基础URL前缀
 * @returns {string} 当前环境下的基础URL
 */
export const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' ? '/Kizuna-Mikuji/' : '/';
};

/**
 * 播放指定的音频文件
 * @param {string} soundPath - 音频文件路径（不含基础URL）
 * @param {number} volume - 音量（0.0到1.0），默认0.7
 * @param {Function} onError - 错误处理回调
 * @returns {Promise<HTMLAudioElement>} - 返回音频元素的Promise
 */
export const playSound = (soundPath, volume = 0.7, onError) => {
  return new Promise((resolve, reject) => {
    try {
      // 尝试从缓存获取音频
      let audio = audioCache.get(soundPath);
      
      if (!audio) {
        // 如果缓存中没有，创建新的音频对象
        const baseUrl = getBaseUrl();
        audio = new Audio(baseUrl + soundPath);
        audioCache.set(soundPath, audio);
      }
      
      // 重置音频
      audio.currentTime = 0;
      audio.volume = volume;
      
      audio.play().catch(err => {
        console.warn(`播放音效失败 (${soundPath}):`, err);
        if (onError) onError(err);
        reject(err);
      });
      
      resolve(audio);
    } catch (error) {
      console.error(`创建音频对象失败 (${soundPath}):`, error);
      if (onError) onError(error);
      reject(error);
    }
  });
};

/**
 * 预加载音频文件
 * @param {string|string[]} soundPaths - 单个音频路径或路径数组
 * @returns {Promise<Map<string, HTMLAudioElement>>} - 返回已加载的音频缓存
 */
export const preloadSounds = async (soundPaths) => {
  const paths = Array.isArray(soundPaths) ? soundPaths : [soundPaths];
  const baseUrl = getBaseUrl();
  
  const loadPromises = paths.map(path => {
    return new Promise(resolve => {
      try {
        // 如果已经缓存过，直接跳过
        if (audioCache.has(path)) {
          resolve();
          return;
        }
        
        const audio = new Audio(baseUrl + path);
        
        // 监听加载完成事件
        audio.addEventListener('canplaythrough', () => {
          audioCache.set(path, audio);
          resolve();
        }, { once: true });
        
        // 监听错误事件
        audio.addEventListener('error', () => {
          console.warn(`预加载音频失败: ${path}`);
          resolve(); // 即使失败也resolve，避免阻塞其他加载
        }, { once: true });
        
        // 开始加载
        audio.load();
      } catch (error) {
        console.error(`预加载音频出错 (${path}):`, error);
        resolve(); // 出错也resolve
      }
    });
  });
  
  // 等待所有音频加载完成
  await Promise.all(loadPromises);
  return audioCache;
};

/**
 * 停止正在播放的音频
 * @param {HTMLAudioElement} audio - 要停止的音频元素
 */
export const stopSound = (audio) => {
  if (audio && !audio.paused) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn('停止音频失败:', error);
    }
  }
};

/**
 * 清理音频缓存
 * @param {string|string[]} soundPaths - 要清理的音频路径，不提供则清理所有
 */
export const clearAudioCache = (soundPaths) => {
  if (!soundPaths) {
    // 清理所有缓存
    audioCache.clear();
    return;
  }
  
  const paths = Array.isArray(soundPaths) ? soundPaths : [soundPaths];
  paths.forEach(path => {
    audioCache.delete(path);
  });
}; 