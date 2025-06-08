// script.js - 仅包含前端UI逻辑和八字计算分析逻辑
// 确保 lunar.js 文件已通过 <script src="lunar.js"></script> 在 index.html 中正确加载

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
        if (!eightChar || typeof eightChar.getHourGan !== 'function') {
            console.error('`eightChar` 对象无效或缺少方法:', eightChar); 
            throw new Error('无法获取有效的八字信息。请检查输入的出生日期和时间，确保其在合理范围内。');
        }

        // --- 八字计算和五行分析逻辑 (已整合到 script.js 中) ---
        const baziString = `${eightChar.getYearGan().getName()} ${eightChar.getYearZhi().getName()} ` +
                           `${eightChar.getMonthGan().getName()} ${eightChar.getMonthZhi().getName()} ` +
                           `${eightChar.getDayGan().getName()} ${eightChar.getDayZhi().getName()} ` +
                           `${eightChar.getTimeGan().getName()} ${eightChar.getTimeZhi().getName()}`;

        const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
        const pillars = eightChar.getEightChar(); // 获取八字四柱数组

        // 遍历四柱，统计天干和地支的五行
        for (const pillar of pillars) {
            // 天干的五行
            const ganFiveElement = pillar.getGan().getFiveElement().getName().toLowerCase();
            if (wuxingCounts.hasOwnProperty(ganFiveElement)) {
                wuxingCounts[ganFiveElement]++;
            }

            // 地支的五行（主气）
            const zhiFiveElement = pillar.getZhi().getFiveElement().getName().toLowerCase();
            if (wuxingCounts.hasOwnProperty(zhiFiveElement)) {
                wuxingCounts[zhiFiveElement]++;
            }

            // 考虑地支藏干的五行，这会使五行计数更准确和复杂
            // lunar.js 的 getHideGan() 方法返回一个数组，包含藏干对象
            const hideGans = pillar.getZhi().getHideGan();
            for (const hideGan of hideGans) {
                 const hideGanFiveElement = hideGan.getFiveElement().getName().toLowerCase();
                 if (wuxingCounts.hasOwnProperty(hideGanFiveElement)) {
                     wuxingCounts[hideGanFiveElement]++;
                 }
            }
        }
        
        let analysis = "您的八字五行分布如下：";
        analysis += `金 (${wuxingCounts.metal}个) `;
        analysis += `木 (${wuxingCounts.wood}个) `;
        analysis += `水 (${wuxingCounts.water}个) `;
        analysis += `火 (${wuxingCounts.fire}个) `;
        analysis += `土 (${wuxingCounts.earth}个)。`;

        // 简单分析示例 (您可以根据需要扩展这个逻辑)
        // 例如，如果某个五行特别多或特别少
        const totalElements = wuxingCounts.metal + wuxingCounts.wood + wuxingCounts.water + wuxingCounts.fire + wuxingCounts.earth;
        const average = totalElements / 5;
        let imbalances = [];

        for (const element in wuxingCounts) {
            if (wuxingCounts[element] > average * 1.5) { // 偏多
                imbalances.push(`${element}气偏旺`);
            } else if (wuxingCounts[element] < average * 0.5) { // 偏少
                imbalances.push(`${element}气偏弱`);
            }
        }

        if (imbalances.length > 0) {
            analysis += "\n根据五行强弱，您可能存在以下情况：" + imbalances.join("，") + "。";
        } else {
            analysis += "\n五行分布较为平衡。";
        }

        // --- 结束八字计算和五行分析逻辑 ---

        // 更新页面上的八字信息
        document.getElementById('baziOutput').innerText = baziString; 

        // 更新五行计数
        document.getElementById('metalCount').innerText = wuxingCounts.metal;
        document.getElementById('woodCount').innerText = wuxingCounts.wood;
        document.getElementById('waterCount').innerText = wuxingCounts.water;
        document.getElementById('fireCount').innerText = wuxingCounts.fire;
        document.getElementById('earthCount').innerText = wuxingCounts.earth;

        // 更新简要分析
        document.getElementById('analysisOutput').innerText = analysis;

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