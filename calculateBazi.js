// calculateBazi.js - 包含八字字符串生成和五行计数分析的逻辑
// 确保 lunar.js 在此文件之前加载，以便 Solar, Lunar, EightChar 对象可用

function calculateBazi(eightChar) {
    // 生成八字字符串
    const baziString = `${eightChar.getYearGan().getName()} ${eightChar.getYearZhi().getName()} ` +
                       `${eightChar.getMonthGan().getName()} ${eightChar.getMonthZhi().getName()} ` +
                       `${eightChar.getDayGan().getName()} ${eightChar.getDayZhi().getName()} ` +
                       `${eightChar.getTimeGan().getName()} ${eightChar.getTimeZhi().getName()}`;

    // 初始化五行计数
    const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    const pillars = eightChar.getEightChar(); // 获取八字四柱数组

    // 遍历四柱，统计天干、地支主气和藏干的五行
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

        // 考虑地支藏干的五行
        const hideGans = pillar.getZhi().getHideGan();
        for (const hideGan of hideGans) {
             const hideGanFiveElement = hideGan.getFiveElement().getName().toLowerCase();
             if (wuxingCounts.hasOwnProperty(hideGanFiveElement)) {
                 wuxingCounts[hideGanFiveElement]++;
             }
        }
    }
    
    // 生成简要分析
    let analysis = "您的八字五行分布如下：";
    analysis += `金 (${wuxingCounts.metal}个) `;
    analysis += `木 (${wuxingCounts.wood}个) `;
    analysis += `水 (${wuxingCounts.water}个) `;
    analysis += `火 (${wuxingCounts.fire}个) `;
    analysis += `土 (${wuxingCounts.earth}个)。`;

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

    // 返回八字字符串、五行计数和分析结果
    return { baziString, wuxingCounts, analysis };
}