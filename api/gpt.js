import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';

console.log("🔑 你当前的 API Key 是：", process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
  const { name, gender, birthday, hour, city } = req.body;

  const prompt = `
你是一位资深国学大师，请根据以下出生信息进行五行分析，并用温和文艺的口吻写出结果和建议：

- 姓名：${name || '未知'}
- 性别：${gender || '未知'}
- 生日：${birthday || '未知'}
- 出生时辰：${hour || '未知'}
- 出生城市：${city || '未知'}

请分析其五行分布、主五行、性格特点，并给出有诗意的生活建议和幸运颜色。
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
}

// 本地测试触发（你只需运行 node api/gpt.js）
if (import.meta.url === `file://${process.argv[1]}`) {
  const req = {
    body: {
      name: "小白",
      gender: "female",
      birthday: "1990-06-28",
      hour: "午时",
      city: "杭州"
    }
  };

  const res = {
    status: () => ({
      json: (data) => {
        console.log("🧧 AI 返回结果：\n");
        console.log(data.result);
      }
    })
  };

  handler(req, res);
}
