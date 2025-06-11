function calculateWuXing() {
  // 获取输入
  const birthdayInput = document.getElementById('birthday').value;
  const hourInput = document.getElementById('hour').value;
  const resultDiv = document.getElementById('result');

  // 检查输入是否为空
  if (!birthdayInput || !hourInput) {
    resultDiv.innerHTML = '请填写出生日期和时辰！';
    return;
  }

  try {
    // 解析日期
    const date = new Date(birthdayInput);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需加1
    const day = date.getDate();
    const hour = parseInt(hourInput);

    // 检查输入有效性
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || hour < 0 || hour > 23) {
      resultDiv.innerHTML = '请输入有效的日期和时辰（0-23小时）！';
      return;
    }

    // 使用 lunar-javascript 的 Solar 类
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();

    // 获取八字（天干地支）
    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const hourGanZhi = lunar.getTimeInGanZhi();

    // 时辰中文
    const timeZhi = lunar.getTimeZhi();
    const timeNames = {
      '子': '子时 (23:00-01:00)',
      '丑': '丑时 (01:00-03:00)',
      '寅': '寅时 (03:00-05:00)',
      '卯': '卯时 (05:00-07:00)',
      '辰': '辰时 (07:00-09:00)',
      '巳': '巳时 (09:00-11:00)',
      '午': '午时 (11:00-13:00)',
      '未': '未时 (13:00-15:00)',
      '申': '申时 (15:00-17:00)',
      '酉': '酉时 (17:00-19:00)',
      '戌': '戌时 (19:00-21:00)',
      '亥': '亥时 (21:00-23:00)'
    };
    const timeChinese = timeNames[timeZhi || timeZhi];

    // 五行映射
    const wuXingMap = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };

    // 提取天干
    const yearGan = yearGanZhi[0];
    const monthGan = monthGanZhi[0];
    const dayGan = dayGanZhi[0];
    const hourGan = hourGanZhi[0];

    // 计算五行
    const wuXing = {
      year: wuXingMap[yearGan] || '未知';
      monthGanZhi = wuXingMap[monthGan] || '未知';
      dayGanZhi = wuXingMap[dayGan] || '未知';
      hourGanZhi = wuXingMap[hourGan] || '未知';
    };

    // 统计五行分布
    const wuXingCount = {};
    Object.values(wuXing).forEach(element => {
      wuXingCount[element] = (wuXingCount[element] || 0) + 1;
    });

    // 显示结果
    resultDiv.innerHTML = `
      <p>农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日 ${timeChinese}</p>
      <p>八字：${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}</p>
      <p>五行：年(${wuXing.year}) 月(${wuXing.month}) 日(${wuXing.day}) 时(${wuXing.hour})</p>
      <p>五行分布：${JSON.stringify(wuXingCount)}</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `错误：${error.message}`;
    console.error(error);
  }
}