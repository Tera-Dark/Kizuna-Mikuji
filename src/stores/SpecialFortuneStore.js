import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { useHistoryStore } from './HistoryStore';
import { useUserStore } from './UserStore';

/**
 * 特殊占卜（星座配对、名字解析等）状态管理Store
 */
export const useSpecialFortuneStore = defineStore('specialFortune', () => {
  // 星座配对状态
  const selectedSign1 = ref('');
  const selectedSign2 = ref('');
  const zodiacResult = ref(null);
  
  // 名字解析状态
  const analyzedName = ref('');
  const nameResult = ref(null);
  
  // 依赖的其他Store
  const historyStore = useHistoryStore();
  const userStore = useUserStore();
  
  // 星座数据
  const zodiacData = {
    aries: { name: '白羊座', element: 'fire', dates: '3.21-4.19' },
    taurus: { name: '金牛座', element: 'earth', dates: '4.20-5.20' },
    gemini: { name: '双子座', element: 'air', dates: '5.21-6.21' },
    cancer: { name: '巨蟹座', element: 'water', dates: '6.22-7.22' },
    leo: { name: '狮子座', element: 'fire', dates: '7.23-8.22' },
    virgo: { name: '处女座', element: 'earth', dates: '8.23-9.22' },
    libra: { name: '天秤座', element: 'air', dates: '9.23-10.23' },
    scorpio: { name: '天蝎座', element: 'water', dates: '10.24-11.22' },
    sagittarius: { name: '射手座', element: 'fire', dates: '11.23-12.21' },
    capricorn: { name: '摩羯座', element: 'earth', dates: '12.22-1.19' },
    aquarius: { name: '水瓶座', element: 'air', dates: '1.20-2.18' },
    pisces: { name: '双鱼座', element: 'water', dates: '2.19-3.20' }
  };
  
  /**
   * 获取星座对应的表情
   * @param {string} sign - 星座ID
   * @returns {string} 表情符号
   */
  function getZodiacEmoji(sign) {
    const emojiMap = {
      aries: '♈',
      taurus: '♉',
      gemini: '♊',
      cancer: '♋',
      leo: '♌',
      virgo: '♍',
      libra: '♎',
      scorpio: '♏',
      sagittarius: '♐',
      capricorn: '♑',
      aquarius: '♒',
      pisces: '♓'
    };
    return emojiMap[sign] || '⭐';
  }
  
  /**
   * 分析星座配对
   */
  function analyzeZodiacCompatibility() {
    if (!selectedSign1.value || !selectedSign2.value) {
      return null;
    }
    
    // 获取元素类型
    const element1 = zodiacData[selectedSign1.value].element;
    const element2 = zodiacData[selectedSign2.value].element;
    
    // 计算相容性分数（1-100）
    let score = 50; // 默认中等相容性
    
    // 根据元素相性调整分数
    if (element1 === element2) {
      // 相同元素 +10
      score += 10;
    } else if (
      (element1 === 'fire' && element2 === 'air') ||
      (element1 === 'air' && element2 === 'fire') ||
      (element1 === 'water' && element2 === 'earth') ||
      (element1 === 'earth' && element2 === 'water')
    ) {
      // 互补元素 +15
      score += 15;
    } else if (
      (element1 === 'fire' && element2 === 'water') ||
      (element1 === 'water' && element2 === 'fire') ||
      (element1 === 'air' && element2 === 'earth') ||
      (element1 === 'earth' && element2 === 'air')
    ) {
      // 对立元素 -10
      score -= 10;
    }
    
    // 添加一些随机性
    const randomFactor = Math.floor(Math.random() * 20) - 10; // -10到+10的随机值
    score = Math.max(1, Math.min(100, score + randomFactor));
    
    // 根据分数确定相容性类型
    let compatibilityType = '';
    if (score >= 90) {
      compatibilityType = '天作之合';
    } else if (score >= 80) {
      compatibilityType = '缘定三生';
    } else if (score >= 70) {
      compatibilityType = '相互吸引';
    } else if (score >= 60) {
      compatibilityType = '和谐搭配';
    } else if (score >= 50) {
      compatibilityType = '一般般';
    } else if (score >= 40) {
      compatibilityType = '需要磨合';
    } else if (score >= 30) {
      compatibilityType = '相处有挑战';
    } else if (score >= 20) {
      compatibilityType = '互补但有冲突';
    } else {
      compatibilityType = '八字不合';
    }
    
    // 生成解读内容
    const interpretation = generateZodiacInterpretation(selectedSign1.value, selectedSign2.value, score);
    
    // 构造结果对象
    zodiacResult.value = {
      sign1: selectedSign1.value,
      sign2: selectedSign2.value,
      score: score,
      type: compatibilityType,
      interpretation: interpretation,
      date: new Date().toISOString()
    };
    
    // 保存到历史
    historyStore.addToHistory({
      category: 'zodiac',
      type: compatibilityType,
      sign1: selectedSign1.value,
      sign2: selectedSign2.value,
      score: score,
      interpretation: interpretation,
      date: new Date().toISOString()
    });
    
    // 增加抽签次数
    userStore.incrementFortuneCount();
    
    return zodiacResult.value;
  }
  
  /**
   * 生成星座配对解读内容
   * @private
   */
  function generateZodiacInterpretation(sign1, sign2, score) {
    const name1 = zodiacData[sign1].name;
    const name2 = zodiacData[sign2].name;
    
    let baseInterpretation = `${name1}和${name2}的配对`;
    
    if (score >= 80) {
      baseInterpretation += `相当和谐！你们之间存在着天然的吸引力和理解。${name1}的${getElementTrait(zodiacData[sign1].element)}与${name2}的${getElementTrait(zodiacData[sign2].element)}形成了良好的互补。你们在一起可以相互激励，共同成长。彼此的优点能够得到对方的欣赏，缺点也能得到包容。`;
    } else if (score >= 60) {
      baseInterpretation += `比较融洽。虽然你们有一些差异，但这些差异往往成为互相吸引的因素。${name1}的${getElementTrait(zodiacData[sign1].element)}和${name2}的${getElementTrait(zodiacData[sign2].element)}能够形成互补的力量。只要愿意相互理解和包容，你们可以建立稳固的关系。`;
    } else if (score >= 40) {
      baseInterpretation += `需要双方共同努力。${name1}的${getElementTrait(zodiacData[sign1].element)}与${name2}的${getElementTrait(zodiacData[sign2].element)}有时会产生一些摩擦。你们可能在沟通方式、生活习惯或价值观上存在差异，需要更多的包容和理解。通过真诚的沟通和妥协，你们仍然可以建立和谐的关系。`;
    } else {
      baseInterpretation += `存在较大挑战。${name1}的${getElementTrait(zodiacData[sign1].element)}与${name2}的${getElementTrait(zodiacData[sign2].element)}可能有较强的对立性。你们在很多方面的看法和处事方式可能存在较大差异。虽然挑战较大，但也不是没有可能。如果双方都愿意付出更多的努力去理解和适应对方，依然可以克服这些障碍。`;
    }
    
    return baseInterpretation;
  }
  
  /**
   * 获取元素特质
   * @private
   */
  function getElementTrait(element) {
    switch (element) {
      case 'fire':
        return '热情活力';
      case 'earth':
        return '稳重务实';
      case 'air':
        return '理性灵活';
      case 'water':
        return '感性直觉';
      default:
        return '独特气质';
    }
  }
  
  /**
   * 分析名字
   * @param {string} name - 要分析的名字
   */
  function analyzeNameFortune(name) {
    if (!name) return null;
    
    analyzedName.value = name;
    
    // 名字分析逻辑
    // 这里可以添加更复杂的逻辑，如姓名学、五行分析等
    // 简化版本只生成一些基本解读
    
    // 姓名首字特征
    const firstChar = name.charAt(0);
    const firstCharTrait = getFirstCharTrait(firstChar);
    
    // 姓名长度特征
    const lengthTrait = getNameLengthTrait(name.length);
    
    // 构造结果
    nameResult.value = {
      name: name,
      type: getRandomNameFortuneType(),
      interpretation: `${name}，${firstCharTrait}${lengthTrait}${getPersonalityTrait(name)}`,
      suggestion: getNameSuggestion(name),
      date: new Date().toISOString()
    };
    
    // 保存到历史
    historyStore.addToHistory({
      category: 'name',
      type: nameResult.value.type,
      name: name,
      interpretation: nameResult.value.interpretation,
      suggestion: nameResult.value.suggestion,
      date: new Date().toISOString()
    });
    
    // 增加抽签次数
    userStore.incrementFortuneCount();
    
    return nameResult.value;
  }
  
  /**
   * 获取名字首字特征
   * @private
   */
  function getFirstCharTrait(char) {
    // 简化版本，可根据需要扩展
    const traits = [
      '这个名字彰显了你天生的领导气质，',
      '这个名字体现了你温和又坚定的性格，',
      '从名字可以看出你思维活跃，富有创造力，',
      '这个名字寓意着平静与和谐，预示着你处事冷静，',
      '你的名字透露出才华横溢的气息，'
    ];
    
    // 使用字符编码作为随机种子
    const seed = char.charCodeAt(0) % traits.length;
    return traits[seed];
  }
  
  /**
   * 获取名字长度特征
   * @private
   */
  function getNameLengthTrait(length) {
    if (length <= 2) {
      return '简短有力的名字代表着你做事干脆利落，不拖泥带水。';
    } else if (length === 3) {
      return '三个字的名字寓意平衡稳定，象征着你做事全面考虑，不偏不倚。';
    } else {
      return '较长的名字体现了丰富的内涵，暗示着你性格多面且有深度。';
    }
  }
  
  /**
   * 获取个性特征
   * @private
   */
  function getPersonalityTrait(name) {
    // 使用名字的总字符编码作为随机种子
    let charSum = 0;
    for (let i = 0; i < name.length; i++) {
      charSum += name.charCodeAt(i);
    }
    
    const traits = [
      '你天生具有亲和力，容易与人建立良好关系。',
      '你有坚韧不拔的毅力，面对困难从不轻言放弃。',
      '你的直觉敏锐，常能洞察事物本质，做出正确决断。',
      '你心思细腻，善于关心和理解他人的感受。',
      '你思维灵活，善于创新，能够以独特视角看待问题。',
      '你做事有条理，善于规划，能高效完成各项任务。',
      '你具有天生的艺术气质，对美有着独特的感知力。',
      '你性格开朗阳光，乐观积极，能够感染周围的人。'
    ];
    
    const index = charSum % traits.length;
    return traits[index];
  }
  
  /**
   * 获取名字相关建议
   * @private
   */
  function getNameSuggestion(name) {
    const suggestions = [
      '建议你充分发挥自身优势，不断探索新的可能性。',
      '适合你的发展方向是艺术或设计类工作，能充分展现你的创造力。',
      '你适合从事需要良好沟通能力的工作，如教育、销售或公关领域。',
      '建议你多参与团队活动，你的合作精神将成为团队的重要力量。',
      '你的分析能力较强，适合从事需要逻辑思维的工作，如研究、分析或规划类岗位。',
      '建议你保持内心平静，避免受外界干扰，专注于自己的成长和发展。',
      '你的洞察力是宝贵的财富，建议多培养这方面的能力，将为你带来更多机会。',
      '适合你的是能够发挥独立思考能力的工作环境，避免过于循规蹈矩的职业选择。'
    ];
    
    // 使用名字长度作为随机种子
    const index = (name.length * 31) % suggestions.length;
    return suggestions[index];
  }
  
  /**
   * 获取随机名字运势类型
   * @private
   */
  function getRandomNameFortuneType() {
    const types = [
      '才智卓越', '心灵手巧', '领袖气质', '和谐稳重', 
      '创新思维', '亲和力强', '细致耐心', '活力四射'
    ];
    
    return types[Math.floor(Math.random() * types.length)];
  }
  
  /**
   * 重置星座配对
   */
  function resetZodiac() {
    selectedSign1.value = '';
    selectedSign2.value = '';
    zodiacResult.value = null;
  }
  
  /**
   * 重置名字分析
   */
  function resetNameAnalysis() {
    analyzedName.value = '';
    nameResult.value = null;
  }
  
  return {
    // 星座配对
    selectedSign1,
    selectedSign2,
    zodiacResult,
    zodiacData,
    getZodiacEmoji,
    analyzeZodiacCompatibility,
    resetZodiac,
    
    // 名字解析
    analyzedName,
    nameResult,
    analyzeNameFortune,
    resetNameAnalysis
  };
}); 