function calculateWuXing() {
  const birthdayInput = document.getElementById('birthday').value;
  const hourInput = document.getElementById('hour').value;
  const noHour = document.getElementById('noHour').checked;
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

    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const hourGanZhi = noHour ? '(未知)' : lunar.getTimeInGanZhi();

    const wuXingMap = {
      '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
      '庚': '金', '辛': '金', '壬': '水', '癸': '水'
    };

    const yearGan = yearGanZhi[0];
    const monthGan = monthGanZhi[0];
    const dayGan = dayGanZhi[0];
    const hourGan = noHour ? null : hourGanZhi[0];

    const wuXing = {
      year: wuXingMap[yearGan] || '未知',
      month: wuXingMap[monthGan] || '未知',
      day: wuXingMap[dayGan] || '未知',
      hour: noHour ? '未知' : (wuXingMap[hourGan] || '未知')
    };

    const wuXingCount = {};
    Object.values(wuXing).forEach(element => {
      if (element !== '未知') {
        wuXingCount[element] = (wuXingCount[element] || 0) + 1;
      }
    });

    const eightChar = lunar.getEightChar();
    const baziAnalysis = calculateBazi(eightChar, noHour);

    resultDiv.innerHTML = `
      <p>农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日</p>
      <p>八字：${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}</p>
      <p>五行：年(${wuXing.year}) 月(${wuXing.month}) 日(${wuXing.day}) 时(${wuXing.hour})</p>
      <p>五行简析：${JSON.stringify(wuXingCount)}</p>
      <hr>
      <p><strong>八字五行详细分析：</strong></p>
      <pre>${baziAnalysis.analysis}</pre>
      <p><strong>起名用字建议：</strong></p>
      <pre>${baziAnalysis.nameAdvice}</pre>
    `;
  } catch (error) {
    resultDiv.innerHTML = `错误：${error.message}`;
    console.error(error);
  }
}
