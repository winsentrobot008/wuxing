import { Lunar } from 'lunar-javascript'

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

// 计算八字
function calculateEightChar(year, month, day, hour) {
    // 简化的八字计算逻辑
    const yearIndex = (year - 4) % 60
    const yearStem = HEAVENLY_STEMS[yearIndex % 10]
    const yearBranch = EARTHLY_BRANCHES[yearIndex % 12]

    // 月干支计算（简化版）
    const monthStem = HEAVENLY_STEMS[(yearIndex % 10 * 2 + month) % 10]
    const monthBranch = EARTHLY_BRANCHES[(month + 1) % 12]

    // 日干支计算（简化版）
    const dayIndex = Math.floor((year * 5 + year / 4 + day + 23) % 60)
    const dayStem = HEAVENLY_STEMS[dayIndex % 10]
    const dayBranch = EARTHLY_BRANCHES[dayIndex % 12]

    // 时干支计算（简化版）
    let timeStem = ''
    let timeBranch = ''
    if (hour !== null) {
        const timeIndex = Math.floor(hour / 2)
        timeStem = HEAVENLY_STEMS[(dayIndex % 10 * 2 + timeIndex) % 10]
        timeBranch = EARTHLY_BRANCHES[timeIndex]
    }

    return {
        year: yearStem + yearBranch,
        month: monthStem + monthBranch,
        day: dayStem + dayBranch,
        time: hour === null ? '未知' : timeStem + timeBranch
    }
}

// 计算五行分布
function calculateFiveElements(eightChar) {
    const counts = {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0
    }

    // 统计天干和地支的五行
    Object.values(eightChar).forEach(char => {
        if (char !== '未知') {
            const stem = char[0]
            const branch = char[1]
            if (FIVE_ELEMENTS[stem]) counts[FIVE_ELEMENTS[stem]]++
            if (FIVE_ELEMENTS[branch]) counts[FIVE_ELEMENTS[branch]]++
        }
    })

    return counts
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
        const { year, month, day, hour, noHour, gender, userName } = req.body
        
        // 验证输入数据
        if (!year || !month || !day) {
            throw new Error('日期数据不完整')
        }

        // 确保数据类型正确
        const y = parseInt(year)
        const m = parseInt(month)
        const d = parseInt(day)
        const h = noHour ? null : (hour ? parseInt(hour) : null)

        if (isNaN(y) || isNaN(m) || isNaN(d)) {
            throw new Error('日期格式不正确')
        }

        // 计算八字
        const eightChar = calculateEightChar(y, m, d, h)
        
        // 计算五行分布
        const wuxingCounts = calculateFiveElements(eightChar)

        // 计算五行分析
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

        // 生成分析结果
        const result = {
            success: true,
            data: {
                eightChar,
                wuxingCounts,
                analysis
            }
        }
        
        res.status(200).json(result)
    } catch (error) {
        console.error('API错误：', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
} 