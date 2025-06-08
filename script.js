// script.js - 仅包含前端UI逻辑，不包含lunar.js或calculateBazi.js的完整代码
// script.js - Contains only frontend UI logic, no full lunar.js or calculateBazi.js code

document.getElementById('calculateBtn').addEventListener('click', function() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const hour = document.getElementById('hour').value;
    
    // 简单的输入验证
    if (!year || !month || !day || hour === '') {
        alert('请填写完整的出生日期和时辰！');
        return;
    }

    try {
        // 使用lunar.js和calculateBazi.js进行计算
        // 确保lunar.js和calculateBazi.js已在index.html中正确加载
        // Solar, Lunar, EightChar 对象由 lunar.js 全局暴露
        const solar = Solar.fromYmdHms(
            parseInt(year),
            parseInt(month),
            parseInt(day),
            parseInt(hour),
            0, // 分钟，根据您的需求可以从输入获取
            0  // 秒，根据您的需求可以从输入获取
        );
        const lunar = solar.getLunar();
        const eightChar = lunar.getEightChar();

        // 调用 calculateBazi.js 中定义的函数
        // 确保 calculateBazi 函数被正确定义并暴露在全局或通过模块化方式可访问
        const baziData = calculateBazi(eightChar); 

        // 更新页面上的八字信息
        document.getElementById('baziOutput').innerText = baziData.baziString; // 假设baziData有一个baziString属性

        // 更新五行计数
        document.getElementById('metalCount').innerText = baziData.wuxingCounts.metal;
        document.getElementById('woodCount').innerText = baziData.wuxingCounts.wood;
        document.getElementById('waterCount').innerText = baziData.wuxingCounts.water;
        document.getElementById('fireCount').innerText = baziData.wuxingCounts.fire;
        document.getElementById('earthCount').innerText = baziData.wuxingCounts.earth;

        // 更新简要分析
        document.getElementById('analysisOutput').innerText = baziData.analysis;

    } catch (error) {
        console.error('八字计算或显示错误:', error);
        alert('计算失败，请检查输入或联系管理员。\n错误详情: ' + error.message);
        document.getElementById('baziOutput').innerText = '计算失败';
        document.getElementById('analysisOutput').innerText = '计算失败';
    }
});

// 如果您有其他关于八卦动画的JavaScript逻辑，可以放在这里
// 例如：
// const baguaAnimation = {
//     update: function(baziInfo) {
//         console.log("更新八卦动画:", baziInfo);
//         document.getElementById('bagua-static-container').style.display = 'none';
//         document.getElementById('bagua-dynamic-container').style.display = 'block';
//         // 实际的动画渲染代码...
//     }
// };