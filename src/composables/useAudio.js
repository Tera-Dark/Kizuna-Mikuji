import { ref } from 'vue';
import { playSound, preloadSounds, stopSound } from '../utils/audioUtils';

/**
 * 音频播放的组合式函数
 * @returns {Object} 包含音频相关的状态和方法
 */
export function useAudio() {
  const isPlaying = ref(false);
  const hasError = ref(false);
  const currentAudio = ref(null);
  
  /**
   * 播放音频
   * @param {string} soundPath - 音频文件路径
   * @param {number} volume - 音量（0.0到1.0）
   * @returns {Promise<HTMLAudioElement>} 音频元素
   */
  const play = async (soundPath, volume = 0.7) => {
    // 如果有正在播放的音频，先停止它
    stop();
    
    hasError.value = false;
    isPlaying.value = true;
    
    try {
      const audio = await playSound(soundPath, volume, handleError);
      currentAudio.value = audio;
      
      // 监听播放结束事件
      audio.addEventListener('ended', () => {
        isPlaying.value = false;
        currentAudio.value = null;
      }, { once: true });
      
      return audio;
    } catch (error) {
      handleError(error);
      return null;
    }
  };
  
  /**
   * 停止当前音频播放
   */
  const stop = () => {
    if (currentAudio.value) {
      stopSound(currentAudio.value);
      isPlaying.value = false;
      currentAudio.value = null;
    }
  };
  
  /**
   * 预加载多个音频文件
   * @param {string|string[]} soundPaths - 要预加载的音频路径
   */
  const preload = async (soundPaths) => {
    try {
      await preloadSounds(soundPaths);
    } catch (error) {
      console.warn('预加载音频失败:', error);
    }
  };
  
  /**
   * 处理音频错误
   * @private
   */
  const handleError = (error) => {
    console.warn('音频播放出错:', error);
    hasError.value = true;
    isPlaying.value = false;
    currentAudio.value = null;
  };
  
  return {
    isPlaying,
    hasError,
    currentAudio,
    play,
    stop,
    preload
  };
} 