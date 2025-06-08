// 由于 lunar.js 将作为一个单独的模块文件，此处通过 require 导入
// 假设 lunar.js 文件与 calculateBazi.js 在同一个 api/ 目录下
const { Solar, Lunar, EightChar } = require('./lunar');

// 用于设置响应头的通用对象
const headers = {
    'Access-Control-Allow-Origin': '*', // 允许所有来源访问，出于演示目的，生产环境请限制
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // 允许的 HTTP 方法
    'Access-Control-Allow-Headers': 'Content-Type' // 允许的请求头
};

// Vercel Serverless Function 的入口
exports.handler = async (event, context) => {
    // 预检请求 (OPTIONS) 处理，避免跨域问题
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: headers
        };
    }

    // 确保请求是 POST 方法
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Method Not Allowed
            headers: headers,
            body: JSON.stringify({ message: '只允许 POST 请求' })
        };
    }

    let year, month, day, hour;
    try {
        const body = JSON.parse(event.body);
        year = parseInt(body.year);
        month = parseInt(body.month);
        day = parseInt(body.day);
        hour = parseInt(body.hour);
    } catch (e) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: '请求体格式不正确或缺少参数' })
        };
    }

    // 简单的输入验证
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: '请输入完整的出生信息！' })
        };
    }

    try {
        // 使用导入的 Lunar 类计算八字
        const lunar = Lunar.fromYmdHms(year, month, day, hour);
        const eightChar = EightChar.fromLunar(lunar);

        // 获取八字和五行计数
        const bazi = {
            year: eightChar.getYearGan() + eightChar.getYearZhi(),
            month: eightChar.getMonthGan() + eightChar.getMonthZhi(),
            day: eightChar.getDayGan() + eightChar.getDayZhi(),
            hour: eightChar.getHourGan() + eightChar.getHourZhi()
        };

        const wuxingCounts = {
            '金': eightChar.getMetal(),
            '木': eightChar.getWood(),
            '水': eightChar.getWater(),
            '火': eightChar.getFire(),
            '土': eightChar.getEarth()
        };

        // 简化的五行分析
        let analysis = "您的八字排盘如下：";
        let maxCount = 0;
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
            })
        };
    } catch (error) {
        console.error('八字计算或分析出错:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: '服务器内部错误，请检查输入或联系管理员。' })
        };
    }
};