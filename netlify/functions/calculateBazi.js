// lunar.js 在项目根目录，所以从 netlify/functions 引用需要 ../../lunar
const lunar = require('../../lunar');

// 天干地支与五行映射表 (从 script.js 移动到后端函数，确保后端有完整逻辑)
const TIAN_GAN_WU_XING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const DI_ZHI_WU_XING_MAIN = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
    '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
};

// Netlify Function 的入口点
// event 包含了传入请求的所有信息 (例如请求体、HTTP 方法等)
// context 包含了关于调用环境的信息
exports.handler = async (event, context) => {
    // 设置响应头，允许跨域访问（CORS）
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 允许所有来源进行测试。实际项目中通常会限制为您的前端域名。
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // 允许的 HTTP 方法
        'Access-Control-Allow-Headers': 'Content-Type', // 允许的请求头
    };

    // 处理 OPTIONS 请求 (CORS 预检请求)
    // 浏览器在发送 POST 请求前，有时会先发送一个 OPTIONS 请求来询问服务器是否允许跨域。
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: '', // 预检请求通常不需要响应体
        };
    }

    // 检查请求是否为 POST 方法
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Method Not Allowed
            headers: headers,
            body: JSON.stringify({ message: '只接受 POST 请求' }),
        };
    }

    let requestBody;
    try {
        // Netlify Function 的请求体在 event.body 中，通常是字符串，需要解析为 JSON
        requestBody = JSON.parse(event.body);
    } catch (error) {
        // 如果请求体不是有效的 JSON
        return {
            statusCode: 400, // Bad Request
            headers: headers,
            body: JSON.stringify({ message: '无效的 JSON 请求体' }),
        };
    }

    // 从请求体中获取出生信息
    const { year, month, day, hour } = requestBody;

    // 输入验证
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: '请输入完整的出生信息！' }),
        };
    }

    try {
        // 核心计算逻辑 (从 script.js 移动到这里，因为它现在在后端)
        const birthDate = new Date(year, month - 1, day, hour, 0, 0);
        const lunarDate = lunar.Lunar.fromDate(birthDate);

        // 获取八字四柱
        const ganZhiYear = lunarDate.get2GanZhi().getYear();
        const ganZhiMonth = lunarDate.get2GanZhi().getMonth();
        const ganZhiDay = lunarDate.get2GanZhi().getDay();
        const ganZhiHour = lunarDate.get2GanZhi().getHour();

        const bazi = {
            year: ganZhiYear,
            month: ganZhiMonth,
            day: ganZhiDay,
            hour: ganZhiHour
        };

        // 计算五行数量
        const wuxingCounts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

        // 统计天干的五行
        [ganZhiYear[0], ganZhiMonth[0], ganZhiDay[0], ganZhiHour[0]].forEach(gan => {
            const wuXing = TIAN_GAN_WU_XING[gan];
            if (wuXing) wuxingCounts[wuXing]++;
        });

        // 统计地支的五行（主气）
        [ganZhiYear[1], ganZhiMonth[1], ganZhiDay[1], ganZhiHour[1]].forEach(zhi => {
            const wuXing = DI_ZHI_WU_XING_MAIN[zhi];
            if (wuXing) wuxingCounts[wuXing]++;
        });

        // 简要分析
        let analysis = "";
        let maxCount = -1;
        let minCount = Infinity;
        let maxElements = [];
        let minElements = [];
        let hasMissing = false;

        for (const wuXing in wuxingCounts) {
            if (wuxingCounts[wuXing] > maxCount) {
                maxCount = wuxingCounts[wuXing];
                maxElements = [wuXing];
            } else if (wuxingCounts[wuXing] === maxCount) {
                maxElements.push(wuXing);
            }

            if (wuxingCounts[wuXing] < minCount) {
                minCount = wuxingCounts[wuXing];
                minElements = [wuXing];
            } else if (wuxingCounts[wuXing] === minCount) {
                minElements.push(wuXing);
            }

            if (wuxingCounts[wuXing] === 0) {
                hasMissing = true;
            }
        }

        if (maxElements.length > 0) {
            analysis += ` ${maxElements.join('、')} 元素数量偏旺。`;
        }
        if (minElements.length > 0 && minCount < 2 && !hasMissing) {
            analysis += ` ${minElements.join('、')} 元素数量偏弱。`;
        }
        if (hasMissing) {
            const missing = Object.keys(wuxingCounts).filter(wuXing => wuxingCounts[wuXing] === 0);
            analysis += ` 您的八字中可能缺少 ${missing.join('、')} 元素。`;
        }
        analysis += "这是一个高度简化的分析，不包含专业命理学的所有细微之处。";

        // 返回结果给前端
        return {
            statusCode: 200, // HTTP 状态码
            headers: headers, // 响应头
            body: JSON.stringify({ // 响应体，需要是字符串化的 JSON
                bazi: bazi,
                wuxingCounts: wuxingCounts,
                analysis: analysis
            }),
        };
    } catch (error) {
        console.error('八字计算过程中发生错误:', error); // 在 Netlify 函数日志中查看错误
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: '计算过程中发生服务器错误。' }),
        };
    }
};