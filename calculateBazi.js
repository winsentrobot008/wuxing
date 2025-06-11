// calculateBazi.js - 生成八字字符串，并分析五行分布（兼容字符串形式的干支）

function calculateBazi(eightChar) {
    // 生成八字字符串
    const baziString = `${eightChar.getYearGan()} ${eightChar.getYearZhi()} ` +
                       `${eightChar.getMonthGan()} ${eightChar.getMonthZhi()} ` +
                       `${eightChar.getDayGan()} ${eightChar.getDayZhi()} ` +
                       `${eightChar.getTimeGan()} ${eightChar.getTimeZhi()}`;

    // 五行对应关系表
    const fiveElementMap = {
        '甲': 'wood', '乙': 'wood',
        '丙': 'fire', '丁': 'fire',
        '戊': 'earth', '己': 'earth',
        '庚': 'metal', '辛': 'metal',
        '壬': 'water', '癸': 'water',
        '子': 'water', '丑': 'earth',
        '寅': 'wood', '卯': 'wood',
        '辰': 'earth', '巳': 'fire',
        '午': 'fire', '未': 'earth',
        '申': 'metal', '酉': 'metal',
        '戌': 'earth', '亥': 'water'
    };

    // 初始化五行计数
    const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

    // 统计天干地支的五行
    const pillars = [
        eightChar.getYearGan(), eightChar.getYearZhi(),
        eightChar.getMonthGan(), eightChar.getMonthZhi(),
        eightChar.getDayGan(), eightChar.getDayZhi(),
        eightChar.getTimeGan(), eightChar.getTimeZhi()
    ];

    for (const symbol of pillars) {
        const element = fiveElementMap[symbol];
        if (element && wuxingCounts.hasOwnProperty(element)) {
            wuxingCounts[element]++;
        }
    }

    // 生成分析文本
    let analysis = "您的八字五行分布如下：";
    analysis += `金 (${wuxingCounts.metal}个) `;
    analysis += `木 (${wuxingCounts.wood}个) `;
    analysis += `水 (${wuxingCounts.water}个) `;
    analysis += `火 (${wuxingCounts.fire}个) `;
    analysis += `土 (${wuxingCounts.earth}个)。`;

    const total = Object.values(wuxingCounts).reduce((sum, v) => sum + v, 0);
    const average = total / 5;
    const imbalances = [];

    for (const key in wuxingCounts) {
        if (wuxingCounts[key] > average * 1.5) {
            imbalances.push(`${key}气偏旺`);
        } else if (wuxingCounts[key] < average * 0.5) {
            imbalances.push(`${key}气偏弱`);
        }
    }

    if (imbalances.length > 0) {
        analysis += "\n根据五行强弱，您可能存在以下情况：" + imbalances.join("，") + "。";
    } else {
        analysis += "\n五行分布较为平衡。";
    }

    return { baziString, wuxingCounts, analysis };
}
