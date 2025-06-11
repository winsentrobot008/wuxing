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

// 导出函数
export {
    calculateBalanceDegree,
    giveWuxingAdvice,
    calculateGeneratingRelationship,
    calculateRestrainingRelationship,
    giveDetailedAdjustmentAdvice,
    simpleFortunePrediction
};