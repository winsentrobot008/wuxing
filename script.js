// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const birthtimeInput = document.getElementById('birthtime');
    const unknownTimeCheckbox = document.getElementById('unknownTime');
    const calculateButton = document.getElementById('calculate-btn');
    
    // 处理"不知道出生时间"复选框
    unknownTimeCheckbox?.addEventListener('change', function() {
        if (birthtimeInput) {
            birthtimeInput.disabled = this.checked;
            if (this.checked) {
                birthtimeInput.value = '';
            }
        }
    });

    // 绑定计算按钮点击事件
    calculateButton?.addEventListener('click', calculate);
});

// 创建雷达图
function createRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['金', '木', '水', '火', '土'],
            datasets: [{
                label: '五行分布',
                data: [data.metal, data.wood, data.water, data.fire, data.earth],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: Math.max(data.metal, data.wood, data.water, data.fire, data.earth) + 1
                }
            }
        }
    });
}

// 创建五行比例饼图
function createProportionPie(data) {
    const ctx = document.getElementById('proportionPie').getContext('2d');
    const elements = [
        { name: '金', value: data.metal, color: '#FFD700', icon: '⚔️' },
        { name: '木', value: data.wood, color: '#228B22', icon: '🌳' },
        { name: '水', value: data.water, color: '#1E90FF', icon: '💧' },
        { name: '火', value: data.fire, color: '#FF4500', icon: '🔥' },
        { name: '土', value: data.earth, color: '#8B4513', icon: '🗺️' }
    ];

    const total = elements.reduce((sum, el) => sum + el.value, 0);

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: elements.map(el => `${el.name} ${el.icon} (${((el.value / total) * 100).toFixed(1)}%)`),
            datasets: [{
                data: elements.map(el => el.value),
                backgroundColor: elements.map(el => el.color),
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `数量: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 计算函数
async function calculate() {
    // 获取表单数据
    const userName = document.getElementById('userName')?.value.trim();
    const birthday = document.getElementById('birthday')?.value;
    const unknownTime = document.getElementById('unknownTime')?.checked;
    const birthtime = unknownTime ? null : document.getElementById('birthtime')?.value;
    const gender = document.getElementById('gender')?.value;
    const resultDiv = document.getElementById('result');

    // 验证必填字段
    if (!birthday || !gender) {
        alert('请填写必要的信息（出生日期、性别）');
        return;
    }

    // 显示加载状态
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<p class="text-center">🧮 正在排盘测算，请稍候…</p>';

    try {
        // 解析日期和时间
        const [year, month, day] = birthday.split('-').map(Number);
        let hour = null;
        
        if (birthtime && !unknownTime) {
            const [h] = birthtime.split(':').map(Number);
            hour = h;
        }

        // 发送请求
        const res = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year,
                month,
                day,
                hour,
                noHour: unknownTime,
                gender,
                userName
            })
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || '计算失败');
        }

        // 渲染结果
        const result = data.data;
        resultDiv.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold mb-4">八字分析结果</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">五行雷达图</h3>
                        <canvas id="radarChart"></canvas>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">五行比例</h3>
                        <canvas id="proportionPie"></canvas>
                    </div>
                </div>

                <h3 class="text-lg font-semibold mt-4 mb-2">基础分析</h3>
                <p class="text-gray-700">${result.analysis.replace(/\n/g, '<br>')}</p>
                
                <h3 class="text-lg font-semibold mt-4 mb-2">纳音五行</h3>
                <p class="text-gray-700">${result.nayinTable.replace(/\n/g, '<br>')}</p>
                
                <h3 class="text-lg font-semibold mt-4 mb-2">五行建议</h3>
                <p class="text-gray-700">${result.wuxingAdvice}</p>
                
                <h3 class="text-lg font-semibold mt-4 mb-2">详细调节建议</h3>
                <p class="text-gray-700">${result.detailedAdvice}</p>
                
                <h3 class="text-lg font-semibold mt-4 mb-2">运势预测</h3>
                <p class="text-gray-700">${result.fortunePrediction}</p>
                
                ${result.nameAnalysis ? `
                    <h3 class="text-lg font-semibold mt-4 mb-2">姓名五行分析</h3>
                    <p class="text-gray-700">姓名五行：${result.nameAnalysis.wuxing.map(w => `${w.char}(${w.element})`).join(' ')}</p>
                    <p class="text-gray-700">${result.nameAnalysis.compatibility.summary}</p>
                ` : ''}
            </div>
        `;

        // 创建图表
        const wuxingData = {
            metal: parseInt(result.analysis.match(/metal: (\d+)/)?.[1] || '0'),
            wood: parseInt(result.analysis.match(/wood: (\d+)/)?.[1] || '0'),
            water: parseInt(result.analysis.match(/water: (\d+)/)?.[1] || '0'),
            fire: parseInt(result.analysis.match(/fire: (\d+)/)?.[1] || '0'),
            earth: parseInt(result.analysis.match(/earth: (\d+)/)?.[1] || '0')
        };

        createRadarChart(wuxingData);
        createProportionPie(wuxingData);

    } catch (error) {
        console.error('请求失败：', error);
        resultDiv.innerHTML = `<p class="text-red-500 text-center">😢 ${error.message}</p>`;
    }
}
