// public/script.js

// 用于存储 Chart.js 实例的变量，方便后续更新或销毁
let radarChart, barChart;

// 监听计算按钮点击事件
document.getElementById('calculateBtn').addEventListener('click', async () => {
    const birthdayInput = document.getElementById('birthday');
    const hourInput = document.getElementById('hour');
    const noHourCheckbox = document.getElementById('noHour');
    const genderSelect = document.getElementById('gender');
    const resultDiv = document.getElementById('result');

    const birthday = birthdayInput.value;
    const hour = parseInt(hourInput.value);
    const noHour = noHourCheckbox.checked;
    const gender = genderSelect.value;

    // 清空上次的结果和图表
    resultDiv.innerHTML = '';
    if (radarChart) radarChart.destroy();
    if (barChart) barChart.destroy();

    if (!birthday) {
        alert('请选择出生日期！');
        return;
    }
    if (!noHour && (isNaN(hour) || hour < 0 || hour > 23)) {
        alert('请输入有效的出生时辰（0-23小时）或勾选“不知道出生时辰”。');
        return;
    }

    try {
        // 调用后端无服务器函数
        // 在 Vercel 或 Netlify 上部署时，相对路径 '/api/calculate-bazi' 会自动指向你的后端函数
        const response = await fetch('/api/calculate-bazi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ birthday, hour, noHour, gender })
        });

        const data = await response.json();

        // 检查后端返回的状态码，判断请求是否成功
        if (!response.ok) {
            alert('计算失败：' + (data.error || '未知错误'));
            console.error('后端错误:', data.error);
            return;
        }

        // 从后端获取计算结果和建议
        const {
            eightChar,
            wuxingCounts,
            riGan,
            riElement,
            strong,
            yongshenAdvice,
            recommendedNames,
            wuxingBalanceAdvice, // 从后端获取的五行平衡建议
            fortunePrediction    // 从后端获取的简易运势预测
        } = data;


        // 显示测算结果
        resultDiv.innerHTML = `
            <h3>您的八字和五行分析：</h3>
            <p><strong>八字：</strong>${eightChar.yearGanZhi} ${eightChar.monthGanZhi} ${eightChar.dayGanZhi} ${noHour ? '' : eightChar.timeGanZhi}</p>
            <p><strong>日主：</strong>${riGan} (${riElement}) - 属于“${strong ? "身强" : "身弱"}”之命。</p>
            <p><strong>五行数量：</strong></p>
            <ul>
                <li>金：${wuxingCounts.metal || 0}</li>
                <li>木：${wuxingCounts.wood || 0}</li>
                <li>水：${wuxingCounts.water || 0}</li>
                <li>火：${wuxingCounts.fire || 0}</li>
                <li>土：${wuxingCounts.earth || 0}</li>
            </ul>
            <p>${yongshenAdvice}</p>
            <p><strong>建议取名用字（五行属${yongshenAdvice.match(/推荐喜用神方向：(.*?)\s→/)[1]}）：</strong> ${recommendedNames.join('、')}</p>
            <p><strong>五行平衡建议：</strong>${wuxingBalanceAdvice}</p>
            <p><strong>简易运势预测：</strong>${fortunePrediction}</p>
        `;

        // 绘制五行雷达图和柱状图
        drawCharts(wuxingCounts);

    } catch (e) {
        alert('与服务器通信失败，请检查网络或稍后再试。');
        console.error('前端请求错误:', e);
    }
});

// 监听重置按钮点击事件
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('birthday').value = '';
    document.getElementById('hour').value = '';
    document.getElementById('noHour').checked = false;
    document.getElementById('gender').value = 'male';
    document.getElementById('result').innerHTML = '';
    if (radarChart) radarChart.destroy();
    if (barChart) barChart.destroy();
});


// 绘制五行图表函数
function drawCharts(wuxingCounts) {
    const labels = ['金', '木', '水', '火', '土'];
    const data = [
        wuxingCounts.metal || 0,
        wuxingCounts.wood || 0,
        wuxingCounts.water || 0,
        wuxingCounts.fire || 0,
        wuxingCounts.earth || 0
    ];

    // 如果图表已存在，先销毁
    if (radarChart) radarChart.destroy();
    if (barChart) barChart.destroy();

    const radarCtx = document.getElementById('wuxingRadarChart').getContext('2d');
    const barCtx = document.getElementById('wuxingBarChart').getContext('2d');

    // 雷达图
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '五行雷达图',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // 柱状图
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '五行数量',
                data: data,
                backgroundColor: [
                    '#f1c40f', // 土 - 黄
                    '#27ae60', // 木 - 绿
                    '#3498db', // 水 - 蓝
                    '#e74c3c', // 火 - 红
                    '#a57c1b'  // 金 - 灰/白 (这里用咖啡色代替，因为白色不明显)
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}


// ============== PWA Service Worker 注册代码 ==============
// 确保在你的 public/index.html 中也添加了 <link rel="manifest" href="/manifest.json">
// 并确保 public/sw.js 文件存在

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker 注册成功:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker 注册失败:', error);
            });
    });
}