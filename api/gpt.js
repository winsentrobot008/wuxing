export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  // ✅ 支持多个来源域名
  const allowedReferers = [
    'https://five-elements.netlify.app',
    'https://five-elements-eta.vercel.app'
  ];
  const referer = req.headers.referer || '';
  if (!allowedReferers.some(r => referer.startsWith(r))) {
    console.warn(`[拦截] 非法来源请求：${referer}`);
    return res.status(403).json({ error: 'Forbidden: 非法来源请求' });
  }

  // ✅ 校验密钥
  const clientKey = req.headers['x-secret-key'];
  const serverKey = process.env.INTERNAL_ACCESS_KEY;
  if (!serverKey || clientKey !== serverKey) {
    console.warn(`[拦截] 密钥验证失败：${clientKey}`);
    return res.status(403).json({ error: 'Forbidden: 验证失败' });
  }

  const { name, gender, birthday, hour, city } = req.body || {};
  if (!name || !gender || !birthday || !city) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const prompt = `
用户：${name}，性别：${gender}，出生：${birthday} ${hour}，城市：${city}
请用国风文风，分析命主的五行格局，性格特质，人生建议，附上一句诗收尾。
`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
console.log('[GPT 请求开始]');
console.log('[Prompt 内容]', prompt);

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    });

    // ✅ 若 GPT 报错或非 200 状态
    if (!completion.ok) {
      const text = await completion.text();
      console.error('[GPT 错误]', completion.status, text);
      return res.status(500).json({ error: 'GPT 服务异常，请稍后再试' });
    }

    const data = await completion.json();
    const result = data.choices?.[0]?.message?.content || '命盘解析失败，请稍后再试';

    console.log(`[成功] ${name} 测算完成`);
    return res.status(200).json({ result });

  } catch (err) {
    console.error('[GPT 请求失败]', err);
    return res.status(500).json({ error: '服务暂不可用，请稍后重试' });
  }
}
