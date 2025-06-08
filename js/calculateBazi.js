// js/calculateBazi.js - 仅包含八字计算逻辑
// 确保 lunar.js 已在 index.html 中加载，它会全局暴露 Solar, Lunar, EightChar 等
// 注意：以下是根据您提供的文件内容进行提取和整理的，可能需要您根据实际需求微调。
// This file only contains Bazi calculation logic.
// Ensure lunar.js is loaded in index.html; it will expose Solar, Lunar, EightChar globally.
// Note: The following has been extracted and organized based on the content you provided, and may require fine-tuning based on your actual needs.


// 以下常量和函数都是从您提供的 calculateBazi.js 文件中提取的
// The following constants and functions are extracted from your provided calculateBazi.js file

var _GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
var _ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
var _POSITION_NAMES = ['年', '月', '日', '时'];
var _GANS_JIA_ZI_START = [4, 5, 6, 7, 8, 9, 0, 1, 2, 3];
var _ZHI_FIVE_ELEMENT = [8, 4, 3, 3, 0, 0, 7, 7, 6, 6, 9, 9];
var _FIVE_ELEMENT = ['木', '火', '土', '金', '水'];
var _WU_XING = ['木', '火', '土', '金', '水'];
var _GAN_WU_XING = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
var _GAN_YIN_YANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
var _ZHI_YIN_YANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
var _ZHI_XU_GONG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var _ZHI_LIU_SHA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var _ZHI_XUN_KONG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var _ZHI_CHANG_GAN = [
    ['癸'], ['癸', '辛', '己'], ['甲', '丙', '戊'], ['乙'], ['戊', '乙', '癸'], ['丙', '庚', '戊'], ['丁', '己'], ['己', '丁', '乙'], ['庚', '壬', '戊'], ['辛'], ['戊', '丁', '辛'], ['壬', '甲', '戊']
];


// 主要的八字计算函数
function calculateBazi(eightChar) {
    const yearGan = eightChar.getYearGan();
    const yearZhi = eightChar.getYearZhi();
    const monthGan = eightChar.getMonthGan();
    const monthZhi = eightChar.getMonthZhi();
    const dayGan = eightChar.getDayGan();
    const dayZhi = eightChar.getDayZhi();
    const hourGan = eightChar.getHourGan();
    const hourZhi = eightChar.getHourZhi();

    const baziString = `${yearGan}${yearZhi} ${monthGan}${monthZhi} ${dayGan}${dayZhi} ${hourGan}${hourZhi}`;

    // 五行计数逻辑 (根据您提供的代码进行简化和整合)
    const wuxingCounts = {
        wood: 0, // 木
        fire: 0, // 火
        earth: 0, // 土
        metal: 0, // 金
        water: 0 // 水
    };

    const countWuXing = (gan, zhi) => {
        // 根据天干计算五行
        const ganIndex = _GAN.indexOf(gan);
        if (ganIndex !== -1) {
            const wuxingIndex = _GAN_WU_XING[ganIndex];
            wuxingCounts[_WU_XING[wuxingIndex]]++;
        }

        // 根据地支藏干计算五行 (这里需要更复杂的逻辑，我提供一个简化版)
        const zhiIndex = _ZHI.indexOf(zhi);
        if (zhiIndex !== -1) {
            const changGans = _ZHI_CHANG_GAN[zhiIndex];
            changGans.forEach(cg => {
                const cgGanIndex = _GAN.indexOf(cg);
                if (cgGanIndex !== -1) {
                    const cgWuxingIndex = _GAN_WU_XING[cgGanIndex];
                    wuxingCounts[_WU_XING[cgWuxingIndex]]++;
                }
            });
        }
    };

    countWuXing(yearGan, yearZhi);
    countWuXing(monthGan, monthZhi);
    countWuXing(dayGan, dayZhi);
    countWuXing(hourGan, hourZhi);

    // 简要分析 (这部分是示例，您可以根据您的八字理论进行扩展)
    let analysis = '根据您的出生信息，计算出您的八字为：' + baziString + '。';

    const sortedWuxingKeys = Object.keys(wuxingCounts).sort((a, b) => wuxingCounts[b] - wuxingCounts[a]);
    const maxWuXing = sortedWuxingKeys[0];
    const minWuXing = sortedWuxingKeys[sortedWuxingKeys.length - 1];

    analysis += `五行分布情况：${maxWuXing}元素较多（${wuxingCounts[maxWuXing]}个），${minWuXing}元素较少（${wuxingCounts[minWuXing]}个）。`;

    // 您可以在这里添加更多复杂的八字分析逻辑，例如：
    // 日元强弱判断
    // 调候用神
    // 刑冲合害
    // 大运流年等

    return {
        baziString: baziString,
        wuxingCounts: wuxingCounts,
        analysis: analysis
    };
}