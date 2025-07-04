const express = require('express');
const cors = require('cors');
const { Lunar } = require('lunar-javascript');
const { calculateBazi } = require('./baziCalculator.js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// API路由
app.post('/api/calculate', (req, res) => {
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
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 