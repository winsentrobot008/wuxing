// 五行元素
const wuxingElements = {
  wood: { name: '木', color: 'wood', icon: 'fa-leaf' },
  fire: { name: '火', color: 'fire', icon: 'fa-fire' },
  earth: { name: '土', color: 'earth', icon: 'fa-mountain' },
  metal: { name: '金', color: 'metal', icon: 'fa-cogs' },
  water: { name: '水', color: 'water', icon: 'fa-tint' }
};

// 天干
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 时辰对应表
const hourMapping = {
  0: { name: '子时', branch: '子', start: 23, end: 1 },
  1: { name: '丑时', branch: '丑', start: 1, end: 3 },
  2: { name: '寅时', branch: '寅', start: 3, end: 5 },
  3: { name: '卯时', branch: '卯', start: 5, end: 7 },
  4: { name: '辰时', branch: '辰', start: 7, end: 9 },
  5: { name: '巳时', branch: '巳', start: 9, end: 11 },
  6: { name: '午时', branch: '午', start: 11, end: 13 },
  7: { name: '未时', branch: '未', start: 13, end: 15 },
  8: { name: '申时', branch: '申', start: 15, end: 17 },
  9: { name: '酉时', branch: '酉', start: 17, end: 19 },
  10: { name: '戌时', branch: '戌', start: 19, end: 21 },
  11: { name: '亥时', branch: '亥', start: 21, end: 23 },
  unknown: { name: '未知', branch: '(未知)', start: 0, end: 0 }
};

// 天干五行
const stemWuxing = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
};

// 地支五行
const branchWuxing = {
  '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water'
};

// 天干地支五行对应表
const wuxingMapping = {
  wood: { strong: '木', weak: '水', color: 'green' },
  fire: { strong: '火', weak: '木', color: 'red' },
  earth: { strong: '土', weak: '火', color: 'yellow' },
  metal: { strong: '金', weak: '土', color: 'gray' },
  water: { strong: '水', weak: '金', color: 'blue' }
};

// 简化版农历转换函数（实际应用中需要更复杂的算法）
function convertToLunar(year, month, day) {
  // 这里应该有复杂的农历转换算法
  // 为简化示例，返回一个固定值
  return {
    year: '二〇二五',
    month: '三',
    day: '廿一',
    zodiac: '蛇'
  };
}

// 计算八字
function calculateBazi(date, hourIndex, gender, isLunar) {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1; // 月份从0开始
  const day = birthDate.getDate();
  
  // 计算农历日期
  const lunar = convertToLunar(year, month, day);
  
  // 计算生肖
  const zodiacIndex = (year - 4) % 12;
  const zodiac = zodiacs[zodiacIndex];
  
  // 计算年柱
  const yearStemIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;
  const yearStem = heavenlyStems[yearStemIndex];
  const yearBranch = earthlyBranches[yearBranchIndex];
  
  // 计算月柱（简化版）
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 1) % 12;
  const monthStem = heavenlyStems[monthStemIndex];
  const monthBranch = earthlyBranches[monthBranchIndex];
  
  // 计算日柱（简化版）
  // 这里应该有复杂的日柱计算算法
  // 为简化示例，使用一个固定值
  const dayStem = '丁';
  const dayBranch = '巳';
  
  // 计算时柱
  let hourStem = '';
  let hourBranch = '';
  
  if (hourIndex === 'unknown') {
    hourStem = '';
    hourBranch = '(未知)';
  } else {
    const hourInfo = hourMapping[parseInt(hourIndex)];
    hourBranch = hourInfo.branch;
    
    // 时柱天干计算（简化版）
    const hourStemIndex = (dayStemIndex * 2 + parseInt(hourIndex)) % 10;
    hourStem = heavenlyStems[hourStemIndex];
  }
  
  // 构建八字
  const bazi = {
    year: yearStem + yearBranch,
    month: monthStem + monthBranch,
    day: dayStem + dayBranch,
    hour: hourStem + hourBranch
  };
  
  // 计算五行
  const wuxing = calculateWuxing(bazi);
  
  // 计算纳音五行
  const naYin = calculateNaYin(yearStem, yearBranch);
  
  // 分析五行强弱
  const wuxingAnalysis = analyzeWuxing(wuxing);
  
  // 生成用神建议
  const yongShenSuggestion = generateYongShenSuggestion(wuxingAnalysis);
  
  // 生成命格性格提示
  const characterAnalysis = generateCharacterAnalysis(wuxingAnalysis, gender);
  
  return {
    bazi,
    wuxing,
    wuxingAnalysis,
    lunar,
    zodiac,
    naYin,
    yongShenSuggestion,
    characterAnalysis
  };
}

// 计算五行数量
function calculateWuxing(bazi) {
  const wuxing = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };
  
  // 分析年柱
  const yearStem = bazi.year[0];
  const yearBranch = bazi.year[1];
  wuxing[stemWuxing[yearStem]]++;
  if (yearBranch !== '(') { // 检查是否为未知时辰
    wuxing[branchWuxing[yearBranch]]++;
  }
  
  // 分析月柱
  const monthStem = bazi.month[0];
  const monthBranch = bazi.month[1];
  wuxing[stemWuxing[monthStem]]++;
  wuxing[branchWuxing[monthBranch]]++;
  
  // 分析日柱
  const dayStem = bazi.day[0];
  const dayBranch = bazi.day[1];
  wuxing[stemWuxing[dayStem]]++;
  wuxing[branchWuxing[dayBranch]]++;
  
  // 分析时柱
  if (bazi.hour[1] !== '(') { // 检查是否为未知时辰
    const hourStem = bazi.hour[0];
    const hourBranch = bazi.hour[1];
    wuxing[stemWuxing[hourStem]]++;
    wuxing[branchWuxing[hourBranch]]++;
  }
  
  return wuxing;
}

// 计算纳音五行（简化版）
function calculateNaYin(stem, branch) {
  // 这里应该有复杂的纳音五行计算算法
  // 为简化示例，返回一个固定值
  return '覆灯火';
}

// 分析五行强弱
function analyzeWuxing(wuxing) {
  // 找出最强和最弱的五行
  let strongest = 'wood';
  let strongestCount = 0;
  let weakest = 'wood';
  let weakestCount = 10;
  
  for (const element in wuxing) {
    if (wuxing[element] > strongestCount) {
      strongestCount = wuxing[element];
      strongest = element;
    }
    if (wuxing[element] < weakestCount) {
      weakestCount = wuxing[element];
      weakest = element;
    }
  }
  
  // 找出次强和次弱的五行
  let secondStrongest = null;
  let secondStrongestCount = 0;
  let secondWeakest = null;
  let secondWeakestCount = 10;
  
  for (const element in wuxing) {
    if (element !== strongest && wuxing[element] > secondStrongestCount) {
      secondStrongestCount = wuxing[element];
      secondStrongest = element;
    }
    if (element !== weakest && wuxing[element] < secondWeakestCount) {
      secondWeakestCount = wuxing[element];
      secondWeakest = element;
    }
  }
  
  return {
    strongest,
    strongestCount,
    secondStrongest,
    secondStrongestCount,
    weakest,
    weakestCount,
    secondWeakest,
    secondWeakestCount,
    wuxing
  };
}

// 生成用神建议
function generateYongShenSuggestion(analysis) {
  // 根据五行强弱生成用神建议
  const suggestions = {
    wood: ['森', '林', '松', '柏', '梅', '兰', '竹', '菊', '桂', '楠'],
    fire: ['炎', '焱', '炳', '煜', '烨', '炜', '灿', '烽', '焕', '焰'],
    earth: ['坤', '垚', '垣', '基', '城', '坚', '坤', '培', '境', '墨'],
    metal: ['鑫', '钰', '铭', '钧', '锐', '铮', '镇', '铁', '钢', '锋'],
    water: ['淼', '泉', '海', '洋', '江', '河', '湖', '泊', '雨', '雪']
  };
  
  // 如果最弱的五行数量为0，建议加强该五行
  if (analysis.weakestCount === 0) {
    return {
      element: analysis.weakest,
      name: wuxingElements[analysis.weakest].name,
      characters: suggestions[analysis.weakest].slice(0, 5)
    };
  }
  
  // 如果最强的五行数量过多，建议抑制该五行
  if (analysis.strongestCount > 3) {
    // 找出能克制最强五行的五行
    const counterMap = {
      wood: 'metal',
      fire: 'water',
      earth: 'wood',
      metal: 'fire',
      water: 'earth'
    };
    
    const counterElement = counterMap[analysis.strongest];
    return {
      element: counterElement,
      name: wuxingElements[counterElement].name,
      characters: suggestions[counterElement].slice(0, 5)
    };
  }
  
  // 默认建议
  return {
    element: 'water',
    name: '水',
    characters: ['涵', '涛', '润', '洁', '沛']
  };
}

// 生成命格性格提示
function generateCharacterAnalysis(analysis, gender) {
  // 根据五行强弱生成性格分析
  const characterTraits = {
    wood: {
      positive: ['温和', '柔韧', '有耐心', '适应能力强', '善良'],
      negative: ['优柔寡断', '缺乏主见', '容易妥协', '犹豫不决', '软弱']
    },
    fire: {
      positive: ['热情', '活力充沛', '有领导力', '创造力强', '自信'],
      negative: ['急躁', '冲动', '易怒', '固执', '好胜']
    },
    earth: {
      positive: ['稳重', '踏实', '可靠', '有责任心', '务实'],
      negative: ['保守', '固执', '缺乏变通', '墨守成规', '迟缓']
    },
    metal: {
      positive: ['刚毅', '果断', '有决断力', '理性', '坚定'],
      negative: ['冷酷', '固执', '无情', '傲慢', '倔强']
    },
    water: {
      positive: ['聪明', '灵活', '思维敏捷', '适应力强', '有洞察力'],
      negative: ['善变', '犹豫不决', '缺乏恒心', '浮躁', '投机']
    }
  };
  
  // 根据最强的五行生成性格分析
  const strongestTraits = characterTraits[analysis.strongest].positive;
  const weakestTraits = characterTraits[analysis.weakest].negative;
  
  // 随机选择几个性格特点
  const selectedPositive = strongestTraits.sort(() => 0.5 - Math.random()).slice(0, 2);
  const selectedNegative = weakestTraits.sort(() => 0.5 - Math.random()).slice(0, 2);
  
  // 生成性格分析文本
  let analysisText = `您五行中“${wuxingElements[analysis.weakest].name}”较弱，建议加强该方面特质培养。\n\n`;
  analysisText += `大致命格性格倾向：${selectedPositive.join('，')}。`;
  
  return analysisText;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const inputSection = document.getElementById('inputSection');
  const resultSection = document.getElementById('resultSection');
  const resultContent = document.getElementById('resultContent');
  const baziForm = document.getElementById('baziForm');
  const calculateBtn = document.getElementById('calculateBtn');
  const recalculateBtn = document.getElementById('recalculateBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // 设置默认日期为今天
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  document.getElementById('birthDate').value = formattedDate;
  
  // 计算按钮点击事件
  calculateBtn.addEventListener('click', function() {
    // 获取用户输入
    const birthDate = document.getElementById('birthDate').value;
    const birthHour = document.getElementById('birthHour').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const isLunar = document.getElementById('isLunar').checked;
    
    // 验证输入
    if (!birthDate || birthHour === '') {
      alert('请填写完整信息！');
      return;
    }
    
    // 显示加载动画
    loadingOverlay.classList.remove('hidden');
    
    // 模拟计算延迟
    setTimeout(() => {
      // 计算八字
      const result = calculateBazi(birthDate, birthHour, gender, isLunar);
      
      // 生成结果HTML
      resultContent.innerHTML = generateResultHTML(result);
      
      // 隐藏输入区域，显示结果区域
      inputSection.classList.add('hidden');
      resultSection.classList.remove('hidden');
      
      // 隐藏加载动画
      loadingOverlay.classList.add('hidden');
      
      // 平滑滚动到结果区域
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  });
  
  // 重新计算按钮点击事件
  recalculateBtn.addEventListener('click', function() {
    // 显示输入区域，隐藏结果区域
    resultSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    
    // 平滑滚动到输入区域
    inputSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// 生成结果HTML
function generateResultHTML(result) {
  // 生成五行分布HTML
  let wuxingHTML = '';
  for (const element in result.wuxing) {
    const count = result.wuxing[element];
    const elementInfo = wuxingElements[element];
    
    // 检查是否是最弱的五行
    const isWeakest = element === result.wuxingAnalysis.weakest;
    const isStrongest = element === result.wuxingAnalysis.strongest;
    
    wuxingHTML += `
      <div class="flex items-center mb-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center ${elementInfo.color}/20 mr-3">
          <i class="fa ${elementInfo.icon} text-${elementInfo.color}"></i>
        </div>
        <span class="font-medium">${elementInfo.name}：${count}个</span>
        ${isWeakest ? '<span class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">偏弱</span>' : ''}
        ${isStrongest ? '<span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">偏旺</span>' : ''}
      </div>
    `;
  }
  
  // 生成用神建议HTML
  let yongShenHTML = '';
  result.yongShenSuggestion.characters.forEach(character => {
    yongShenHTML += `
      <span class="inline-block bg-${result.yongShenSuggestion.element}/10 text-${result.yongShenSuggestion.element} font-medium px-3 py-1 rounded-full mr-2 mb-2">
        ${character}
      </span>
    `;
  });
  
  // 返回完整的结果HTML
  return `
    <!-- 出生日期信息 -->
    <div class="mb-6">
      <h4 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <i class="fa fa-calendar-o mr-2 text-primary"></i>
        出生日期信息
      </h4>
      <div class="bg-neutral-50 p-4 rounded-lg">
        <p class="mb-2"><span class="font-medium">农历：</span>${result.lunar.year}年 ${result.lunar.month}月 ${result.lunar.day}日</p>
        <p class="mb-2">
          <span class="font-medium">生肖：</span>
          <i class="fa fa-snake mr-1 text-primary"></i>
          ${result.zodiac}
        </p>
        <p class="mb-2"><span class="font-medium">八字：</span>${result.bazi.year} ${result.bazi.month} ${result.bazi.day} ${result.bazi.hour}</p>
        <p><span class="font-medium">纳音五行：</span>${result.naYin}</p>
      </div>
    </div>
    
    <!-- 五行分布分析 -->
    <div class="mb-6">
      <h4 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <i class="fa fa-pie-chart mr-2 text-primary"></i>
        五行分布分析
      </h4>
      <div class="bg-neutral-50 p-4 rounded-lg">
        ${wuxingHTML}
        ${result.wuxingAnalysis.weakestCount === 0 || result.wuxingAnalysis.strongestCount > 3 ? `
          <div class="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p class="text-amber-800 font-medium">五行不均：${result.wuxingElements[result.wuxingAnalysis.weakest].name}偏弱，${result.wuxingElements[result.wuxingAnalysis.strongest].name}偏旺</p>
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- 用神建议 -->
    <div class="mb-6">
      <h4 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <i class="fa fa-lightbulb-o mr-2 text-primary"></i>
        用神建议
      </h4>
      <div class="bg-neutral-50 p-4 rounded-lg">
        <p class="mb-3">建议起名偏向「${result.yongShenSuggestion.name}」五行，推荐字：</p>
        <div class="flex flex-wrap">
          ${yongShenHTML}
        </div>
      </div>
    </div>
    
    <!-- 命格性格提示 -->
    <div>
      <h4 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <i class="fa fa-user-o mr-2 text-primary"></i>
        命格性格提示
      </h4>
      <div class="bg-neutral-50 p-4 rounded-lg">
        <p>${result.characterAnalysis}</p>
      </div>
    </div>
  `;
}
