// script.js - 仅包含前端UI逻辑
// 确保 lunar.js 和 calculateBazi.js 已在 index.html 中正确加载

document.getElementById('calculateBtn').addEventListener('click', function() {
    const yearInput = document.getElementById('year').value;
    const monthInput = document.getElementById('month').value;
    const dayInput = document.getElementById('day').value;
    const hourInput = document.getElementById('hour').value;
    
    // 改进的输入验证：检查是否为有效数字及范围
    const year = parseInt(yearInput);
    const month = parseInt(monthInput);
    const day = parseInt(dayInput);
    const hour = parseInt(hourInput);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) ||
        year < 1900 || year > 2100 || // 示例范围，可根据需要调整
        month < 1 || month > 12 ||
        day < 1 || day > 31 || // 简单验证，更严格的日期验证应考虑月份和闰年
        hour < 0 || hour > 23) {
        alert('请填写有效的出生日期和时辰！\n年份应在1900-2100之间，月份1-12，日期1-31，时辰0-23。');
        return;
    }

    try {
        // 使用lunar.js库进行日期和八字计算
        // 确保 Solar, Lunar, EightChar 在此之前已由 lunar.js 加载到全局作用域
        const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
        const lunar = solar.getLunar();
        const eightChar = lunar.getEightChar();

        // 增强的八字对象检查
        if (!eightChar || typeof eightChar.getHourGan !== 'function' || typeof eightChar.getYearGan !== 'function') {
            console.error('`eightChar` 对象无效或缺少方法:', eightChar); 
            throw new Error('无法获取有效的八字信息。请检查输入的出生日期和时间，确保其在合理范围内。');
        }

        // 调用 calculateBazi.js 中定义的函数
        const baziData = calculateBazi(eightChar); 

        // 更新页面上的八字信息
        document.getElementById('baziOutput').innerText = baziData.baziString; 

        // 更新五行计数
        document.getElementById('metalCount').innerText = baziData.wuxingCounts.metal;
        document.getElementById('woodCount').innerText = baziData.wuxingCounts.wood;
        document.getElementById('waterCount').innerText = baziData.wuxingCounts.water;
        document.getElementById('fireCount').innerText = baziData.wuxingCounts.fire;
        document.getElementById('earthCount').innerText = baziData.wuxingCounts.earth;

        // 更新简要分析
        document.getElementById('analysisOutput').innerText = baziData.analysis;

    } catch (error) {
        console.error("八字计算或显示错误:", error);
        document.getElementById('baziOutput').innerText = "计算错误: " + error.message;
        document.getElementById('analysisOutput').innerText = "无法获取有效的八字信息。请检查输入的出生日期和时间，确保其在合理范围内。或联系管理员提供此错误信息。";
        // 清空五行计数
        document.getElementById('metalCount').innerText = '0';
        document.getElementById('woodCount').innerText = '0';
        document.getElementById('waterCount').innerText = '0';
        document.getElementById('fireCount').innerText = '0';
        document.getElementById('earthCount').innerText = '0';
    }
});