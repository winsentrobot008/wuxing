export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST' });
  }

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return res.status(500).json({ error: '缺少 GOOGLE_API_KEY' });
  }

  const { name, gender, birthday, hour, city } = req.body;
  if (!name || !gender || !birthday || !city) {
    return res.status(400).json({ error: '缺少参数' });
  }

  // 构造国风 prompt
  const prompt = `用户：${name}，性别：${gender}，出生：${birthday}${hour}，城市：${city}
请用国风文风分析五行格局、性格特质、人生建议，并附一句诗。`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.8,
          candidateCount: 1
        })
      }
    );
    if (!r.ok) {
      const err = await r.text();
      console.error('Gemini Error:', err);
      return res.status(500).json({ error: 'Gemini 接口异常' });
    }
    const json = await r.json();
    const text = json.candidates?.[0]?.content?.text || '';
    return res.status(200).json({ result: text });
  } catch (e) {
    console.error('Network Error:', e);
    return res.status(500).json({ error: '网络或服务错误' });
  }
}
