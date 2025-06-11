function calculateBazi(eightChar, noHour, gender, lunar) {
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
    const symbols = [
        eightChar.getYearGan(), eightChar.getYearZhi(),
        eightChar.getMonthGan(), eightChar.getMonthZhi(),
        eightChar.getDayGan(), eightChar.getDayZhi()
    ];

    if (!noHour) {
        symbols.push(eightChar.getTimeGan(), eightChar.getTimeZhi());
    }

    for (const s of symbols) {
        const el = fiveElementMap[s];
        if (el) wuxingCounts[el]++;
    }

    let analysis = "";
    for (const k in wuxingCounts) {
        analysis += `${k}：${wuxingCounts[k]}个\n`;
    }

    const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
    const avg = total / 5;
    const imbalances = [];

    for (const k in wuxingCounts) {
        if (wuxingCounts[k] > avg * 1.5) {
            imbalances.push(`${k}偏旺`);
        } else if (wuxingCounts[k] < avg * 0.5) {
            imbalances.push(`${k}偏弱`);
        }
    }

    if (imbalances.length > 0) {
        analysis += `\n⚠️ 五行不均：${imbalances.join("，")}`;
    } else {
        analysis += `\n✅ 五行较为平衡`;
    }

    // 用神推荐
    const weakest = Object.entries(wuxingCounts).sort((a, b) => a[1] - b[1])[0][0];
    const nameDict = {
        wood: ['林', '森', '荣', '楠', '桐'],
        fire: ['炫', '炎', '煜', '烨', '烽'],
        water: ['涵', '涛', '润', '洁', '沛'],
        metal: ['鑫', '钧', '铭', '锋', '锐'],
        earth: ['坤', '垚', '均', '城', '培']
    };

    const nameAdvice = `建议起名偏向「${weakest}」五行，推荐字：${nameDict[weakest].join('、')}。`;

    // 性格推测（简单版本）
    const characterHintMap = {
        wood: "仁义直爽，重情重义。",
        fire: "热情外向，有领导力。",
        earth: "踏实可靠，注重现实。",
        metal: "果断刚毅，有正义感。",
        water: "聪明机智，思维活跃。"
    };
    const characterSummary = `您五行中“${weakest}”较弱，建议加强该方面特质培养。\n大致命格性格倾向：${characterHintMap[weakest]}`;

    return {
        wuxingCounts,
        analysis,
        nameAdvice,
        characterSummary
    };
}
