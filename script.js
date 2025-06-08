// script.js - 包含增强的调试日志
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
        // --- 添加调试日志 ---
        console.log('DEBUG: 开始计算，输入日期:', year, month, day, hour);

        const solar = Solar.fromYmdHms(year, month, day, hour, minute, second); // minute, second 需要定义
        // 定义 minute 和 second，默认为 0
        const minute = 0;
        const second = 0;
        // 重新定义 solar，确保 minute 和 second 存在
        const solarCorrected = Solar.fromYmdHms(year, month, day, hour, minute, second);
        console.log('DEBUG: Solar 对象:', solarCorrected);

        // 检查 solarCorrected 是否有效
        if (!solarCorrected || typeof solarCorrected.getLunar !== 'function') {
            console.error('`Solar` 对象无效或缺少方法:', solarCorrected);
            throw new Error('无法创建有效的公历日期对象。');
        }

        const lunar = solarCorrected.getLunar();
        console.log('DEBUG: Lunar 对象:', lunar);

        // 检查 lunar 是否有效
        if (!lunar || typeof lunar.getEightChar !== 'function') {
            console.error('`Lunar` 对象无效或缺少方法:', lunar);
            throw new Error('无法获取有效的农历信息。');
        }

        const eightChar = lunar.getEightChar();
        console.log('DEBUG: EightChar 对象:', eightChar);

        // **增强的八字对象检查**
        // 检查 eightChar 是否存在，并且它是否具有 getHourGan 方法（作为有效性的一个标志）
        if (!eightChar || typeof eightChar.getHourGan !== 'function') {
            // 在这里将八字对象打印到控制台，这对于调试非常重要！
            console.error('`eightChar` 对象无效或缺少方法:', eightChar);
            throw new Error('无法获取有效的八字信息。请检查输入的出生日期和时间，确保其在合理范围内。或联系管理员提供此错误信息。');
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
        document.getElementById('analysisOutput').innerText = baziData.analysisString;

    } catch (error) {
        console.error('八字计算或显示错误:', error);
        document.getElementById('baziOutput').innerText = '计算错误: ' + error.message;
        document.getElementById('analysisOutput').innerText = '请检查输入信息或联系管理员。';
        // 清空五行计数
        document.getElementById('metalCount').innerText = '0';
        document.getElementById('woodCount').innerText = '0';
        document.getElementById('waterCount').innerText = '0';
        document.getElementById('fireCount').innerText = '0';
        document.getElementById('earthCount').innerText = '0';
    }
});

// 添加对 minute 和 second 的默认定义，以防止 Solar.fromYmdHms 接收 undefined
// 如果你的 HTML input 只有 hour，那么 minute 和 second 默认为 0
// 如果你的 HTML 中有对应的 minute 和 second 输入框，则需要从那里获取值
// const minuteInput = document.getElementById('minute') ? document.getElementById('minute').value : '0';
// const secondInput = document.getElementById('second') ? document.getElementById('second').value : '0';
// const minute = parseInt(minuteInput);
// const second = parseInt(secondInput);

// Google 翻译初始化代码（保留）
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'zh-CN',
        autoDisplay: false
    }, 'google_translate_element');
}