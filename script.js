function start() {
  const date = document.getElementById('birthday').value;
  const output = document.getElementById('output');
  if (!date) {
    output.innerHTML = '<p style="color:red">请输入你的出生日期</p>';
    return;
  }

  // 模拟五行结果（演示用）
  const elements = ['金', '木', '水', '火', '土'];
  const scores = elements.map(() => Math.floor(Math.random() * 30) + 10);
  const dominant = elements[scores.indexOf(Math.max(...scores))];

  output.innerHTML = `
    <h2>✨ 五行分布 ✨</h2>
    <p>金：${scores[0]} | 木：${scores[1]} | 水：${scores[2]} | 火：${scores[3]} | 土：${scores[4]}</p>
    <p><strong>主元素：</strong>${dominant}</p>
    <p>🌟 建议颜色：${dominant === '火' ? '红' : dominant === '水' ? '蓝' : dominant === '金' ? '白' : dominant === '木' ? '绿' : '黄'}</p>
  `;
}
