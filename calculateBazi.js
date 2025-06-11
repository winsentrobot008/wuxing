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

    // 五行详细说明
    const fiveElementDetails = {
        metal: {
            name: '金',
            character: '刚毅果断，正义感强，重视纪律和原则，行事干脆利落。',
            health: '注意呼吸系统（如肺部）和皮肤健康，避免过度劳累。',
            career: '适合金融、法律、工程、军事、管理等需要精准和决断的职业。'
        },
        wood: {
            name: '木',
            character: '仁慈善良，富有创造力，喜欢探索和成长，适应力强。',
            health: '关注肝胆健康，避免情绪压抑，保持规律作息。',
            career: '适合教育、设计、文学、环保、农业等需要创新和关怀的职业。'
        },
        water: {
            name: '水',
            character: '聪明机智，思维灵活，善于沟通，适应变化快。',
            health: '注意肾脏和泌尿系统健康，避免过度消耗精力。',
            career: '适合贸易、传媒、咨询、航运、科技等需要流动性和沟通的职业。'
        },
        fire: {
            name: '火',
            character: '热情奔放，富有领导力，乐观外向，感染力强。',
            health: '关注心血管和眼睛健康，避免情绪激动和高温环境。',
            career: '适合营销、娱乐、能源、教育、餐饮等需要活力和表达的职业。'
        },
        earth: {
            name: '土',
            character: '踏实稳重，诚信可靠，善于规划，注重安全感。',
            health: '注意脾胃和消化系统健康，避免湿气和饮食不规律。',
            career: '适合房地产、建筑、农业、物流、行政等需要稳定和组织的职业。'
        }
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
        analysis += `${fiveElementDetails[k].name}：${wuxingCounts[k]}个\n`;
    }

    const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
    const avg = total / 5;
    const imbalances = [];

    for (const k in wuxingCounts) {
        if (wuxingCounts[k] > avg * 1.5) {
            imbalances.push(`${fiveElementDetails[k].name}偏旺`);
        } else if (wuxingCounts[k] < avg * 0.5) {
            imbalances.push(`${fiveElementDetails[k].name}偏弱`);
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

    const nameAdvice = `建议起名偏向「${fiveElementDetails[weakest].name}」五行，推荐字：${nameDict[weakest].join('、')}。`;

    // 性格推测（简单版本）
    const characterHintMap = {
        wood: "仁义直爽，重情重义。",
        fire: "热情外向，有领导力。",
        earth: "踏实可靠，注重现实。",
        metal: "果断刚毅，有正义感。",
        water: "聪明机智，思维活跃。"
    };
    const characterSummary = `您五行中“${fiveElementDetails[weakest].name}”较弱，建议加强该方面特质培养。\n大致命格性格倾向：${characterHintMap[weakest]}`;

    return {
        wuxingCounts,
        analysis,
        nameAdvice,
        characterSummary,
        fiveElementDetails // 返回五行详细说明
    };
}