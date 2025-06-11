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

    // 纳音五行表（来自 lunar.js）
    const nayins = [
        lunar.getYearNaYin(),
        lunar.getMonthNaYin(),
        lunar.getDayNaYin(),
        noHour ? '(未知)' : lunar.getTimeNaYin()
    ];
    const nayinTable = `
    年柱：${nayins[0]}  
    月柱：${nayins[1]}  
    日柱：${nayins[2]}  
    时柱：${nayins[3]}`;

    // 日主五行分析
    const riGan = eightChar.getDayGan();
    const riElement = fiveElementMap[riGan];

    // 喜用神推断（简单版本，后续可升级）
    const selfCount = wuxingCounts[riElement];
    const strong = selfCount >= 2; // 粗略判断
    let usefulElement = "";

    // 喜用神推断逻辑（简化版）
    const elementControl = {
        wood: { 克我: 'metal', 生我: 'water', 我生: 'fire', 我克: 'earth' },
        fire: { 克我: 'water', 生我: 'wood', 我生: 'earth', 我克: 'metal' },
        earth: { 克我: 'wood', 生我: 'fire', 我生: 'metal', 我克: 'water' },
        metal: { 克我: 'fire', 生我: 'earth', 我生: 'water', 我克: 'wood' },
        water: { 克我: 'earth', 生我: 'metal', 我生: 'wood', 我克: 'fire' }
    };

    if (strong) {
        usefulElement = elementControl[riElement]['我生']; // 泄秀
    } else {
        usefulElement = elementControl[riElement]['生我']; // 得生
    }

    const yongshenAdvice = `您的日主为【${riGan}】，五行属【${riElement}】，属于“${strong ? "身强" : "身弱"}”之命。<br>
推荐喜用神方向：${usefulElement} → 宜补此五行助运。`;

    const nameDict = {
        wood: ['林', '森', '荣', '楠', '桐'],
        fire: ['炫', '炎', '煜', '烨', '烽'],
        water: ['涵', '涛', '润', '洁', '沛'],
        metal: ['鑫', '钧', '铭', '锋', '锐'],
        earth: ['坤', '垚', '均', '城', '培']
    };

    const nameAdvice = `推荐用神五行为：${usefulElement}，适合名字偏向：${nameDict[usefulElement].join('、')}。`;

    const characterHintMap = {
        wood: "仁义直爽，重情重义。",
        fire: "热情外向，有领导力。",
        earth: "踏实可靠，注重现实。",
        metal: "果断刚毅，有正义感。",
        water: "聪明机智，思维活跃。"
    };
    const characterSummary = `您命中偏向“${riElement}”，喜用神为“${usefulElement}”，宜培养此方面人格。\n性格倾向：${characterHintMap[riElement]}`;

    return {
        wuxingCounts,
        analysis,
        nameAdvice,
        characterSummary,
        nayinTable,
        yongshenAdvice
    };
}
