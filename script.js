// script.js (最新内容)

function calculateWuXing() {
  const birthdayInput = document.getElementById('birthday').value;
  const hourInput = document.getElementById('hour').value;
  const noHour = document.getElementById('noHour').checked;
  const gender = document.getElementById('gender').value; // male/female
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
    // 如果勾选了不知道时辰，hour设为0，lunar.js会按日柱计算
    const hour = parseInt(hourInput || '0');

    const solar = noHour
      ? Solar.fromYmd(year, month, day)
      : Solar.fromYmdHms(year, month, day, hour, 0, 0);

    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();
    // 传递lunar对象给calculateBazi，以便进行更多分析
    const baziAnalysis = calculateBazi(eightChar, noHour, gender, lunar);

    // 生成五行分布，添加可点击链接
    let analysisHtml = '<ul>';
    for (const k in baziAnalysis.wuxingCounts) {
      analysisHtml += `<li><a href="#" class="wuxing" data-element="${k}">${baziAnalysis.fiveElementDetails[k].name}</a>：${baziAnalysis.wuxingCounts[k]}个</li>`;
    }
    analysisHtml += '</ul>';
    analysisHtml += `<p>${baziAnalysis.analysis}</p>`;


    // 构建显示结果的HTML
    let htmlOutput = `
      <p>🌟农历：${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日</p>
      <p>🌟生肖：${lunar.getYearShengXiao()}</p>
      <p>🌟八字：${baziAnalysis.baziString}</p>
      <p>🌟纳音五行：${lunar.getYearNaYin()} ${lunar.getMonthNaYin()} ${lunar.getDayNaYin()} ${noHour ? "" : lunar.getTimeNaYin()}</p>
      
      <h3>日主强弱：</h3>
      <p>${baziAnalysis.dayGanStrength}</p>

      <h3>五行分布分析：</h3>
      ${analysisHtml}
      
      <p><strong>🧠 用神建议：</strong></p>
      <p>${baziAnalysis.nameAdvice}</p>

      <p><strong>📜 命格性格提示：</strong></p>
      <p>${baziAnalysis.characterSummary}</p>
    `;

    // 显示十神
    htmlOutput += `<h3>十神分析：</h3>`;
    if (baziAnalysis.shiShenGans.length > 0) {
        htmlOutput += `<p>天干十神：<span class="shi-shen-list">${baziAnalysis.shiShenGans.map(item => `<span class="shi-shen-item">${item}</span>`).join('')}</span></p>`;
    }
    if (baziAnalysis.shiShenZhis.length > 0) {
        htmlOutput += `<p>地支藏干十神：<span class="shi-shen-list">${baziAnalysis.shiShenZhis.map(item => `<span class="shi-shen-item">${item}</span>`).join('')}</span></p>`;
    } else if (baziAnalysis.shiShenGans.length === 0) { // 如果天干十神也没有，显示无
        htmlOutput += `<p>无十神信息。</p>`;
    }


    // 显示神煞
    htmlOutput += `<h3>神煞信息：</h3>`;
    if (baziAnalysis.shenShaInfo.length > 0) {
        htmlOutput += `<p><span class="shen-sha-list">${baziAnalysis.shenShaInfo.map(item => `<span class="shen-sha-item">${item}</span>`).join('')}</span></p>`;
    } else {
        htmlOutput += `<p>无神煞信息。</p>`;
    }

    // 显示空亡
    htmlOutput += `<h3>空亡查询：</h3>`;
    if (baziAnalysis.kongWangInfo.length > 0) {
        htmlOutput += `<p><span class="kong-wang-list">${baziAnalysis.kongWangInfo.map(item => `<span class="kong-wang-item">${item}</span>`).join('')}</span></p>`;
    } else {
        htmlOutput += `<p>无空亡。</p>`;
    }

    // 显示大运
    htmlOutput += `<h3>大运：</h3><table><thead><tr><th>起始年龄</th><th>起始年份</th><th>大运干支</th></tr></thead><tbody>`;
    let tenYunCounter = 0;
    for (const yun of baziAnalysis.tenYuns) {
        // 大运的起始年龄 (lunar.js 大运从8岁左右开始，每10年一步)
        const startAge = yun.getStartAge();
        const startYear = yun.getStartYear();
        htmlOutput += `<tr><td>${startAge}岁</td><td>${startYear}年</td><td>${yun.getGan().getName()}${yun.getZhi().getName()}</td></tr>`;
        tenYunCounter++;
        if (tenYunCounter >= 10) break; // 限制显示10步大运
    }
    htmlOutput += `</tbody></table>`;


    // 显示流年
    htmlOutput += `<h3>未来流年（近60年）：</h3><div class="liu-nian-scroll-box">`;
    for (const liuNian of baziAnalysis.liuNians) {
        htmlOutput += `<p>${liuNian}</p>`;
    }
    htmlOutput += `</div>`;


    resultDiv.innerHTML = htmlOutput;

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
    console.error('八字计算或显示错误:', error);
    resultDiv.innerHTML = `计算错误: ${error.message}<br>请检查输入信息或联系管理员。`;
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