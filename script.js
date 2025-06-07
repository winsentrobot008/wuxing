document.getElementById('calculateBtn').addEventListener('click', calculateBazi);

async function calculateBazi() {
    // 获取用户输入的出生信息
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);
    const hour = parseInt(document.getElementById('hour').value);

    // 简单的输入验证
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        alert('请输入完整的出生信息！');
        return;
    }

    try {
        // 向 Netlify Function 后端服务发送 POST 请求
        // URL 现在指向您的 Netlify Function，它是相对于您的网站根目录的路径
        const response = await fetch('/.netlify/functions/calculateBazi', {
            method: 'POST', // 指定请求方法为 POST
            headers: {
                'Content-Type': 'application/json' // 告诉服务器我们发送的是 JSON 数据
            },
            // 将出生信息对象转换为 JSON 字符串作为请求体
            body: JSON.stringify({ year, month, day, hour })
        });

        // 解析服务器返回的 JSON 响应
        const data = await response.json();

        // 根据响应状态码判断请求是否成功
        if (response.ok) { // response.ok 表示状态码在 200-299 之间
            // 更新页面显示结果
            document.getElementById('baziOutput').innerText =
                `${data.bazi.year} ${data.bazi.month} ${data.bazi.day} ${data.bazi.hour}`;
            document.getElementById('metalCount').innerText = data.wuxingCounts['金'];
            document.getElementById('woodCount').innerText = data.wuxingCounts['木'];
            document.getElementById('waterCount').innerText = data.wuxingCounts['水'];
            document.getElementById('fireCount').innerText = data.wuxingCounts['火'];
            document.getElementById('earthCount').innerText = data.wuxingCounts['土'];
            document.getElementById('analysisOutput').innerText = data.analysis;

        } else {
            // 如果响应不成功，显示错误信息
            alert('计算失败: ' + (data.message || '未知错误'));
            console.error('后端错误:', data);
        }
    } catch (error) {
        // 捕获网络请求或解析错误
        console.error('Fetch error:', error);
        alert('连接服务器失败，请检查网络或稍后再试。');
    }
}