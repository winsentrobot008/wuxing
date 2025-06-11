// 修复版JavaScript逻辑
document.addEventListener('DOMContentLoaded', function() {
  const inputSection = document.getElementById('inputSection');
  const resultSection = document.getElementById('resultSection');
  const resultContent = document.getElementById('resultContent');
  const calculateBtn = document.getElementById('calculateBtn');
  const recalculateBtn = document.getElementById('recalculateBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // 设置默认日期
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  document.getElementById('birthDate').value = formattedDate;
  
  calculateBtn.addEventListener('click', function() {
    const birthDate = document.getElementById('birthDate').value;
    const birthHour = document.getElementById('birthHour').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    if (!birthDate || birthHour === '') {
      alert('请填写完整信息！');
      return;
    }
    
    // 显示加载状态
    resultContent.innerHTML = '';
    resultSection.classList.remove('hidden');
    
    // 模拟计算过程（实际应用中应替换为真实计算）
    simulateCalculation(birthDate, birthHour, gender)
      .then(result => {
        // 计算成功，渲染结果
        resultContent.innerHTML = generateResultHTML(result);
      })
      .catch(error => {
        // 计算失败，显示错误信息
        resultContent.innerHTML = `
          <div class="error-message">
            <h4 class="font-bold text-red-700 mb-2">测算失败</h4>
            <p>${error.message || '计算过程中出现错误，请重试。'}</p>
          </div>
        `;
        console.error('测算错误:', error);
      });
  });
  
  // 模拟计算函数（包含错误处理）
  function simulateCalculation(date, hour, gender) {
    return new Promise((resolve, reject) => {
      // 模拟网络请求或复杂计算
      setTimeout(() => {
        try {
          // 这里调用实际的计算函数
          const result = calculateBazi(date, hour, gender);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 1500);
    });
  }
  
  // 重新计算按钮事件
  recalculateBtn.addEventListener('click', function() {
    resultSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    inputSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// 简化版计算函数（包含错误处理）
function calculateBazi(date, hour, gender) {
  // 基本输入验证
  if (!date) throw new Error('缺少出生日期');
  if (hour === '' && hour !== 'unknown') throw new Error('缺少出生时辰');
  
  const birthDate = new Date(date);
  if (isNaN(birthDate.getTime())) throw new Error('无效的出生日期');
  
  // 这里应包含完整的八字计算逻辑
  // 为简化示例，返回一个固定结果
  return {
    bazi: { year: '乙巳', month: '庚辰', day: '丁巳', hour: hour === 'unknown' ? '(未知)' : '辛丑' },
    wuxing: { wood: 1, fire: 3, earth: 1, metal: 1, water: 0 },
    wuxingAnalysis: { strongest: 'fire', weakest: 'water' },
    lunar: { year: '二〇二五', month: '三', day: '廿一' },
    zodiac: '蛇',
    naYin: '覆灯火',
    yongShenSuggestion: { element: 'water', name: '水', characters: ['涵', '涛', '润', '洁', '沛'] },
    characterAnalysis: '您五行中"水"较弱，建议加强该方面特质培养。大致命格性格倾向：聪明机智，思维活跃。'
  };
}

// 结果HTML生成函数
function generateResultHTML(result) {
  return `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <i class="fa fa-calendar-check-o mr-2 text-primary"></i>
        生辰八字测算结果
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-semibold text-gray-700 mb-2">出生日期信息</h3>
          <p class="mb-2"><span class="font-medium">农历：</span>${result.lunar.year}年 ${result.lunar.month}月 ${result.lunar.day}日</p>
          <p class="mb-2"><span class="font-medium">生肖：</span>${result.zodiac}</p>
          <p class="mb-2"><span class="font-medium">八字：</span>${result.bazi.year} ${result.bazi.month} ${result.bazi.day} ${result.bazi.hour}</p>
          <p><span class="font-medium">纳音五行：</span>${result.naYin}</p>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-700 mb-2">五行分布分析</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <i class="fa fa-leaf text-green-500 text-xs"></i>
              </div>
              <span>木：${result.wuxing.wood}个</span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <i class="fa fa-fire text-red-500 text-xs"></i>
              </div>
              <span>火：${result.wuxing.fire}个 <span class="text-red-500 ml-1">(偏旺)</span></span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                <i class="fa fa-mountain text-yellow-500 text-xs"></i>
              </div>
              <span>土：${result.wuxing.earth}个</span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                <i class="fa fa-cogs text-gray-500 text-xs"></i>
              </div>
              <span>金：${result.wuxing.metal}个</span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <i class="fa fa-tint text-blue-500 text-xs"></i>
              </div>
              <span>水：${result.wuxing.water}个 <span class="text-blue-500 ml-1">(偏弱)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="font-semibold text-gray-700 mb-4">用神建议</h3>
      <p class="mb-3">建议起名偏向「${result.yongShenSuggestion.name}」五行，推荐字：</p>
      <div class="flex flex-wrap gap-2">
        ${result.yongShenSuggestion.characters.map(char => 
          `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${char}</span>`
        ).join('')}
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="font-semibold text-gray-700 mb-3">命格性格提示</h3>
      <p>${result.characterAnalysis}</p>
    </div>
  `;
}