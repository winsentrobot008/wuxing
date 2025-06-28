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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        gender,
        birthday,
        hour,
        city
      })
    });

    const data = await res.json();
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
