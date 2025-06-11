// 八字计算函数
function calculateBazi(birthDate, birthHour, gender) {
  // 简化版八字计算逻辑
  // 实际应用中需要更复杂的算法来计算八字
  
  const year = new Date(birthDate).getFullYear();
  const month = new Date(birthDate).getMonth() + 1;
  const day = new Date(birthDate).getDate();
  
  // 天干
  const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 地支
  const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 简化版的八字计算
  const yearIndex = (year - 4) % 10;
  const monthIndex = (month - 1 + 2) % 12; // 加2是因为正月对应寅
  const dayIndex = (day - 1 + 4) % 10; // 假设从甲子日开始计算
  const hourIndex = Math.floor(birthHour / 2);
  
  const bazi = {
    year: heavenlyStems[yearIndex] + earthlyBranches[yearIndex],
    month: heavenlyStems[(yearIndex * 2 + monthIndex) % 10] + earthlyBranches[monthIndex],
    day: heavenlyStems[dayIndex] + earthlyBranches[dayIndex],
    hour: heavenlyStems[(dayIndex * 2 + hourIndex) % 10] + earthlyBranches[hourIndex]
  };
  
  // 五行分析
  const wuxing = analyzeWuXing(bazi);
  
  // 八字解读
  const analysis = interpretBazi(bazi, wuxing, gender);
  
  return {
    bazi,
    wuxing,
    analysis
  };
}

// 五行分析函数
function analyzeWuXing(bazi) {
  // 天干地支对应的五行
  const stemWuXing = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  
  const branchWuXing = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
  };
  
  // 统计五行
  const wuxingCount = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };
  
  // 分析年柱
  wuxingCount[stemWuXing[bazi.year[0]]]++;
  wuxingCount[branchWuXing[bazi.year[1]]]++;
  
  // 分析月柱
  wuxingCount[stemWuXing[bazi.month[0]]]++;
  wuxingCount[branchWuXing[bazi.month[1]]]++;
  
  // 分析日柱
  wuxingCount[stemWuXing[bazi.day[0]]]++;
  wuxingCount[branchWuXing[bazi.day[1]]]++;
  
  // 分析时柱
  wuxingCount[stemWuXing[bazi.hour[0]]]++;
  wuxingCount[branchWuXing[bazi.hour[1]]]++;
  
  return wuxingCount;
}

// 八字解读函数
function interpretBazi(bazi, wuxing, gender) {
  // 找出最强和最弱的五行
  let strongest = '木';
  let weakest = '木';
  let maxCount = 0;
  let minCount = 10;
  
  for (const element in wuxing) {
    if (wuxing[element] > maxCount) {
      maxCount = wuxing[element];
      strongest = element;
    }
    if (wuxing[element] < minCount) {
      minCount = wuxing[element];
      weakest = element;
    }
  }
  
  // 简化版的八字解读
  let analysis = `您的八字为：${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}\n\n`;
  analysis += `五行分析：木(${wuxing['木']})、火(${wuxing['火']})、土(${wuxing['土']})、金(${wuxing['金']})、水(${wuxing['水']})\n\n`;
  
  // 根据五行强弱提供解读
  analysis += `您的五行中，${strongest}最旺，${weakest}最弱。\n\n`;
  
  // 简单的性格分析
  if (strongest === '木') {
    analysis += '您性格温和，有韧性，适应能力强。\n';
  } else if (strongest === '火') {
    analysis += '您热情开朗，充满活力，有领导才能。\n';
  } else if (strongest === '土') {
    analysis += '您稳重踏实，值得信赖，有责任心。\n';
  } else if (strongest === '金') {
    analysis += '您聪明机智，有决断力，做事果断。\n';
  } else if (strongest === '水') {
    analysis += '您思维敏捷，灵活多变，有创新精神。\n';
  }
  
  // 简单的建议
  analysis += `建议您在生活中多接触${weakest}相关的事物，以平衡五行。`;
  
  return analysis;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const form = document.getElementById('baziForm');
  const birthDateInput = document.getElementById('birthDate');
  const birthHourSelect = document.getElementById('birthHour');
  const genderSelect = document.getElementById('gender');
  const calculateBtn = document.getElementById('calculateBtn');
  const baziOutput = document.getElementById('baziOutput');
  const wuxingDisplay = document.getElementById('wuxingDisplay');
  const analysisOutput = document.getElementById('analysisOutput');
  
  // 设置默认日期为今天
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  birthDateInput.value = formattedDate;
  
  // 按钮点击事件
  calculateBtn.addEventListener('click', function() {
    // 获取用户输入
    const birthDate = birthDateInput.value;
    const birthHour = parseInt(birthHourSelect.value);
    const gender = genderSelect.value;
    
    // 验证输入
    if (!birthDate || isNaN(birthHour) || !gender) {
      alert('请填写完整信息！');
      return;
    }
    
    // 计算八字
    const result = calculateBazi(birthDate, birthHour, gender);
    
    // 显示八字
    baziOutput.textContent = `${result.bazi.year} ${result.bazi.month} ${result.bazi.day} ${result.bazi.hour}`;
    
    // 显示五行
    wuxingDisplay.innerHTML = '';
    for (const element in result.wuxing) {
      const count = result.wuxing[element];
      for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.className = `wuxing-item ${element.toLowerCase()}`;
        item.textContent = element;
        wuxingDisplay.appendChild(item);
      }
    }
    
    // 显示分析结果
    analysisOutput.textContent = result.analysis;
    
    // 滚动到结果区域
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  });
});
