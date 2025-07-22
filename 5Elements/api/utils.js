// api/utils.js

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

// 辅助函数：根据五行数量计算五行平衡度
function calculateBalanceDegree(wuxingCounts) {
    const totalCount = Object.values(wuxingCounts).reduce((sum, count) => sum + count, 0);
    const averageCount = totalCount / 5;
    const balanceDegree = {};
    for (const [key, count] of Object.entries(wuxingCounts)) {
        balanceDegree[key] = (count / averageCount - 1) * 100; // 百分比偏差
    }

    // 找出最弱和最强的五行
    let weakestWuxing = '';
    let minCount = Infinity;
    let strongestWuxing = '';
    let maxCount = -Infinity;

    for (const [wuxing, count] of Object.entries(wuxingCounts)) {
        if (count < minCount) {
            minCount = count;
            weakestWuxing = wuxing;
        }
        if (count > maxCount) {
            maxCount = count;
            strongestWuxing = wuxing;
        }
    }

    // 根据最弱和最强五行给出建议
    let advice = '';
    if (minCount < averageCount / 2) { // 如果某个五行特别弱
        advice += `您的五行中【${weakestWuxing}】的力量相对较弱。`;
    } else if (maxCount > averageCount * 1.5) { // 如果某个五行特别强
        advice += `您的五行中【${strongestWuxing}】的力量相对过强。`;
    } else {
        advice += '您的五行分布较为均衡。';
    }

    // 这里可以根据实际需求添加更多复杂的平衡度计算和建议
    return { balanceDegree, weakestWuxing, strongestWuxing, advice };
}


// 辅助函数：生成五行平衡建议 (这个函数会使用 fiveElementColors 等常量)
function generateWuxingAdvice(wuxingCounts) {
    // 找到数量最少和最多的五行
    const sorted = Object.entries(wuxingCounts).sort(([, countA], [, countB]) => countA - countB);
    const weakWuxing = sorted[0][0]; // 数量最少的五行
    const strongWuxing = sorted[sorted.length - 1][0]; // 数量最多的五行

    let advice = `根据您的五行分布，【${weakWuxing}】相对较弱，建议您：\n`;
    advice += `  - 多接触 **${fiveElementColors[weakWuxing]}** 颜色的物品。\n`;
    advice += `  - 多前往 **${fiveElementDirections[weakWuxing]}** 方位。\n`;
    advice += `  - 多食用 **${fiveElementFoods[weakWuxing].join('、')}** 等属性的食物，以增强【${weakWuxing}】的能量。\n\n`;

    advice += `同时，【${strongWuxing}】相对较强，建议您：\n`;
    advice += `  - 适当减少接触 **${fiveElementColors[strongWuxing]}** 颜色的物品。\n`;
    advice += `  - 少去 **${fiveElementDirections[strongWuxing]}** 方位，以平衡五行。`;

    return advice;
}

// 辅助函数：简易五行运势预测
function simpleFortunePrediction(wuxingCounts) {
    // 找出数量最多的五行
    const dominantElement = Object.keys(wuxingCounts).reduce((a, b) => wuxingCounts[a] > wuxingCounts[b] ? a : b);
    let fortune = '';
    switch (dominantElement) {
        case 'wood':
            fortune = '您的八字中木元素较旺。近期事业上可能会有新的机遇出现，人际关系也较为和谐。适合学习新知识或开展新项目，但要注意避免过度劳累导致情绪上的波动。';
            break;
        case 'fire':
            fortune = '您的八字中火元素较旺。感情方面会有较好的发展，工作上也会充满热情和动力，容易得到他人的认可。但要注意避免过度冲动，凡事三思而后行。';
            break;
        case 'earth':
            fortune = '您的八字中土元素较旺。运势较为平稳，财运可能会有小的提升，适合进行一些稳定的投资或积累财富。人际关系上易得贵人相助，但要注意变通，避免固执。';
            break;
        case 'metal':
            fortune = '您的八字中金元素较旺。执行力强，果断，有利于在工作中取得突破。财运方面需要把握机会，可能会有意外之财。但在人际交往中，要注意言辞，避免过于直接。';
            break;
        case 'water':
            fortune = '您的八字中水元素较旺。思维敏捷，适应力强，有利于开拓新的领域或应对复杂局面。财运上可能需要多方探索，会有不错的机会。感情方面可能会比较丰富，但也要注意保持清醒。';
            break;
        default:
            fortune = '五行分布较为平衡，运势平稳。';
            break;
    }
    return fortune;
}

// 使用 CommonJS 模块导出，以便 api/calculate-bazi.js 可以通过 require() 引用
module.exports = {
    fiveElementGenerating,
    fiveElementRestraining,
    fiveElementColors,
    fiveElementDirections,
    fiveElementFoods,
    calculateBalanceDegree,
    generateWuxingAdvice,
    simpleFortunePrediction
};