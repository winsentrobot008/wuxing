// 常用汉字五行属性表（部分示例）
const characterWuxing = {
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

// 五行相生相克关系
const wuxingRelations = {
    wood: { generates: 'fire', restricts: 'earth', generatedBy: 'water', restrictedBy: 'metal' },
    fire: { generates: 'earth', restricts: 'metal', generatedBy: 'wood', restrictedBy: 'water' },
    earth: { generates: 'metal', restricts: 'water', generatedBy: 'fire', restrictedBy: 'wood' },
    metal: { generates: 'water', restricts: 'wood', generatedBy: 'earth', restrictedBy: 'fire' },
    water: { generates: 'wood', restricts: 'fire', generatedBy: 'metal', restrictedBy: 'earth' }
};

function analyzeNameWuxing(name) {
    if (!name) return null;
    
    const nameWuxing = [];
    let wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    
    // 分析每个字的五行
    for (const char of name) {
        const element = characterWuxing[char];
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

// 分析姓名与八字五行的关系
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
                if (wuxingRelations[charElement].generates === baziElement ||
                    wuxingRelations[charElement].generatedBy === baziElement) {
                    compatibility.reinforcing.push({
                        char: charInfo.char,
                        relation: '相生',
                        with: baziElement
                    });
                    compatibility.score += 1;
                }
                // 相克关系
                else if (wuxingRelations[charElement].restricts === baziElement ||
                         wuxingRelations[charElement].restrictedBy === baziElement) {
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

module.exports = {
    analyzeNameWuxing,
    analyzeNameBaziCompatibility,
    characterWuxing,
    wuxingRelations
}; 