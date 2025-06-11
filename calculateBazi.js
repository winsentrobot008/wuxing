function calculateBazi(eightChar, noHour) {
    const baziString = `${eightChar.getYearGan()} ${eightChar.getYearZhi()} ` +
                       `${eightChar.getMonthGan()} ${eightChar.getMonthZhi()} ` +
                       `${eightChar.getDayGan()} ${eightChar.getDayZhi()} ` +
                       `${noHour ? "(未知)" : (eightChar.getTimeGan() + " " + eightChar.getTimeZhi())}`;

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

    const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    const pillars = [
        eightChar.getYearGan(), eightChar.getYearZhi(),
        eightChar.getMonthGan(), eightChar.getMonthZhi(),
        eightChar.getDayGan(), eightChar.getDayZhi()
    ];

    if (!noHour) {
        pillars.push(eightChar.getTimeGan(), eightChar.getTimeZhi());
    }

    for (const symbol of pillars) {
        const element = fiveElementMap[symbol];
        if (element && wuxingCounts.hasOwnProperty(element)) {
            wuxingCounts[element]++;
        }
    }

    let analysis = "您的八字五行分布如下：";
    analysis += `金 (${wuxingCounts.metal}个) `;
    analysis += `木 (${wuxingCounts.wood}个) `;
    analysis += `水 (${wuxingCounts.water}个) `;
    analysis += `火 (${wuxingCounts.fire}个) `;
    analysis += `土 (${wuxingCounts.earth}个)。`;

    const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
    const avg = total / 5;
    const imbalances = [];

    for (const key in wuxingCounts) {
        if (wuxingCounts[key] > avg * 1.5) {
            imbalances.push(`${key}气偏旺`);
        } else if (wuxingCounts[key] < avg * 0.5) {
            imbalances.push(`${key}气偏弱`);
        }
    }

    if (imbalances.length > 0) {
        analysis += "\n根据五行强弱，您可能存在以下情况：" + imbalances.join("，") + "。";
    } else {
        analysis += "\n五行分布较为平衡。";
    }

    const nameDict = {
        wood: ['林', '森', '杉', '楠', '荣'],
        fire: ['炎', '炫', '熙', '烨', '煜'],
        water: ['涵', '洁', '沛', '涛', '润'],
        metal: ['鑫', '钧', '锐', '锋', '铭'],
        earth: ['坤', '城', '培', '均', '垚']
    };

    const weakest = Object.entries(wuxingCounts).sort((a, b) => a[1] - b[1])[0];
    const recommendWords = nameDict[weakest[0]] || ['宁', '安', '乐'];

    const nameAdvice = `根据分析，您的“${weakest[0]}”元素较少，建议起名时可选偏向「${weakest[0]}」的字，例如：\n` +
                       recommendWords.join('、') + '。';

    return { baziString, wuxingCounts, analysis, nameAdvice };
}
