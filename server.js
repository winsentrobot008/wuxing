// server.js (后端代码)

// 引入 express 框架，用于创建 web 服务器
const express = require('express');
// 引入 cors 模块，用于处理跨域请求 (前端和后端在不同端口时需要)
const cors = require('cors');
// 引入 body-parser，用于解析 POST 请求中的 JSON 数据
const bodyParser = require('body-parser');

// 导入 lunar.js 库
// 假设 lunar.js 和 server.js 在同一个目录下，或者根据实际路径调整
// 由于 lunar.js 是一个浏览器和Node.js兼容的UMD模块，这里直接 require 即可
const { Lunar } = require('./lunar'); // 确保路径正确

const app = express();
const port = 3000; // 后端服务运行的端口

// 配置中间件
app.use(cors()); // 允许所有跨域请求
app.use(bodyParser.json()); // 解析 JSON 格式的请求体

// 天干地支与五行映射表 (这个现在放在后端，前端看不到了)
const TIAN_GAN_WU_XING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const DI_ZHI_WU_XING_MAIN = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
    '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
};

// 创建一个 API 接口，用于处理八字计算请求
app.post('/calculateBazi', (req, res) => {
    // 从请求体中获取前端发送的数据
    const { year, month, day, hour } = req.body;

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        return res.status(400).json({ error: '请输入完整的出生信息！' });
    }

    try {
        const birthDate = new Date(year, month - 1, day, hour, 0, 0);
        // 使用 lunar.js 获取 Lunar 日期对象
        const lunarDate = Lunar.fromDate(birthDate);

        const yearGan = lunarDate.getYearGan();
        const yearZhi = lunarDate.getYearZhi();
        const monthGan = lunarDate.getMonthGan();
        const monthZhi = lunarDate.getMonthZhi();
        const dayGan = lunarDate.getDayGan();
        const dayZhi = lunarDate.getDayZhi();
        const hourGan = lunarDate.getTimeGan();
        const hourZhi = lunarDate.getTimeZhi();

        const yearPillar = yearGan + yearZhi;
        const monthPillar = monthGan + monthZhi;
        const dayPillar = dayGan + dayZhi;
        const hourPillar = hourGan + hourZhi;

        const bazi = [yearPillar, monthPillar, dayPillar, hourPillar];
        const baziStr = bazi.join(' ');

        // --- 五行统计 --- (这部分现在在后端运行)
        const wuxingCounts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

        // 统计天干五行
        bazi.forEach(pillar => {
            if (pillar && pillar.length >= 2) {
                const gan = pillar.charAt(0);
                if (TIAN_GAN_WU_XING[gan]) {
                    wuxingCounts[TIAN_GAN_WU_XING[gan]]++;
                }
            }
        });

        // 统计地支五行（主气）
        bazi.forEach(pillar => {
            if (pillar && pillar.length >= 2) {
                const zhi = pillar.charAt(1);
                if (DI_ZHI_WU_XING_MAIN[zhi]) {
                    wuxingCounts[DI_ZHI_WU_XING_MAIN[zhi]]++;
                }
            }
        });

        // --- 简要分析 --- (这部分现在在后端运行)
        let analysis = "根据您的八字五行分布：";
        let maxElements = [];
        let minElements = [];
        let maxCount = -1;
        let minCount = 999;
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

        analysis += "这是一个高度简化的分析，不包含专业命理学中的复杂概念。";

        // 将计算结果发送回前端
        res.json({
            bazi: baziStr,
            wuxingCounts: wuxingCounts,
            analysis: analysis
        });

    } catch (error) {
        console.error('后端八字计算发生错误:', error);
        res.status(500).json({ error: '后端八字计算出错，请检查输入或服务器日志。' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`八字计算后端服务已在 http://localhost:${port} 启动！`);
});