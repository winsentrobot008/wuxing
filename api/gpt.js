export default async function handler(req, res) {
  // 限制仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  // ✅ 校验来源域名 Referer（防止盗链）
  const allowedReferer = 'https://five-elements.netlify.app'; // 替换成你自己正式网址
  const referer = req.headers.referer || '';
  if (!referer.startsWith(allowedReferer)) {
    console.warn(`[拦截] 非法来源请求：${referer}`);
    return res.status(403).json({ error: 'Forbidden: 非法来源请求' });
  }

  // ✅ 校验密钥
  const serverKey = process.env.INTERNAL_ACCESS_KEY;
  const clientKey = req.headers['x-secret-key'];
  if (!serverKey || clientKey !== serverKey) {
    console.warn(`[拦截] 密钥验证失败：${clientKey}`);
    return res.status(403).json({ error: 'Forbidden: 验证失败' });
  }

  // ✅ 校验参数完整性
  const { name, gender, birthday, hour, city } = req.body || {};
  if (!name || !gender || !birthday || !city) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  // 构造命令 prompt
  const prompt = `
用户：${name}，性别：${gender}，出生：${birthday} ${hour}，城市：${city}
请用国风文风，分析命主的五行格局，性格特质，人生建议，附上一句诗收尾。
`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
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

    const data = await completion.json();
    const result = data.choices?.[0]?.message?.content || '命盘解析失败，请稍后再试';

    console.log(`[成功] ${name} 请求测算完成`);
    return res.status(200).json({ result });

  } catch (err) {
    console.error('[错误] GPT 请求失败：', err);
    return res.status(500).json({ error: '服务暂不可用，请稍后再试' });
  }
}
