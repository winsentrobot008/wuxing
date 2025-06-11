// calculateBazi.js - 包含八字字符串生成和五行计数分析的逻辑
// 确保 lunar.js 在此文件之前加载，以便 Solar, Lunar, EightChar 对象可用

function calculateBazi(eightChar) {
    // 生成八字字符串（不再调用 getName()，直接获取字符串）
    const baziString = `${eightChar.getYearGan()} ${eightChar.getYearZhi()} ` +
                       `${eightChar.getMonthGan()} ${eightChar.getMonthZhi()} ` +
                       `${eightChar.getDayGan()} ${eightChar.getDayZhi()} ` +
                       `${eightChar.getTimeGan()} ${eightChar.getTimeZhi()}`;

    // 初始化五行计数
    const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

    // 辅助函数：根据天干或地支的五行加计数
    function countElement(elementObj) {
        const element = elementObj.getFiveElement().getName().toLowerCase();
        if (wuxingCounts.hasOwnProperty(element)) {
            wuxingCounts[element]++;
        }
    }

    // 统计年柱
    countElement(eightChar.getYearGan());
    countElement(eightChar.getYearZhi());
    eightChar.getYearZhi().getHideGan().forEach(countElement);

    // 统计月柱
    countElement(eightChar.getMonthGan());
    countElement(eightChar.getMonthZhi());
    eightChar.getMonthZhi().getHideGan().forEach(countElement);

    // 统计日柱
    countElement(eightChar.getDayGan());
    countElement(eightChar.getDayZhi());
    eightChar.getDayZhi().getHideGan().forEach(countElement);

    // 统计时柱
    countElement(eightChar.getTimeGan());
    countElement(eightChar.getTimeZhi());
    eightChar.getTimeZhi().getHideGan().forEach(countElement);

    // 生成简要分析
    let analysis = "您的八字五行分布如下：";
    analysis += `金 (${wuxingCounts.metal}个) `;
    analysis += `木 (${wuxingCounts.wood}个) `;
    analysis += `水 (${wuxingCounts.water}个) `;
    analysis += `火 (${wuxingCounts.fire}个) `;
    analysis += `土 (${wuxingCounts.earth}个)。`;

    const totalElements = Object.values(wuxingCounts).reduce((sum, val) => sum + val, 0);
    const average = totalElements / 5;
    let imbalances = [];

    for (const element in wuxingCounts) {
        if (wuxingCounts[element] > average * 1.5) {
            imbalances.push(`${element}气偏旺`);
        } else if (wuxingCounts[element] < average * 0.5) {
            imbalances.push(`${element}气偏弱`);
        }
    }

    if (imbalances.length > 0) {
        analysis += "\n根据五行强弱，您可能存在以下情况：" + imbalances.join("，") + "。";
    } else {
        analysis += "\n五行分布较为平衡。";
    }

    // 返回八字字符串、五行计数和分析结果
    return { baziString, wuxingCounts, analysis };
}
