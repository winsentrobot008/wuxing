function calculateWuXing() {
  const birthdayInput = document.getElementById('birthday').value;
  const hourInput = document.getElementById('hour').value;
  const noHour = document.getElementById('noHour').checked;
  const gender = document.getElementById('gender').value;
  const resultDiv = document.getElementById('result');

  if (!birthdayInput || (!hourInput && !noHour)) {
    resultDiv.innerHTML = '请填写出生日期和时辰（或勾选“不知道出生时辰”）！';
    return;
  }

  try {
    const date = new Date(birthdayInput);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = parseInt(hourInput || '0');

    const solar = noHour
      ? Solar.fromYmd(year, month, day)
      : Solar.fromYmdHms(year, month, day, hour, 0, 0);

    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();
    const baziAnalysis = calculateBazi(eightChar, noHour, gender, lunar);

    // 生成五行分布，添加可点击链接
    let analysisHtml = '';
    for (const k in baziAnalysis.wuxingCounts) {
      analysisHtml += `<a href="#" class="wuxing" data-element="${k}">${baziAnalysis.fiveElementDetails[k].name}</a>：${baziAnalysis.wuxingCounts[k]}个<br>`;
    }
    const imbalances = baziAnalysis.analysis.match(/⚠️.*|✅.*/)[0];
    analysisHtml += `<br>${imbalances}`;

    resultDiv.innerHTML = `
      <p>🌟农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日</p>
      <p>🌟生肖：${lunar.getYearShengXiao()}</p>
      <p>🌟八字：${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${noHour ? "(未知)" : eightChar.getTime()}</p>
      <p>🌟纳音五行：${lunar.getYearNaYin()}</p>
      <hr>
      <p><strong>🔎 五行分布分析：</strong></p>
      ${analysisHtml}
      <hr>
      <p><strong>🧠 用神建议：</strong></p>
      ${baziAnalysis.nameAdvice}
      <hr>
      <p><strong>📜 命格性格提示：</strong></p>
      ${baziAnalysis.characterSummary}
    `;

    // 添加五行点击事件
    document.querySelectorAll('.wuxing').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const element = e.target.dataset.element;
        const details = baziAnalysis.fiveElementDetails[element];
        showModal(details);
      });
    });
  } catch (error) {
    resultDiv.innerHTML = `❌ 错误：${error.message}`;
    console.error(error);
  }
}

// 显示模态框
function showModal(details) {
  const modal = document.getElementById('wuxingModal');
  document.getElementById('modalTitle').textContent = `${details.name}五行详解`;
  document.getElementById('modalCharacter').textContent = `性格：${details.character}`;
  document.getElementById('modalHealth').textContent = `健康：${details.health}`;
  document.getElementById('modalCareer').textContent = `职业：${details.career}`;
  modal.style.display = 'flex';
}

// 关闭模态框
function closeModal() {
  document.getElementById('wuxingModal').style.display = 'none';
}

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
  const modal = document.getElementById('wuxingModal');
  if (e.target === modal) {
    closeModal();
  }
});