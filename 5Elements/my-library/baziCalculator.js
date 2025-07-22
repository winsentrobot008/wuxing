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

        // 使用受保护库中的函数进行深入分析
        const balanceDegree = calculateBalanceDegree(wuxingCounts);
        const wuxingAdvice = giveWuxingAdvice(balanceDegree);
        const detailedAdvice = giveDetailedAdjustmentAdvice(balanceDegree);
        const fortunePrediction = simpleFortunePrediction(wuxingCounts);

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

module.exports = {
    calculateBazi,
    fiveElementMap,
    elementNameMap
}; 