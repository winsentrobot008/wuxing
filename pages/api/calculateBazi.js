import { Lunar, Solar, LunarUtil } from 'lunar-javascript'

// 天干地支对照表
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 五行属性对照表
const FIVE_ELEMENTS = {
    甲: 'wood', 乙: 'wood',
    丙: 'fire', 丁: 'fire',
    戊: 'earth', 己: 'earth',
    庚: 'metal', 辛: 'metal',
    壬: 'water', 癸: 'water',
    子: 'water', 丑: 'earth', 寅: 'wood', 卯: 'wood',
    辰: 'earth', 巳: 'fire', 午: 'fire', 未: 'earth',
    申: 'metal', 酉: 'metal', 戌: 'earth', 亥: 'water'
}

// 十神名称
const TEN_GODS = {
  '甲甲': '比肩', '甲乙': '劫财', '甲丙': '食神', '甲丁': '伤官', '甲戊': '偏财', '甲己': '正财', '甲庚': '七杀', '甲辛': '正官', '甲壬': '偏印', '甲癸': '正印',
  '乙乙': '比肩', '乙甲': '劫财', '乙丁': '食神', '乙丙': '伤官', '乙己': '偏财', '乙戊': '正财', '乙辛': '七杀', '乙庚': '正官', '乙癸': '偏印', '乙壬': '正印',
  '丙丙': '比肩', '丙丁': '劫财', '丙戊': '食神', '丙己': '伤官', '丙庚': '偏财', '丙辛': '正财', '丙壬': '七杀', '丙癸': '正官', '丙甲': '偏印', '丙乙': '正印',
  '丁丁': '比肩', '丁丙': '劫财', '丁己': '食神', '丁戊': '伤官', '丁辛': '偏财', '丁庚': '正财', '丁癸': '七杀', '丁壬': '正官', '丁乙': '偏印', '丁甲': '正印',
  '戊戊': '比肩', '戊己': '劫财', '戊庚': '食神', '戊辛': '伤官', '戊壬': '偏财', '戊癸': '正财', '戊甲': '七杀', '戊乙': '正官', '戊丙': '偏印', '戊丁': '正印',
  '己己': '比肩', '己戊': '劫财', '己辛': '食神', '己庚': '伤官', '己癸': '偏财', '己壬': '正财', '己乙': '七杀', '己甲': '正官', '己丁': '偏印', '己丙': '正印',
  '庚庚': '比肩', '庚辛': '劫财', '庚壬': '食神', '庚癸': '伤官', '庚甲': '偏财', '庚乙': '正财', '庚丙': '七杀', '庚丁': '正官', '庚戊': '偏印', '庚己': '正印',
  '辛辛': '比肩', '辛庚': '劫财', '辛癸': '食神', '辛壬': '伤官', '辛乙': '偏财', '辛甲': '正财', '辛丁': '七杀', '辛丙': '正官', '辛己': '偏印', '辛戊': '正印',
  '壬壬': '比肩', '壬癸': '劫财', '壬甲': '食神', '壬乙': '伤官', '壬丙': '偏财', '壬丁': '正财', '壬戊': '七杀', '壬己': '正官', '壬庚': '偏印', '壬辛': '正印',
  '癸癸': '比肩', '癸壬': '劫财', '癸乙': '食神', '癸甲': '伤官', '癸丁': '偏财', '癸丙': '正财', '癸己': '七杀', '癸戊': '正官', '癸辛': '偏印', '癸庚': '正印'
}

// 获取八字对象
function getEightChar(solar, gender, needTimeDetail = false) {
  try {
    // 使用lunar-javascript库计算农历和八字
    const lunar = Lunar.fromSolar(solar);
    const eightChar = lunar.getEightChar();
    
    // 基础八字信息
    const result = {
      year: eightChar.getYear(),
      month: eightChar.getMonth(),
      day: eightChar.getDay(),
      time: needTimeDetail ? eightChar.getTime() : '未知',
      yearGan: eightChar.getYearGan(),
      yearZhi: eightChar.getYearZhi(),
      monthGan: eightChar.getMonthGan(),
      monthZhi: eightChar.getMonthZhi(),
      dayGan: eightChar.getDayGan(), 
      dayZhi: eightChar.getDayZhi(),
      timeGan: needTimeDetail ? eightChar.getTimeGan() : '',
      timeZhi: needTimeDetail ? eightChar.getTimeZhi() : ''
    };
    
    // 计算纳音五行
    result.yearNayin = lunar.getYearNaYin();
    result.monthNayin = lunar.getMonthNaYin();
    result.dayNayin = lunar.getDayNaYin();
    result.timeNayin = needTimeDetail ? lunar.getTimeNaYin() : '未知';
    
    // 计算所处节气
    const jieqi = lunar.getPrevJieQi();
    const nextJieqi = lunar.getNextJieQi();
    result.prevJieqi = {
      name: jieqi.getName(),
      solar: jieqi.getSolar().toYmd()
    };
    result.nextJieqi = {
      name: nextJieqi.getName(),
      solar: nextJieqi.getSolar().toYmd()
    };

    // 是否是真太阳时
    if (needTimeDetail) {
      // 获取真太阳时，lunar-javascript库提供了这个功能
      const solarTime = solar.getJulianDay();
      result.trueSolarTime = solarTime;
    }
    
    return { lunar, eightChar, result };
  } catch (error) {
    console.error("八字计算错误:", error);
    throw new Error("八字计算失败，请检查输入信息");
  }
}

// 计算五行分布
function calculateFiveElements(result) {
  const counts = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  }

  // 统计天干五行
  ;['yearGan', 'monthGan', 'dayGan', 'timeGan'].forEach(key => {
    const char = result[key];
    if (char && FIVE_ELEMENTS[char]) {
      counts[FIVE_ELEMENTS[char]]++;
    }
  });

  // 统计地支五行
  ;['yearZhi', 'monthZhi', 'dayZhi', 'timeZhi'].forEach(key => {
    const char = result[key];
    if (char && FIVE_ELEMENTS[char]) {
      counts[FIVE_ELEMENTS[char]]++;
    }
  });

  return counts;
}

// 计算十神
function calculateTenGods(result) {
  const dayMaster = result.dayGan; // 日主天干
  const tenGods = {
    year: TEN_GODS[dayMaster + result.yearGan] || '',
    month: TEN_GODS[dayMaster + result.monthGan] || '',
    time: result.timeGan ? (TEN_GODS[dayMaster + result.timeGan] || '') : '',
    yearZhi: '',
    monthZhi: '',
    dayZhi: '',
    timeZhi: ''
  };
  
  return tenGods;
}

// 日主分析
function analyzeDayMaster(result, wuxingCounts) {
  const dayMaster = result.dayGan;
  const dayMasterElement = FIVE_ELEMENTS[dayMaster];
  
  // 检查日主五行在命局中的强弱
  const totalElements = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
  const dayMasterStrength = wuxingCounts[dayMasterElement] / totalElements;
  
  let analysis = `日主为${dayMaster}，属${dayMasterElement}。\n`;
  
  if (dayMasterStrength > 0.3) {
    analysis += `日主偏强，五行中${dayMasterElement}的力量占比较大。`;
    // 根据日主属性给出建议
    switch (dayMasterElement) {
      case 'wood':
        analysis += "木性较旺，具有较强的创造力和进取心。宜发展金的特质来制约，如增强果断和执行力。";
        break;
      case 'fire':
        analysis += "火性较旺，热情奔放，表达能力强。宜发展水的特质来制约，如增强冷静思考和灵活性。";
        break;
      case 'earth':
        analysis += "土性较旺，稳重踏实，责任感强。宜发展木的特质来制约，如增强创新能力和灵活思维。";
        break;
      case 'metal':
        analysis += "金性较旺，果断决绝，原则性强。宜发展火的特质来制约，如增强热情和创造力。";
        break;
      case 'water':
        analysis += "水性较旺，聪明灵活，适应性强。宜发展土的特质来制约，如增强稳定性和踏实感。";
        break;
    }
  } else if (dayMasterStrength < 0.15) {
    analysis += `日主偏弱，五行中${dayMasterElement}的力量占比较小。`;
    // 根据日主属性给出建议
    switch (dayMasterElement) {
      case 'wood':
        analysis += "木性较弱，宜得水生助，如增强学习能力和适应性，避免金的抑制。";
        break;
      case 'fire':
        analysis += "火性较弱，宜得木生助，如增强创造力和进取心，避免水的抑制。";
        break;
      case 'earth':
        analysis += "土性较弱，宜得火生助，如增强表达能力和热情，避免木的抑制。";
        break;
      case 'metal':
        analysis += "金性较弱，宜得土生助，如增强踏实稳重的特质，避免火的抑制。";
        break;
      case 'water':
        analysis += "水性较弱，宜得金生助，如增强果断和执行力，避免土的抑制。";
        break;
    }
  } else {
    analysis += `日主中和，五行中${dayMasterElement}的力量较为平衡。`;
  }
  
  return analysis;
}

// 分析命局特点
function analyzeDestiny(result, wuxingCounts, gender) {
  const dayMaster = result.dayGan;
  const dayMasterElement = FIVE_ELEMENTS[dayMaster];
  
  // 命局五行强弱评估
  const elementStrengths = {};
  const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
  
  Object.entries(wuxingCounts).forEach(([element, count]) => {
    elementStrengths[element] = count / total;
  });
  
  // 分析命局特点
  let destinyAnalysis = "命局特点分析：\n";
  
  // 找出最强和最弱的五行
  const strongest = Object.entries(elementStrengths)
    .sort(([, a], [, b]) => b - a)[0];
  const weakest = Object.entries(elementStrengths)
    .sort(([, a], [, b]) => a - b)[0];
    
  destinyAnalysis += `最强五行为${strongest[0]}，最弱五行为${weakest[0]}。\n`;
  
  // 分析日主与命局的关系
  const dayMasterStrength = elementStrengths[dayMasterElement];
  
  if (dayMasterStrength > 0.25) {
    destinyAnalysis += "日主较强，命局有主导性，个性较为突出。\n";
  } else if (dayMasterStrength < 0.15) {
    destinyAnalysis += "日主较弱，命局需要他助，适合合作或辅助角色。\n";
  } else {
    destinyAnalysis += "日主中和，命局平衡，能够灵活应变各种环境。\n";
  }
  
  // 根据性别分析
  if (gender === 'male') {
    // 男性分析偏重事业、外向发展
    destinyAnalysis += "男命分析：\n";
    if (elementStrengths.wood > 0.25) destinyAnalysis += "木旺利于创业和规划，适合管理、创新类工作。\n";
    if (elementStrengths.fire > 0.25) destinyAnalysis += "火旺有领导魅力，适合需要表达和影响力的工作。\n";
    if (elementStrengths.earth > 0.25) destinyAnalysis += "土旺稳重可靠，适合需要责任感和踏实的工作。\n";
    if (elementStrengths.metal > 0.25) destinyAnalysis += "金旺果断坚毅，适合需要决策和执行力的工作。\n";
    if (elementStrengths.water > 0.25) destinyAnalysis += "水旺聪明灵活，适合需要智慧和沟通的工作。\n";
  } else {
    // 女性分析偏重家庭、内向发展
    destinyAnalysis += "女命分析：\n";
    if (elementStrengths.wood > 0.25) destinyAnalysis += "木旺性格活泼，善于规划，家庭生活中有主导性。\n";
    if (elementStrengths.fire > 0.25) destinyAnalysis += "火旺热情开朗，人际关系好，家庭氛围温暖。\n";
    if (elementStrengths.earth > 0.25) destinyAnalysis += "土旺稳重贤淑，家庭责任感强，重视亲情。\n";
    if (elementStrengths.metal > 0.25) destinyAnalysis += "金旺做事有条理，家庭管理井然有序。\n";
    if (elementStrengths.water > 0.25) destinyAnalysis += "水旺聪明灵活，对家庭关系有很好的调节能力。\n";
  }
  
  return destinyAnalysis;
}

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: '只支持POST请求' 
        })
    }

    try {
        const { year, month, day, hour, noHour, gender, userName, isLunar } = req.body
        
        // 验证输入数据
        if (!year || !month || !day) {
            throw new Error('日期数据不完整')
        }

        // 确保数据类型正确
        const y = parseInt(year)
        const m = parseInt(month)
        const d = parseInt(day)
        const h = noHour ? null : (hour ? parseInt(hour) : null)
        const min = noHour ? 0 : (hour ? 0 : 0) // 默认分钟为0
        
        if (isNaN(y) || isNaN(m) || isNaN(d)) {
            throw new Error('日期格式不正确')
        }
        
        // 创建阳历对象
        let solar;
        if (isLunar) {
            // 如果是农历日期，需要转换为阳历
            const lunar = Lunar.fromYmdHms(y, m, d, h || 0, min, 0);
            solar = lunar.getSolar();
        } else {
            // 阳历日期直接使用
            solar = Solar.fromYmdHms(y, m, d, h || 0, min, 0);
        }

        // 获取八字和农历信息
        const { result, lunar } = getEightChar(solar, gender, !noHour);
        
        // 计算五行分布
        const wuxingCounts = calculateFiveElements(result);
        
        // 计算十神
        const tenGods = calculateTenGods(result);
        
        // 日主分析
        const dayMasterAnalysis = analyzeDayMaster(result, wuxingCounts);
        
        // 命局分析
        const destinyAnalysis = analyzeDestiny(result, wuxingCounts, gender);
        
        // 构建分析文本
        let analysis = `五行分布：\n`;
        
        // 分析木的特征
        if (wuxingCounts.wood > 0) {
            analysis += `木：${wuxingCounts.wood} (代表生长、向上)\n`;
            analysis += `木的特质体现在创造力、进取心和理想主义上。\n`;
        }

        // 分析火的特征
        if (wuxingCounts.fire > 0) {
            analysis += `火：${wuxingCounts.fire} (代表温暖、光明)\n`;
            analysis += `火的特质体现在热情、表达力和领导能力上。\n`;
        }

        // 分析土的特征
        if (wuxingCounts.earth > 0) {
            analysis += `土：${wuxingCounts.earth} (代表稳重、包容)\n`;
            analysis += `土的特质体现在责任心、可靠性和务实态度上。\n`;
        }

        // 分析金的特征
        if (wuxingCounts.metal > 0) {
            analysis += `金：${wuxingCounts.metal} (代表坚强、果断)\n`;
            analysis += `金的特质体现在执行力、决断力和原则性上。\n`;
        }

        // 分析水的特征
        if (wuxingCounts.water > 0) {
            analysis += `水：${wuxingCounts.water} (代表智慧、灵活)\n`;
            analysis += `水的特质体现在智慧、适应性和学习能力上。\n`;
        }

        // 分析五行平衡
        const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
        const average = total / 5;

        analysis += `\n五行平衡分析：\n`;
        
        Object.entries(wuxingCounts).forEach(([element, count]) => {
            if (count > average) {
                analysis += `${element}偏强：`;
                switch (element) {
                    case 'wood':
                        analysis += '显示较强的创造力和进取心，但需要注意控制过于理想化的倾向。\n';
                        break;
                    case 'fire':
                        analysis += '表现出充沛的热情和表达欲，但需要注意控制情绪的稳定性。\n';
                        break;
                    case 'earth':
                        analysis += '展现出很好的责任心和可靠性，但需要注意避免过于保守。\n';
                        break;
                    case 'metal':
                        analysis += '具有较强的执行力和决断力，但需要注意增加灵活性。\n';
                        break;
                    case 'water':
                        analysis += '智慧和适应能力较强，但需要注意加强行动力。\n';
                        break;
                }
            } else if (count < average) {
                analysis += `${element}偏弱：`;
                switch (element) {
                    case 'wood':
                        analysis += '建议多培养创造力和进取心，增加户外活动。\n';
                        break;
                    case 'fire':
                        analysis += '建议多参与社交活动，培养表达能力和热情。\n';
                        break;
                    case 'earth':
                        analysis += '建议培养责任心和务实态度，稳固基础。\n';
                        break;
                    case 'metal':
                        analysis += '建议加强执行力和决断力，建立原则性。\n';
                        break;
                    case 'water':
                        analysis += '建议多学习新知识，提升适应能力和智慧。\n';
                        break;
                }
            }
        });

        // 添加日主分析
        analysis += "\n" + dayMasterAnalysis;
        
        // 添加命局分析
        analysis += "\n\n" + destinyAnalysis;
        
        // 农历信息
        const lunarInfo = {
            lunarYear: lunar.getYear(),
            lunarMonth: lunar.getMonth(),
            lunarDay: lunar.getDay(),
            lunarMonthName: lunar.getMonthInChinese(),
            lunarDayName: lunar.getDayInChinese(),
            zodiac: lunar.getYearShengXiao() // 生肖
        };

        // 生成分析结果
        const responseData = {
            success: true,
            data: {
                solar: {
                    year: solar.getYear(),
                    month: solar.getMonth(),
                    day: solar.getDay(),
                    hour: h
                },
                lunar: lunarInfo,
                eightChar: {
                    year: result.yearGan + result.yearZhi,
                    month: result.monthGan + result.monthZhi,
                    day: result.dayGan + result.dayZhi,
                    time: noHour ? '未知' : (result.timeGan + result.timeZhi)
                },
                wuxingCounts,
                tenGods,
                nayin: {
                    year: result.yearNayin,
                    month: result.monthNayin,
                    day: result.dayNayin,
                    time: result.timeNayin
                },
                jieqi: {
                    prev: result.prevJieqi,
                    next: result.nextJieqi
                },
                analysis
            }
        }
        
        res.status(200).json(responseData)
    } catch (error) {
        console.error('API错误：', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
} 