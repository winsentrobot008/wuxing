// 文件路径：api/gemini.js  （或 Next.js 下 pages/api/gemini.js）
export default async function handler(req, res) {
  console.log('🔔 收到请求，方法：', req.method);
  console.log('🔔 请求体：', JSON.stringify(req.body));

  if (req.method !== 'POST') {
    console.error('❌ 只支持 POST');
    return res.status(405).json({ error: '仅支持 POST' });
  }

  const key = process.env.GOOGLE_API_KEY;
  console.log('🔑 GOOGLE_API_KEY:', key ? '已加载' : '未设置');
  if (!key) {
    console.error('❌ Missing GOOGLE_API_KEY');
    return res.status(500).json({ error: 'Missing GOOGLE_API_KEY' });
  }

  const { name, gender, birthday, hour, city } = req.body;
  console.log('📋 参数：', { name, gender, birthday, hour, city });
  if (!name || !gender || !birthday || !city) {
    console.error('❌ 缺少必要参数');
    return res.status(400).json({ error: '缺少参数' });
  }

  const prompt = `用户：${name}，性别：${gender}，出生：${birthday}${hour}，城市：${city}
请用国风文风分析五行格局、性格特质、人生建议，并附一句诗。`;
  console.log('✏️ 生成 prompt：', prompt);

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: { text: prompt }, temperature: 0.8, candidateCount: 1 })
      }
    );

    console.log('🌐 Google 响应状态：', r.status);
    const text = await r.text();
    if (!r.ok) {
      console.error('❌ Google API 返回错误：', text);
      return res.status(500).json({ error: 'Google API 调用失败' });
    }

    const json = JSON.parse(text);
    const result = json.candidates?.[0]?.content?.text || '';
    console.log('✅ 最终结果：', result);

    return res.status(200).json({ result });
  } catch (err) {
    console.error('💥 未捕获异常：', err);
    return res.status(500).json({ error: err.message });
  }
}
