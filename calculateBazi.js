// calculateBazi.js (最新内容)
// 这个文件将包含更复杂的八字分析逻辑

function calculateBazi(eightChar, noHour, gender, lunar) {
    const fiveElementMap = {
        '甲': 'wood', '乙': 'wood',
        '丙': 'fire', '丁': 'fire',
        '戊': 'earth', '己': 'earth',
        '庚': 'metal', '辛': 'metal',
        '壬': 'water', '癸': 'water',
        '子': 'water', '丑': 'earth', // 丑土中藏有癸水辛金己土
        '寅': 'wood', // 寅木中藏有甲木丙火戊土
        '卯': 'wood',
        '辰': 'earth', // 辰土中藏有戊土乙木癸水
        '巳': 'fire', // 巳火中藏有丙火庚金戊土
        '午': 'fire', // 午火中藏有丁火己土
        '未': 'earth', // 未土中藏有己土丁火乙木
        '申': 'metal', // 申金中藏有庚金壬水戊土
        '酉': 'metal',
        '戌': 'earth', // 戌土中藏有戊土辛金丁火
        '亥': 'water'  // 亥水中藏有壬水甲木
    };

    // 五行详细说明，用于点击弹窗
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
            character: '灵活变通，思维活跃，洞察力强，善于沟通和适应环境。',
            health: '注意肾脏、泌尿系统和循环系统健康，保持心态平和。',
            career: '适合咨询、贸易、航海、科研、艺术等需要智慧和流动的职业。'
        },
        fire: {
            name: '火',
            character: '热情开朗，积极向上，富有感染力，行动力强，但有时性急。',
            health: '注意心脏、血压和眼部健康，保持情绪稳定，避免心火过旺。',
            career: '适合传媒、演艺、教育、餐饮、IT等需要激情和表达的职业。'
        },
        earth: {
            name: '土',
            character: '稳重踏实，忠诚可靠，富有耐心和包容力，注重实际。',
            health: '关注脾胃消化系统健康，保持饮食规律，避免思虑过度。',
            career: '适合房地产、建筑、农业、行政、教育等需要稳定和承载的职业。'
        }
    };


    const wuxingCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    const pillars = eightChar.getEightChar(); // 获取八字四柱数组

    // 遍历四柱，统计天干、地支主气和藏干的五行
    for (const pillar of pillars) {
        // 天干的五行
        const ganFiveElement = fiveElementMap[pillar.getGan().getName()];
        if (ganFiveElement) {
            wuxingCounts[ganFiveElement]++;
        }

        // 地支的五行（主气）
        const zhiFiveElement = fiveElementMap[pillar.getZhi().getName()];
        if (zhiFiveElement) {
            wuxingCounts[zhiFiveElement]++;
        }

        // 考虑地支藏干的五行 (lunar.js 已经有这个功能，我们直接使用其返回的藏干五行)
        const hideGans = pillar.getZhi().getHideGan();
        for (const hideGan of hideGans) {
             const hideGanFiveElement = hideElementNameToPinyin(hideGan.getFiveElement().getName()); // 将中文五行名转换为拼音
             if (hideGanFiveElement && wuxingCounts.hasOwnProperty(hideGanFiveElement)) {
                 wuxingCounts[hideGanFiveElement]++;
             }
        }
    }

    // 辅助函数：将中文五行名转换为拼音，以便与 wuxingCounts 对象的键匹配
    function hideElementNameToPinyin(name) {
        switch (name) {
            case '金': return 'metal';
            case '木': return 'wood';
            case '水': return 'water';
            case '火': return 'fire';
            case '土': return 'earth';
            default: return '';
        }
    }


    // --- 新增：十神分析 ---
    const dayGan = eightChar.getDayGan(); // 日主
    const shiShenGans = []; // 存储天干十神关系
    const shiShenZhis = []; // 存储地支藏干十神关系

    // 定义天干十神关系
    const shiShenMap = {
        '甲': {
            '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财',
            '己': '正财', '庚': '偏官', '辛': '正官', '壬': '偏印', '癸': '正印'
        },
        '乙': {
            '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财',
            '己': '偏财', '庚': '正官', '辛': '偏官', '壬': '正印', '癸': '偏印'
        },
        '丙': {
            '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神',
            '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '偏官', '癸': '正官'
        },
        '丁': {
            '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官',
            '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '偏官'
        },
        '戊': {
            '甲': '偏官', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩',
            '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财'
        },
        '己': {
            '甲': '正官', '乙': '偏官', '丙': '正印', '丁': '偏印', '戊': '劫财',
            '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财'
        },
        '庚': {
            '甲': '偏财', '乙': '正财', '丙': '偏官', '丁': '正官', '戊': '偏印',
            '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官'
        },
        '辛': {
            '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '偏官', '戊': '正印',
            '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神'
        },
        '壬': {
            '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '偏官',
            '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财'
        },
        '癸': {
            '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官',
            '己': '偏官', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩'
        }
    };

    // 获取四柱的天干和地支
    const yearGan = eightChar.getYearGan().getName();
    const yearZhi = eightChar.getYearZhi().getName();
    const monthGan = eightChar.getMonthGan().getName();
    const monthZhi = eightChar.getMonthZhi().getName();
    const dayGanName = eightChar.getDayGan().getName(); // 日主天干
    const dayZhi = eightChar.getDayZhi().getName();
    let timeGan = noHour ? '' : eightChar.getTimeGan().getName();
    let timeZhi = noHour ? '' : eightChar.getTimeZhi().getName();

    // 计算天干十神
    shiShenGans.push(
        `${yearGan}[${shiShenMap[dayGanName][yearGan]}]`,
        `${monthGan}[${shiShenMap[dayGanName][monthGan]}]`
    );
    if (!noHour) {
        shiShenGans.push(`${timeGan}[${shiShenMap[dayGanName][timeGan]}]`);
    }

    // 计算地支藏干的十神
    // 获取所有地支及其藏干
    const allPillars = eightChar.getEightChar();
    for (const p of allPillars) {
        const zhiName = p.getZhi().getName();
        const hideGans = p.getZhi().getHideGan();
        for (const hg of hideGans) {
            const ganName = hg.getName();
            // 排除日干本身作为藏干的情况 (虽然日支藏干可能包含日干，但通常不视为十神关系)
            if (ganName !== dayGanName && shiShenMap[dayGanName] && shiShenMap[dayGanName][ganName]) {
                shiShenZhis.push(`${zhiName}藏${ganName}[${shiShenMap[dayGanName][ganName]}]`);
            }
        }
    }


    // --- 新增：神煞信息 ---
    const shengShas = eightChar.getShenSha(); // 获取所有神煞
    const shenShaInfo = [];
    for (const s of shengShas) {
        shenShaInfo.push(s.getName());
    }

    // --- 新增：空亡查询 ---
    const kongWang = eightChar.getKongWang(); // 获取空亡
    const kongWangInfo = [];
    if (kongWang) {
        for (const kw of kongWang) {
            kongWangInfo.push(kw.getGan().getName() + kw.getZhi().getName());
        }
    }


    // --- 新增：日主强弱判断 (简化版) ---
    // 这是一个简化的判断，实际命理中日主强弱判断非常复杂，需要考虑月令、通根、透干、生克制化、格局等
    // 这里我们只做初步的判断：看日干在月令和时辰是否有力，以及周围干支的生助或克泄情况
    let dayGanStrength = '中和'; // 默认中和

    // 获取日干五行对象
    const dayGanFiveElementObj = dayGan.getFiveElement();

    // 统计生助日主的五行力量
    let supportingStrength = 0;
    const dayGanNameFull = dayGan.getName(); // 日主天干

    // 月令对日主的影响 (核心)
    const monthZhiObj = eightChar.getMonthZhi();
    const monthZhiFiveElement = monthZhiObj.getFiveElement();
    const monthZhiHideGans = monthZhiObj.getHideGan();

    // 如果月令五行生助日主，或与日主相同，则提供较强支持
    if (dayGanFiveElementObj.getRelation(monthZhiFiveElement) === '被生' || dayGanFiveElementObj.getRelation(monthZhiFiveElement) === '同') {
        supportingStrength += 2; // 月令得令，力量大
    }
    // 检查月令藏干对日主的影响
    for(const hg of monthZhiHideGans) {
        if (dayGanFiveElementObj.getRelation(hg.getFiveElement()) === '被生' || dayGanFiveElementObj.getRelation(hg.getFiveElement()) === '同') {
            supportingStrength += 1; // 藏干生助，力量次之
        }
    }

    // 检查其他干支对日主的生助和克泄
    const allGans = [yearGan, monthGan, dayGanNameFull];
    if (!noHour) {
        allGans.push(timeGan);
    }
    const allZhis = [yearZhi, monthZhi, dayZhi];
    if (!noHour) {
        allZhis.push(timeZhi);
    }

    for (const gan of allGans) {
        if (gan && shiShenMap[dayGanNameFull] && shiShenMap[dayGanNameFull][gan]) {
            const relation = shiShenMap[dayGanNameFull][gan];
            if (relation === '比肩' || relation === '劫财' || relation === '正印' || relation === '偏印') {
                supportingStrength++;
            } else if (relation === '正官' || relation === '偏官' || relation === '正财' || relation === '偏财' || relation === '食神' || relation === '伤官') {
                supportingStrength--;
            }
        }
    }

    for (const zhiName of allZhis) {
        if (zhiName) {
            const zhiObj = lunar.getEightChar().getEightChar().find(p => p.getZhi().getName() === zhiName)?.getZhi();
            if (zhiObj) {
                 const hideGans = zhiObj.getHideGan();
                 for (const hg of hideGans) {
                     if (shiShenMap[dayGanNameFull] && shiShenMap[dayGanNameFull][hg.getName()]) {
                         const relation = shiShenMap[dayGanNameFull][hg.getName()];
                         if (relation === '比肩' || relation === '劫财' || relation === '正印' || relation === '偏印') {
                             supportingStrength += 0.5; // 地支藏干的力量相对较弱
                         } else if (relation === '正官' || relation === '偏官' || relation === '正财' || relation === '偏财' || relation === '食神' || relation === '伤官') {
                             supportingStrength -= 0.5;
                         }
                     }
                 }
            }
        }
    }

    // 结合强弱判断
    if (supportingStrength >= 3) {
        dayGanStrength = '偏强';
    } else if (supportingStrength <= -1) { // 负数表示克泄多
        dayGanStrength = '偏弱';
    } else {
        dayGanStrength = '中和';
    }


    // --- 新增：大运和流年 ---
    const tenYuns = eightChar.getTenYun(); // 获取大运
    const liuNians = []; // 存储流年

    // 假设我们只显示未来60年的流年 (根据实际需要调整)
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 60; i++) {
        const year = currentYear + i;
        const liuNian = eightChar.getLiuNian(year);
        liuNians.push(`${year}年 ${liuNian.getGan().getName()}${liuNian.getZhi().getName()}`);
    }


    // 生成八字字符串
    const baziString = `${yearGan}${yearZhi} ${monthGan}${monthZhi} ${dayGanNameFull}${dayZhi} ${noHour ? "(未知)" : `${timeGan}${timeZhi}`}`;

    // 生成简要分析（现有逻辑）
    let analysisString = ""; // 将在script.js中动态生成五行分布HTML
    const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
    const avg = total / 5;
    const imbalances = [];

    for (const k in wuxingCounts) {
        if (wuxingCounts[k] > avg * 1.5) { // 偏多
            imbalances.push(`${fiveElementDetails[k].name}偏旺`);
        } else if (wuxingCounts[k] < avg * 0.5) { // 偏少
            imbalances.push(`${fiveElementDetails[k].name}偏弱`);
        }
    }

    if (imbalances.length > 0) {
        analysisString = `⚠️ 五行不均：${imbalances.join("，")}`;
    } else {
        analysisString = `✅ 五行较为平衡`;
    }

    // 用神推荐（现有逻辑）
    const weakest = Object.entries(wuxingCounts).sort((a, b) => a[1] - b[1])[0][0];
    const nameDict = {
        wood: ['林', '森', '荣', '楠', '桐'],
        fire: ['炫', '炎', '煜', '烨', '烽'],
        water: ['涵', '涛', '润', '洁', '沛'],
        metal: ['鑫', '钧', '铭', '锐', '锋'],
        earth: ['坤', '垚', '均', '城', '培'] // 增加土的字
    };
    
    let nameAdvice = "";
    if (imbalances.length > 0 && wuxingCounts[weakest] < avg * 0.5) { // 仅当有偏弱时才推荐用神
        nameAdvice = `建议起名偏向「${fiveElementDetails[weakest].name}」五行，推荐字：${nameDict[weakest].join('、')}。`;
    } else {
        nameAdvice = `您的五行较为平衡，无需特别强调某一行。`
    }

    // 命格性格提示
    const characterSummary = `您五行中“${fiveElementDetails[weakest].name}”较弱，建议加强该方面特质培养。 ${fiveElementDetails[weakest].character}`;


    return {
        baziString: baziString,
        wuxingCounts: wuxingCounts,
        analysis: analysisString, // 调整为 analysis，避免与 analysisHtml 混淆
        nameAdvice: nameAdvice,
        characterSummary: characterSummary,
        fiveElementDetails: fiveElementDetails, // 传递五行详细信息
        shiShenGans: shiShenGans,
        shiShenZhis: shiShenZhis,
        shenShaInfo: shenShaInfo,
        kongWangInfo: kongWangInfo,
        dayGanStrength: dayGanStrength,
        tenYuns: tenYuns, // 大运对象数组
        liuNians: liuNians // 流年字符串数组
    };
}