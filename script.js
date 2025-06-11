let radarChart, barChart;

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

    resultDiv.innerHTML = `
      <p>🌟农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日</p>
      <p>🌟生肖：${lunar.getYearShengXiao()}</p>
      <p>🌟八字：${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${noHour ? "(未知)" : eightChar.getTime()}</p>
      <p>🌈 纳音五行：</p>
      ${baziAnalysis.nayinTable}
      <hr>
      <p><strong>🔎 五行分布分析：</strong></p>
      ${baziAnalysis.analysis}
      <hr>
      <p><strong>🎯 喜用神推荐：</strong></p>
      ${baziAnalysis.yongshenAdvice}
      <hr>
      <p><strong>🧠 名字建议：</strong></p>
      ${baziAnalysis.nameAdvice}
      <hr>
      <p><strong>📜 命格性格提示：</strong></p>
      ${baziAnalysis.characterSummary}
    `;

    renderCharts(baziAnalysis.wuxingCounts);
  } catch (error) {
    resultDiv.innerHTML = `❌ 错误：${error.message}`;
    console.error(error);
  }
}

function renderCharts(wuxingCounts) {
  const keys = ['metal', 'wood', 'water', 'fire', 'earth'];
  const labels = ['金', '木', '水', '火', '土'];
  const data = keys.map(key => wuxingCounts[key] || 0);

  // 销毁旧图表
  if (radarChart) radarChart.destroy();
  if (barChart) barChart.destroy();

  const radarCtx = document.getElementById('wuxingRadarChart').getContext('2d');
  const barCtx = document.getElementById('wuxingBarChart').getContext('2d');

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

  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '五行数量',
        data: data,
        backgroundColor: [
          '#f1c40f', '#27ae60', '#3498db', '#e74c3c', '#a57c1b'
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
