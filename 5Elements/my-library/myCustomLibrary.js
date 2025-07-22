// my-library/myCustomLibrary.js

// 五行相生关系
const fiveElementGenerating = {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood'
};

// 五行相克关系
const fiveElementRestraining = {
    wood: 'earth',
    fire: 'metal',
    earth: 'water',
    metal: 'wood',
    water: 'fire'
};

// 五行对应的颜色
const fiveElementColors = {
    wood: 'green',
    fire: 'red',
    earth: 'yellow',
    metal: 'white',
    water: 'black'
};

// 五行对应的方位
const fiveElementDirections = {
    wood: 'east',
    fire: 'south',
    earth: 'center',
    metal: 'west',
    water: 'north'
};

// 五行对应的食物
const fiveElementFoods = {
    wood: ['green vegetables', 'beans'],
    fire: ['hot peppers', 'tomatoes'],
    earth: ['sweet potatoes', 'corn'],
    metal: ['nuts', 'grain'],
    water: ['seafood', 'melons']
};

// 常用汉字五行属性表（受保护的核心数据）
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

// 辅助函数：根据五行数量计算五行平衡度
function calculateBalanceDegree(wuxingCounts) {
    const totalCount = Object.values(wuxingCounts).reduce((sum, count) => sum + count, 0);
    const averageCount = totalCount / 5;
    const balanceDegree = {};
    for (const [key, count] of Object.entries(wuxingCounts)) {
        balanceDegree[key] = Math.abs(count - averageCount);
    }
    return balanceDegree;
}

// 辅助函数：根据五行平衡度给出五行建议
function giveWuxingAdvice(balanceDegree) {
    const sorted = Object.entries(balanceDegree).sort((a, b) => a[1] - b[1]);
    const weakWuxing = sorted[0][0];
    const strongWuxing = sorted[sorted.length - 1][0];
    return `建议多补充 ${weakWuxing} 属性的事物，适当克制 ${strongWuxing} 属性的事物。`;
}

// 辅助函数：计算五行相生关系
function calculateGeneratingRelationship(element) {
    return fiveElementGenerating[element];
}

// 辅助函数：计算五行相克关系
function calculateRestrainingRelationship(element) {
    return fiveElementRestraining[element];
}

// 辅助函数：根据五行平衡度给出更详细的调整建议
function giveDetailedAdjustmentAdvice(balanceDegree) {
    const sorted = Object.entries(balanceDegree).sort((a, b) => a[1] - b[1]);
    const weakWuxing = sorted[0][0];
    const strongWuxing = sorted[sorted.length - 1][0];

    let advice = `由于 ${weakWuxing} 较弱，您可以多接触 ${fiveElementColors[weakWuxing]} 颜色的物品，多前往 ${fiveElementDirections[weakWuxing]} 方位，多食用 ${fiveElementFoods[weakWuxing].join(', ')} 等食物来增强 ${weakWuxing} 的能量。`;
    advice += `同时，因为 ${strongWuxing} 较强，应适当减少接触 ${fiveElementColors[strongWuxing]} 颜色的物品，少去 ${fiveElementDirections[strongWuxing]} 方位。`;

    return advice;
}

// 辅助函数：简易五行运势预测
function simpleFortunePrediction(wuxingCounts) {
    const dominantElement = Object.keys(wuxingCounts).reduce((a, b) => wuxingCounts[a] > wuxingCounts[b] ? a : b);
    let fortune = '';
    switch (dominantElement) {
        case 'wood':
            fortune = '近期事业上可能会有新的机遇出现，人际关系也较为和谐，但要注意情绪上的波动。';
            break;
        case 'fire':
            fortune = '感情方面会有较好的发展，工作上也会充满热情和动力，但要注意避免过度冲动。';
            break;
        case 'earth':
            fortune = '运势较为平稳，财运可能会有小的提升，适合进行一些稳定的投资。';
            break;
        case 'metal':
            fortune = '事业上可能会遇到一些挑战，但只要坚持努力，会有不错的收获。健康方面要注意呼吸道问题。';
            break;
        case 'water':
            fortune = '思维较为活跃，学习和创作能力较强，但要注意理财，避免不必要的开支。';
            break;
        default:
            fortune = '运势较为平常，保持积极的心态面对生活即可。';
    }
    return fortune;
}

// 辅助函数：分析姓名五行
function analyzeNameWuxing(name) {
    if (!name) return null;
    
    const nameWuxing = [];
    let wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    
    // 分析每个字的五行
    for (const char of name) {
        const element = characterWuxingMap[char];
        if (element) {
            nameWuxing.push({ char, element });
            wuxingCounts[element]++;
        }
    }
    
    // 计算姓名五行强度
    const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
    const strength = {};
    for (const element in wuxingCounts) {
        strength[element] = total > 0 ? (wuxingCounts[element] / total) : 0;
    }
    
    return {
        nameWuxing,        // 每个字的五行属性
        wuxingCounts,      // 五行数量统计
        strength           // 五行强度比例
    };
}

// 辅助函数：分析姓名与八字五行的关系
function analyzeNameBaziCompatibility(nameAnalysis, baziWuxing) {
    if (!nameAnalysis || !baziWuxing) return null;
    
    const compatibility = {
        reinforcing: [],   // 相生关系
        conflicting: [],   // 相克关系
        balanced: [],      // 平衡关系
        score: 0          // 综合评分
    };
    
    // 分析每个字与八字五行的关系
    for (const charInfo of nameAnalysis.nameWuxing) {
        const charElement = charInfo.element;
        
        // 检查与八字主气的关系
        for (const baziElement in baziWuxing) {
            if (baziWuxing[baziElement] > 0) {
                // 相生关系
                if (fiveElementGenerating[charElement] === baziElement ||
                    fiveElementGenerating[baziElement] === charElement) {
                    compatibility.reinforcing.push({
                        char: charInfo.char,
                        relation: '相生',
                        with: baziElement
                    });
                    compatibility.score += 1;
                }
                // 相克关系
                else if (fiveElementRestraining[charElement] === baziElement ||
                        fiveElementRestraining[baziElement] === charElement) {
                    compatibility.conflicting.push({
                        char: charInfo.char,
                        relation: '相克',
                        with: baziElement
                    });
                    compatibility.score -= 1;
                }
                // 同类
                else if (charElement === baziElement) {
                    compatibility.balanced.push({
                        char: charInfo.char,
                        relation: '同类',
                        with: baziElement
                    });
                    compatibility.score += 0.5;
                }
            }
        }
    }
    
    return compatibility;
}

// 导出函数
export {
    calculateBalanceDegree,
    giveWuxingAdvice,
    calculateGeneratingRelationship,
    calculateRestrainingRelationship,
    giveDetailedAdjustmentAdvice,
    simpleFortunePrediction,
    analyzeNameWuxing,
    analyzeNameBaziCompatibility,
    characterWuxingMap
};