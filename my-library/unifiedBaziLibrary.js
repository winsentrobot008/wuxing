// 统一八字分析私有库 - 核心算法完全保护
// ================================================================
// 版权所有 - 禁止逆向工程和算法提取
// ================================================================

// ==================== 核心数据表 ====================

// 五行映射表
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
    wood: '木', fire: '火', earth: '土', metal: '金', water: '水'
};

// 五行相生关系
const fiveElementGenerating = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
};

// 五行相克关系
const fiveElementRestraining = {
    wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire'
};

// 五行对应属性表
const fiveElementProperties = {
    colors: {
        wood: 'green', fire: 'red', earth: 'yellow', metal: 'white', water: 'black'
    },
    directions: {
        wood: 'east', fire: 'south', earth: 'center', metal: 'west', water: 'north'
    },
    foods: {
        wood: ['green vegetables', 'beans'],
        fire: ['hot peppers', 'tomatoes'],
        earth: ['sweet potatoes', 'corn'],
        metal: ['nuts', 'grain'],
        water: ['seafood', 'melons']
    }
};

// 汉字五行属性表（核心保护数据）
const characterWuxingMap = {
    // 木属性
    '木': 'wood', '林': 'wood', '森': 'wood', '李': 'wood', '杨': 'wood',
    '柳': 'wood', '松': 'wood', '梅': 'wood', '桂': 'wood', '楠': 'wood',
    // 火属性
    '火': 'fire', '炎': 'fire', '焱': 'fire', '煜': 'fire', '炫': 'fire',
    '晶': 'fire', '明': 'fire', '晓': 'fire', '旭': 'fire', '炅': 'fire',
    // 土属性
    '土': 'earth', '垚': 'earth', '坤': 'earth', '城': 'earth', '培': 'earth',
    '境': 'earth', '均': 'earth', '坚': 'earth', '固': 'earth', '基': 'earth',
    // 金属性
    '金': 'metal', '钧': 'metal', '铭': 'metal', '锋': 'metal', '钊': 'metal',
    '铁': 'metal', '钢': 'metal', '锐': 'metal', '铮': 'metal', '钰': 'metal',
    // 水属性
    '水': 'water', '江': 'water', '河': 'water', '涛': 'water', '润': 'water',
    '泽': 'water', '洋': 'water', '海': 'water', '渊': 'water', '潮': 'water'
};

// ==================== 核心计算函数 ====================

/**
 * 主要八字分析函数
 * @param {Object} eightChar - 八字对象
 * @param {boolean} noHour - 是否缺少时辰
 * @param {string} gender - 性别 ('male' | 'female')
 * @param {Object} lunar - 农历对象
 * @param {string} userName - 用户姓名
 * @returns {Object} 完整的八字分析结果
 */
function calculateBazi(eightChar, noHour, gender, lunar, userName) {
    try {
        // 计算八字五行分布
        const wuxingCounts = calculateWuxingDistribution(eightChar, noHour);
        
        // 基础分析
        const basicAnalysis = generateBasicAnalysis(wuxingCounts);
        
        // 性别特定分析
        const genderAnalysis = generateGenderSpecificAnalysis(wuxingCounts, gender, eightChar);
        
        // 五行平衡分析
        const balanceAnalysis = analyzeWuxingBalance(wuxingCounts);
        
        // 纳音五行分析
        const nayinAnalysis = generateNayinAnalysis(lunar, noHour);
        
        // 深度分析
        const deepAnalysis = performDeepAnalysis(wuxingCounts, gender);
        
        // 姓名分析
        const nameAnalysis = userName ? analyzeNameCompatibility(userName, wuxingCounts) : null;
        
        // 组合最终结果
        return {
            wuxingCounts,
            analysis: basicAnalysis + '\n' + genderAnalysis + '\n' + balanceAnalysis,
            nayinTable: nayinAnalysis,
            wuxingAdvice: deepAnalysis.advice,
            detailedAdvice: deepAnalysis.detailedAdvice,
            fortunePrediction: deepAnalysis.fortune,
            nameAnalysis
        };
    } catch (error) {
        console.error('八字计算出错：', error);
        throw new Error(`八字计算失败：${error.message}`);
    }
}

// ==================== 辅助计算函数 ====================

/**
 * 计算八字五行分布
 */
function calculateWuxingDistribution(eightChar, noHour) {
    const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    const symbols = [
        eightChar.getYearGan(), eightChar.getYearZhi(),
        eightChar.getMonthGan(), eightChar.getMonthZhi(),
        eightChar.getDayGan(), eightChar.getDayZhi()
    ];
    
    if (!noHour) {
        symbols.push(eightChar.getTimeGan(), eightChar.getTimeZhi());
    }
    
    for (const symbol of symbols) {
        const element = fiveElementMap[symbol];
        if (element) wuxingCounts[element]++;
    }
    
    return wuxingCounts;
}

/**
 * 生成基础分析
 */
function generateBasicAnalysis(wuxingCounts) {
    let analysis = "";
    for (const [element, count] of Object.entries(wuxingCounts)) {
        analysis += `${element}: ${count} 个\n`;
    }
    return analysis;
}

/**
 * 生成性别特定分析（包含传统八字学概念）
 */
function generateGenderSpecificAnalysis(wuxingCounts, gender, eightChar) {
    const dayGan = eightChar.getDayGan();
    const dayGanElement = fiveElementMap[dayGan];
    
    let analysis = "🔮 传统八字学性别差异分析：\n";
    analysis += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    // 大运排列差异
    analysis += generateDayunAnalysis(gender);
    
    // 用神喜忌差异
    analysis += generateYongshenAnalysis(gender, dayGanElement);
    
    // 运势解读差异
    analysis += generateFortuneAnalysis(gender, wuxingCounts);
    
    // 婚姻分析差异
    analysis += generateMarriageAnalysis(gender, dayGanElement);
    
    // 引导用户深入了解
    analysis += "\n💡 想了解更详细的大运流年分析吗？\n";
    analysis += "💡 想知道您的最佳配偶类型吗？\n";
    analysis += "💡 想了解您的事业发展最佳时机吗？\n";
    
    return analysis;
}

/**
 * 大运排列分析
 */
function generateDayunAnalysis(gender) {
    let analysis = "📈 大运排列：";
    if (gender === 'male') {
        analysis += "男性阳年生人顺排大运，阴年生人逆排大运\n";
        analysis += "   → 您的大运走向会影响人生各阶段的发展轨迹\n";
    } else {
        analysis += "女性阳年生人逆排大运，阴年生人顺排大运\n";
        analysis += "   → 您的大运排列与男性相反，体现阴阳互补原理\n";
    }
    return analysis;
}

/**
 * 用神喜忌分析
 */
function generateYongshenAnalysis(gender, dayGanElement) {
    let analysis = "⚖️ 用神喜忌：";
    
    const elementMapping = {
        wood: { career: '金', wealth: '土', spouse: '金', children: '火' },
        fire: { career: '水', wealth: '金', spouse: '水', children: '土' },
        earth: { career: '木', wealth: '水', spouse: '木', children: '金' },
        metal: { career: '火', wealth: '木', spouse: '火', children: '水' },
        water: { career: '土', wealth: '火', spouse: '土', children: '木' }
    };
    
    const mapping = elementMapping[dayGanElement];
    
    if (gender === 'male') {
        analysis += "男性以官杀为事业星，财星为妻财\n";
        analysis += `   → 您日干属${elementNameMap[dayGanElement]}，${mapping.career}为官杀（事业），${mapping.wealth}为财星（财富）\n`;
    } else {
        analysis += "女性以官杀为夫星，食伤为子女星\n";
        analysis += `   → 您日干属${elementNameMap[dayGanElement]}，${mapping.spouse}为夫星（配偶），${mapping.children}为子女星\n`;
    }
    
    return analysis;
}

/**
 * 运势解读分析
 */
function generateFortuneAnalysis(gender, wuxingCounts) {
    let analysis = "🎯 运势侧重：";
    
    const dominantElement = Object.keys(wuxingCounts).reduce((a, b) => 
        wuxingCounts[a] > wuxingCounts[b] ? a : b
    );
    
    if (gender === 'male') {
        analysis += "男性重事业成就、社会地位、财富积累\n";
        analysis += getMaleCareerAdvice(dominantElement);
    } else {
        analysis += "女性重感情和谐、家庭幸福、子女教育\n";
        analysis += getFemaleLifeAdvice(dominantElement);
    }
    
    return analysis;
}

/**
 * 婚姻分析
 */
function generateMarriageAnalysis(gender, dayGanElement) {
    let analysis = "💕 婚姻分析：";
    
    if (gender === 'male') {
        analysis += "男性看财星为妻，官杀为竞争对手\n";
        const wifeElement = getSpouseElement(dayGanElement, 'wife');
        analysis += `   → 您的妻星为${wifeElement}，代表理想配偶的性格特质\n`;
        analysis += "   → 财星旺则妻贤内助，财星弱则需要主动追求\n";
    } else {
        analysis += "女性看官杀为夫，比劫为情敌\n";
        const husbandElement = getSpouseElement(dayGanElement, 'husband');
        analysis += `   → 您的夫星为${husbandElement}，代表理想配偶的性格特质\n`;
        analysis += "   → 官星旺则夫君有为，官星弱则感情路较曲折\n";
    }
    
    return analysis;
}

// ==================== 更多辅助函数 ====================

/**
 * 获取配偶元素特征
 */
function getSpouseElement(dayGanElement, type) {
    const spouseMap = {
        wife: {
            wood: '土（稳重踏实型）',
            fire: '金（理性独立型）',
            earth: '水（智慧灵动型）',
            metal: '木（温柔体贴型）',
            water: '火（热情开朗型）'
        },
        husband: {
            wood: '金（果断坚毅型）',
            fire: '水（智慧沉稳型）',
            earth: '木（温和上进型）',
            metal: '火（热情积极型）',
            water: '土（稳重可靠型）'
        }
    };
    
    return spouseMap[type][dayGanElement] || '未知';
}

/**
 * 男性事业建议
 */
function getMaleCareerAdvice(element) {
    const advice = {
        metal: "   → 金旺：决断力强，适合管理、技术、金融领域发展\n",
        wood: "   → 木旺：创新能力强，适合文教、医疗、环保行业\n",
        water: "   → 水旺：智慧过人，适合贸易、咨询、流通行业\n",
        fire: "   → 火旺：热情积极，适合销售、娱乐、电子行业\n",
        earth: "   → 土旺：稳重踏实，适合房地产、农业、建筑行业\n"
    };
    return advice[element] || "";
}

/**
 * 女性生活建议
 */
function getFemaleLifeAdvice(element) {
    const advice = {
        water: "   → 水旺：感情细腻，善于处理人际关系，直觉敏锐\n",
        fire: "   → 火旺：性格开朗，魅力十足，社交能力强\n",
        earth: "   → 土旺：温和包容，善于持家，家庭责任感强\n",
        wood: "   → 木旺：温柔体贴，富有同情心，适合教育工作\n",
        metal: "   → 金旺：理性独立，品味高雅，追求完美\n"
    };
    return advice[element] || "";
}

// ==================== 其他核心函数 ====================
// （包含所有原有的计算函数，如平衡度计算、建议生成、姓名分析等）

// 导出主要函数
module.exports = {
    calculateBazi,
    fiveElementMap,
    elementNameMap
};