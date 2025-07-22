const { Lunar } = require('lunar-javascript');
const { calculateBazi } = require('../my-library/baziCalculator.js');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持POST请求' });
    }

    try {
        const { year, month, day, hour, noHour, gender, userName } = req.body;
        
        // 验证输入数据
        if (!year || !month || !day) {
            throw new Error('日期数据不完整');
        }

        // 确保数据类型正确
        const y = parseInt(year);
        const m = parseInt(month);
        const d = parseInt(day);
        const h = hour ? parseInt(hour) : 0;

        if (isNaN(y) || isNaN(m) || isNaN(d)) {
            throw new Error('日期格式不正确');
        }

        // 创建农历对象
        const lunar = Lunar.fromDate(new Date(y, m - 1, d, h));
        
        // 获取八字
        const eightChar = lunar.getEightChar();
        
        // 计算八字分析
        const result = calculateBazi(eightChar, noHour, gender, lunar, userName);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('API错误：', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
} 