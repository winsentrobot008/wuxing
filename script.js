// script.js - 仅包含前端UI逻辑，不包含lunar.js或calculateBazi.js的完整代码
// script.js - Contains only frontend UI logic, no full lunar.js or calculateBazi.js code

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
        // 使用lunar.js和calculateBazi.js进行计算
        // 确保lunar.js和calculateBazi.js已在index.html中正确加载
        // Solar, Lunar, EightChar 对象由 lunar.js 全局暴露
        const solar = Solar.fromYmdHms(
            year,
            month,
            day,
            hour,
            0, // 分钟，根据您的需求可以从输入获取
            0  // 秒，根据您的需求可以从输入获取
        );

        // 获取Lunar对象
        const lunar = solar.getLunar();
        
        // 获取EightChar对象
        const eightChar = lunar.getEightChar();

        // 检查 eightChar 是否成功获取
        if (!eightChar) {
            // 如果 eightChar 为空或无效，抛出错误
            throw new Error('无法获取八字信息，请检查输入的日期和时间是否有效且在合理范围内。');
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
        console.error('八字计算或显示错误:', error);
        alert('计算失败，请检查输入或联系管理员。\n错误详情: ' + error.message);
        document.getElementById('baziOutput').innerText = '计算失败';
        document.getElementById('analysisOutput').innerText = '计算失败';
    }
});