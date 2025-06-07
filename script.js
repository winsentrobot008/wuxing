document.getElementById('calculateBtn').addEventListener('click', calculateBazi);

// 天干地支与五行映射表
const TIAN_GAN_WU_XING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const DI_ZHI_WU_XING_MAIN = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
    '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
};

function calculateBazi() {
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);
    const hour = parseInt(document.getElementById('hour').value);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        alert('请输入完整的出生信息！');
        return;
    }

    try {
        const birthDate = new Date(year, month - 1, day, hour, 0, 0);

        // 获取 Lunar 日期对象
        const lunarDate = Lunar.fromDate(birthDate);

        // **** 核心修正：直接从 lunarDate 对象获取四柱干支 ****
        // 不再通过 eightChar 对象，避免 eightChar 方法缺失的问题
        const yearGan = lunarDate.getYearGan();
        const yearZhi = lunarDate.getYearZhi();
        const monthGan = lunarDate.getMonthGan();
        const monthZhi = lunarDate.getMonthZhi();
        const dayGan = lunarDate.getDayGan();
        const dayZhi = lunarDate.getDayZhi();
        const hourGan = lunarDate.getTimeGan(); // 注意：小时用 getTimeGan
        const hourZhi = lunarDate.getTimeZhi(); // 注意：小时用 getTimeZhi

        const yearPillar = yearGan + yearZhi;
        const monthPillar = monthGan + monthZhi;
        const dayPillar = dayGan + dayZhi;
        const hourPillar = hourGan + hourZhi;

        // 组合四柱，并显示在页面上
        const bazi = [yearPillar, monthPillar, dayPillar, hourPillar];
        const baziStr = bazi.join(' ');
        document.getElementById('baziOutput').textContent = baziStr;

        // --- 五行统计 ---
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

        // 显示五行数量
        document.getElementById('metalCount').textContent = wuxingCounts['金'];
        document.getElementById('woodCount').textContent = wuxingCounts['木'];
        document.getElementById('waterCount').textContent = wuxingCounts['水'];
        document.getElementById('fireCount').textContent = wuxingCounts['火'];
        document.getElementById('earthCount').textContent = wuxingCounts['土'];

        // --- 简要分析 ---
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
        document.getElementById('analysisOutput').textContent = analysis;

    } catch (error) {
        document.getElementById('baziOutput').textContent = '八字计算出错，请检查输入或库的调用。';
        document.getElementById('analysisOutput').textContent = '无法进行分析。';
        console.error('八字计算发生错误:', error);
        alert('计算出现问题，请检查浏览器控制台 (F12) 或确认输入格式。');
    }
}