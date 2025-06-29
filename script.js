document.getElementById('submit-btn').addEventListener('click', async function () {
  const name = document.getElementById('name')?.value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
  const birthday = document.getElementById('birthday')?.value;
  const hourUnknown = document.getElementById('hour-unknown')?.checked;
  const hour = hourUnknown ? '未知' : document.getElementById('hour')?.value || '未知';
  const city = document.getElementById('city')?.value.trim();
  const output = document.getElementById('output');

  if (!birthday || !name || !city || !gender) {
    output.innerHTML = '<p style="color:red;">请填写完整的出生信息</p>';
    return;
  }

  output.innerHTML = '🧮 AI 正在排盘测算，请稍候…';

  try {
    const res = await fetch('/api/gpt.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': 'my-secret-key-888' // 与服务器中 .env 保持一致
      },
      body: JSON.stringify({
        name,
        gender,
        birthday,
        hour,
        city
      })
    });

    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      console.error('JSON 解析失败', e);
      output.innerHTML = '<p style="color:red;">❌ 服务器响应格式异常，请稍后重试</p>';
      return;
    }

    if (!res.ok) {
      output.innerHTML = `<p style="color:red;">❌ 接口错误：${data.error || '未知错误'}</p>`;
      return;
    }

    output.innerHTML = `
      <div class="result-card">
        <h2>🌟 命盘解析结果</h2>
        <p>${data.result.replace(/\n/g, '<br>')}</p>
      </div>
    `;
  } catch (error) {
    console.error('请求失败：', error);
    output.innerHTML = '<p style="color:red;">😢 请求失败，请检查网络或稍后再试</p>';
  }
});
