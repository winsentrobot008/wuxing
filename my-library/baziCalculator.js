// 八字计算的核心逻辑
const {
    calculateBalanceDegree,
    giveWuxingAdvice,
    giveDetailedAdjustmentAdvice,
    simpleFortunePrediction,
    analyzeNameWuxing,
    analyzeNameBaziCompatibility
} = require('./myCustomLibrary.js');

// 核心的五行映射表
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

// 中文五行名称映射
const elementNameMap = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水'
};

function calculateBazi(eightChar, noHour, gender, lunar, userName) {
    try {
        // 计算八字五行
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

        // 基础分析
        let analysis = "";
        for (const k in wuxingCounts) {
            analysis += `${k}: ${wuxingCounts[k]} 个\n`;
        }

        // 性别特定的五行分析
        const genderSpecificAnalysis = getGenderSpecificAnalysis(wuxingCounts, gender, eightChar);
        analysis += `\n👤 性别特定分析 (${gender === 'male' ? '男性' : '女性'}):\n${genderSpecificAnalysis}`;

        // 五行平衡分析
        const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
        const avg = total / 5;
        const imbalances = [];

        for (const k in wuxingCounts) {
            if (wuxingCounts[k] > avg * 1.5) {
                imbalances.push(`${k} 偏强`);
            } else if (wuxingCounts[k] < avg * 0.5) {
                imbalances.push(`${k} 偏弱`);
            }
        }

        if (imbalances.length > 0) {
            analysis += `\n⚠️ 五行失衡: ${imbalances.join(", ")}`;
        } else {
            analysis += `\n✅ 五行相对平衡`;
        }

        // 纳音五行
        const nayins = [
            lunar.getYearNaYin(),
            lunar.getMonthNaYin(),
            lunar.getDayNaYin(),
            noHour ? '(未知)' : lunar.getTimeNaYin()
        ];
        const nayinTable = `
年柱: ${nayins[0]}
月柱: ${nayins[1]}
日柱: ${nayins[2]}
时柱: ${nayins[3]}`;

        // 使用受保护库中的函数进行深入分析（加入性别因素）
        const balanceDegree = calculateBalanceDegree(wuxingCounts);
        const wuxingAdvice = giveWuxingAdvice(balanceDegree);
        const detailedAdvice = giveDetailedAdjustmentAdvice(balanceDegree);
        const fortunePrediction = getGenderSpecificFortune(wuxingCounts, gender);

        // 姓名分析
        let nameAnalysis = null;
        let nameCompatibility = null;
        if (userName) {
            nameAnalysis = analyzeNameWuxing(userName);
            if (nameAnalysis) {
                nameCompatibility = analyzeNameBaziCompatibility(nameAnalysis, wuxingCounts);
            }
        }

        // 返回完整的分析结果
        return {
            wuxingCounts,
            analysis,
            nayinTable,
            wuxingAdvice,
            detailedAdvice,
            fortunePrediction,
            nameAnalysis: nameAnalysis ? {
                wuxing: nameAnalysis.nameWuxing.map(item => ({
                    char: item.char,
                    element: elementNameMap[item.element]
                })),
                compatibility: nameCompatibility
            } : null
        };
    } catch (error) {
        console.error('八字计算出错：', error);
        throw new Error(`八字计算失败：${error.message}`);
    }
}

// 新增：性别特定分析函数
function getGenderSpecificAnalysis(wuxingCounts, gender, eightChar) {
    const dayGan = eightChar.getDayGan(); // 日干代表本人
    const dayGanElement = fiveElementMap[dayGan];
    
    let analysis = "";
    
    // 添加传统八字学性别差异概念介绍
    analysis += "🔮 传统八字学性别差异分析：\n";
    analysis += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    // 1. 大运排列差异
    analysis += "📈 大运排列：";
    if (gender === 'male') {
        analysis += "男性阳年生人顺排大运，阴年生人逆排大运\n";
        analysis += "   → 您的大运走向会影响人生各阶段的发展轨迹\n";
    } else {
        analysis += "女性阳年生人逆排大运，阴年生人顺排大运\n";
        analysis += "   → 您的大运排列与男性相反，体现阴阳互补原理\n";
    }
    
    // 2. 用神喜忌差异
    analysis += "⚖️ 用神喜忌：";
    if (gender === 'male') {
        analysis += "男性以官杀为事业星，财星为妻财\n";
        if (dayGanElement === 'wood') {
            analysis += "   → 您日干属木，金为官杀（事业），土为财星（财富）\n";
        } else if (dayGanElement === 'fire') {
            analysis += "   → 您日干属火，水为官杀（事业），金为财星（财富）\n";
        } else if (dayGanElement === 'earth') {
            analysis += "   → 您日干属土，木为官杀（事业），水为财星（财富）\n";
        } else if (dayGanElement === 'metal') {
            analysis += "   → 您日干属金，火为官杀（事业），木为财星（财富）\n";
        } else {
            analysis += "   → 您日干属水，土为官杀（事业），火为财星（财富）\n";
        }
    } else {
        analysis += "女性以官杀为夫星，食伤为子女星\n";
        if (dayGanElement === 'wood') {
            analysis += "   → 您日干属木，金为夫星（配偶），火为子女星\n";
        } else if (dayGanElement === 'fire') {
            analysis += "   → 您日干属火，水为夫星（配偶），土为子女星\n";
        } else if (dayGanElement === 'earth') {
            analysis += "   → 您日干属土，木为夫星（配偶），金为子女星\n";
        } else if (dayGanElement === 'metal') {
            analysis += "   → 您日干属金，火为夫星（配偶），水为子女星\n";
        } else {
            analysis += "   → 您日干属水，土为夫星（配偶），木为子女星\n";
        }
    }
    
    // 3. 运势解读差异
    analysis += "🎯 运势侧重：";
    if (gender === 'male') {
        analysis += "男性重事业成就、社会地位、财富积累\n";
        if (wuxingCounts.metal > 2) {
            analysis += "   → 金旺：决断力强，适合管理、技术、金融领域发展\n";
        } else if (wuxingCounts.wood > 2) {
            analysis += "   → 木旺：创新能力强，适合文教、医疗、环保行业\n";
        } else if (wuxingCounts.water > 2) {
            analysis += "   → 水旺：智慧过人，适合贸易、咨询、流通行业\n";
        } else if (wuxingCounts.fire > 2) {
            analysis += "   → 火旺：热情积极，适合销售、娱乐、电子行业\n";
        } else {
            analysis += "   → 土旺：稳重踏实，适合房地产、农业、建筑行业\n";
        }
    } else {
        analysis += "女性重感情和谐、家庭幸福、子女教育\n";
        if (wuxingCounts.water > 2) {
            analysis += "   → 水旺：感情细腻，善于处理人际关系，直觉敏锐\n";
        } else if (wuxingCounts.fire > 2) {
            analysis += "   → 火旺：性格开朗，魅力十足，社交能力强\n";
        } else if (wuxingCounts.earth > 2) {
            analysis += "   → 土旺：温和包容，善于持家，家庭责任感强\n";
        } else if (wuxingCounts.wood > 2) {
            analysis += "   → 木旺：温柔体贴，富有同情心，适合教育工作\n";
        } else {
            analysis += "   → 金旺：理性独立，品味高雅，追求完美\n";
        }
    }
    
    // 4. 婚姻分析差异
    analysis += "💕 婚姻分析：";
    if (gender === 'male') {
        analysis += "男性看财星为妻，官杀为竞争对手\n";
        const wifeElement = getWifeElement(dayGanElement);
        analysis += `   → 您的妻星为${wifeElement}，代表理想配偶的性格特质\n`;
        analysis += "   → 财星旺则妻贤内助，财星弱则需要主动追求\n";
    } else {
        analysis += "女性看官杀为夫，比劫为情敌\n";
        const husbandElement = getHusbandElement(dayGanElement);
        analysis += `   → 您的夫星为${husbandElement}，代表理想配偶的性格特质\n`;
        analysis += "   → 官星旺则夫君有为，官星弱则感情路较曲折\n";
    }
    
    analysis += "\n💡 想了解更详细的大运流年分析吗？\n";
    analysis += "💡 想知道您的最佳配偶类型吗？\n";
    analysis += "💡 想了解您的事业发展最佳时机吗？\n";
    
    return analysis;
}

// 辅助函数：获取妻星元素
function getWifeElement(dayGanElement) {
    const wifeElementMap = {
        'wood': '土（稳重踏实型）',
        'fire': '金（理性独立型）', 
        'earth': '水（智慧灵动型）',
        'metal': '木（温柔体贴型）',
        'water': '火（热情开朗型）'
    };
    return wifeElementMap[dayGanElement] || '未知';
}

// 辅助函数：获取夫星元素
function getHusbandElement(dayGanElement) {
    const husbandElementMap = {
        'wood': '金（果断坚毅型）',
        'fire': '水（智慧沉稳型）',
        'earth': '木（温和上进型）', 
        'metal': '火（热情积极型）',
        'water': '土（稳重可靠型）'
    };
    return husbandElementMap[dayGanElement] || '未知';
}

// 新增：性别特定运势预测
function getGenderSpecificFortune(wuxingCounts, gender) {
    const dominantElement = Object.keys(wuxingCounts).reduce((a, b) => 
        wuxingCounts[a] > wuxingCounts[b] ? a : b
    );
    
    let fortune = '';
    
    if (gender === 'male') {
        switch (dominantElement) {
            case 'wood':
                fortune = '近期事业发展有新机遇，领导力得到认可，但需注意与同事关系的协调。';
                break;
            case 'fire':
                fortune = '工作热情高涨，创新能力强，适合开拓新项目，但要控制脾气避免冲突。';
                break;
            case 'earth':
                fortune = '稳扎稳打的时期，适合积累资源和人脉，投资理财需谨慎保守。';
                break;
            case 'metal':
                fortune = '决断力强，适合做重要决策，技能提升明显，但需注意过于严苛。';
                break;
            case 'water':
                fortune = '智慧运佳，适合学习新知识，人际关系融洽，但要防止优柔寡断。';
                break;
        }
    } else {
        switch (dominantElement) {
            case 'wood':
                fortune = '感情生活和谐，创造力旺盛，适合艺术创作，注意情绪管理。';
                break;
            case 'fire':
                fortune = '魅力四射，社交活跃，感情运势上升，但要避免过度消耗精力。';
                break;
            case 'earth':
                fortune = '家庭运势良好，适合置业安家，理财能力强，生活稳定幸福。';
                break;
            case 'metal':
                fortune = '理性思维强，适合精细工作，品味提升，但需注意过于挑剔。';
                break;
            case 'water':
                fortune = '直觉敏锐，适合从事咨询、教育工作，感情深度发展，注意情绪波动。';
                break;
        }
    }
    
    return fortune;
}

module.exports = {
    calculateBazi,
    fiveElementMap,
    elementNameMap
};