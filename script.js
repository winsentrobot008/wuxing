let radarChart, barChart;

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

function calculateWuXing() {
    const birthdayInput = document.getElementById('birthday').value;
    const hourInput = document.getElementById('hour').value;
    const noHour = document.getElementById('noHour').checked;
    const gender = document.getElementById('gender').value;
    const resultDiv = document.getElementById('result');

    if (!birthdayInput || (!hourInput && !noHour)) {
        resultDiv.innerHTML = '请填写出生日期和时辰（或勾选“不知道出生时辰”）！';
        return;
    }

    try {
        const date = new Date(birthdayInput);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = parseInt(hourInput || '0');

        const solar = noHour
           ? Solar.fromYmd(year, month, day)
            : Solar.fromYmdHms(year, month, day, hour, 0, 0);

        const lunar = solar.getLunar();
        const eightChar = lunar.getEightChar();
        const baziAnalysis = calculateBazi(eightChar, noHour, gender, lunar);

        // 计算五行平衡度
        const balanceDegree = calculateBalanceDegree(baziAnalysis.wuxingCounts);
        // 获取五行建议
        const wuxingAdvice = giveWuxingAdvice(balanceDegree);
        // 获取详细调整建议
        const detailedAdvice = giveDetailedAdjustmentAdvice(balanceDegree);
        // 简易五行运势预测
        const fortunePrediction = simpleFortunePrediction(baziAnalysis.wuxingCounts);

        resultDiv.innerHTML = `
            <p>🌟农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日</p>
            <p>🌟生肖：${lunar.getYearShengXiao()}</p>
            <p>🌟八字：${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${noHour ? "(未知)" : eightChar.getTime()}</p>
            <p>🌈 纳音五行：</p>
            ${baziAnalysis.nayinTable}
            <hr>
            <p><strong>🔎 五行分布分析：</strong></p>
            ${baziAnalysis.analysis}
            <hr>
            <p><strong>🎯 喜用神推荐：</strong></p>
            ${baziAnalysis.yongshenAdvice}
            <hr>
            <p><strong>🧠 名字建议：</strong></p>
            ${baziAnalysis.nameAdvice}
            <hr>
            <p><strong>📜 命格性格提示：</strong></p>
            ${baziAnalysis.characterSummary}
            <hr>
            <p><strong>🌐 五行平衡建议：</strong></p>
            ${wuxingAdvice}
            <hr>
            <p><strong>💡 详细调整建议：</strong></p>
            ${detailedAdvice}
            <hr>
            <p><strong>🔮 简易五行运势预测：</strong></p>
            ${fortunePrediction}
        `;

        renderCharts(baziAnalysis.wuxingCounts);
    } catch (error) {
        resultDiv.innerHTML = `❌ 错误：${error.message}`;
        console.error(error);
    }
}

function renderCharts(wuxingCounts) {
    const keys = ['metal', 'wood', 'water', 'fire', 'earth'];
    const labels = ['金', '木', '水', '火', '土'];
    const data = keys.map(key => wuxingCounts[key] || 0);

    // 销毁旧图表
    if (radarChart) radarChart.destroy();
    if (barChart) barChart.destroy();

    const radarCtx = document.getElementById('wuxingRadarChart').getContext('2d');
    const barCtx = document.getElementById('wuxingBarChart').getContext('2d');

    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '五行雷达图',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '五行数量',
                data: data,
                backgroundColor: [
                    '#f1c40f', '#27ae60', '#3498db', '#e74c3c', '#a57c1b'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}