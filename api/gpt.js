export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  // ✅ 来源验证
  const allowedReferers = [
    'https://five-elements.netlify.app',
    'https://five-elements-eta.vercel.app',
    'https://five-elements-5ty8n9qur-five-elements-projects.vercel.app'
  ];
  const referer = req.headers.referer || '';
  if (!allowedReferers.some(r => referer.startsWith(r))) {
    console.warn('[拦截] 非法来源请求：', referer);
    return res.status(403).json({ error: 'Forbidden: 非法来源请求' });
  }

  // ✅ 密钥校验
  const clientKey = req.headers['x-secret-key'];
  const serverKey = process.env.INTERNAL_ACCESS_KEY;
  if (!serverKey || clientKey !== serverKey) {
    console.warn('[拦截] 密钥验证失败：', clientKey);
    return res.status(403).json({ error: 'Forbidden: 验证失败' });
  }

  // ✅ 参数校验
  const { name, gender, birthday, hour, city } = req.body || {};
  if (!name || !gender || !birthday || !city) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const prompt = `
用户：${name}，性别：${gender}，出生：${birthday} ${hour}，城市：${city}
请用国风文风，分析命主的五行格局，性格特质，人生建议，附上一句诗收尾。
`;

  const apiKey = process.env.OPENAI_API_KEY;
  const preferredModels = ['gpt-4', 'gpt-3.5-turbo'];

  for (let model of preferredModels) {
    console.log('🔮 [尝试模型]', model);
    console.log('📤 [Prompt]', prompt.trim());
    console.log('🔑 [API Key 前缀]', apiKey?.slice(0, 8) + '…');

    try {
      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8
        })
      });

      if (!completion.ok) {
        const text = await completion.text();
        console.warn(`⚠️ [${model} 失败]`, completion.status, text);

        // 如果是 GPT-4 且错误是模型无权限，再 fallback
        if (
          model === 'gpt-4' &&
          (text.includes('model') && text.includes('not exist' || 'access'))
        ) {
          continue; // 尝试下一个模型
        }

        return res.status(500).json({ error: 'GPT 服务异常，请稍后再试' });
      }

      const data = await completion.json();
      const result = data.choices?.[0]?.message?.content || '命盘解析失败，请稍后再试';
      console.log(`✅ [成功] ${name} 使用 ${model} 测算完成`);
      return res.status(200).json({ result });

    } catch (err) {
      console.error(`💥 [${model} 请求异常]`, err);
    }
  }

  // 所有模型都失败
  return res.status(500).json({ error: '所有 GPT 模型均不可用，请稍后再试' });
}
