// check-env.js

import fs from 'fs';
import dotenv from 'dotenv';

const envPath = './.env';
dotenv.config({ path: envPath });

console.log('🔍 正在检查 .env 文件是否存在...');
if (!fs.existsSync(envPath)) {
  console.error('❌ 错误：未找到 .env 文件，请确保位于项目根目录');
  process.exit(1);
}

console.log('📄 已找到 .env 文件，正在读取变量...');

const requiredKeys = ['OPENAI_API_KEY'];
let allPassed = true;

for (const key of requiredKeys) {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ 缺失环境变量：${key}`);
    allPassed = false;
  } else {
    const masked = value.slice(0, 8) + '...' + value.slice(-4);
    console.log(`✅ 已加载 ${key}：${masked}`);
  }
}

if (allPassed) {
  console.log('\n🌟 检查通过：.env 文件配置正确！你可以开始使用 GPT 接口啦 🚀');
  process.exit(0);
} else {
  console.warn('\n⚠️ 请修复上述缺失的变量后再试一次');
  process.exit(1);
}
