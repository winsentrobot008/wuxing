# 五行分析系统

基于中国传统五行理论的综合性项目，提供八字五行分析、能量符号定制与专属商城服务。

<<<<<<< HEAD
## Git仓库

- **GitHub仓库**: https://github.com/aoogoost5/aoogoost5.git
- **主分支**: master
- **自动部署**: 推送到master分支会自动触发Netlify和Vercel的部署

=======
>>>>>>> 1af66ab390b14a1bf97a1e4da8306e198dc67bd1
## 项目结构

```
/
├── src/                  # 源代码目录
│   ├── components/       # React组件
│   ├── pages/            # Next.js页面
│   ├── services/         # 服务层
│   ├── styles/           # 样式文件
│   └── utils/            # 工具函数
<<<<<<< HEAD
├── api/                  # Vercel API端点
├── netlify/              # Netlify函数
│   └── functions/        # Netlify Functions
├── public/               # 静态资源
├── package.json          # 项目依赖
├── next.config.js        # Next.js配置
├── vercel.json           # Vercel配置
├── netlify.toml          # Netlify配置
=======
├── public/               # 静态资源
├── package.json          # 项目依赖
├── next.config.js        # Next.js配置
>>>>>>> 1af66ab390b14a1bf97a1e4da8306e198dc67bd1
└── README.md             # 项目说明
```

## 功能特点

- **八字五行分析**：输入生辰八字，精准分析五行能量分布
- **能量符号定制**：根据五行分析结果，生成专属能量符号
- **五行能量商城**：选购五行能量符号及相关产品
- **AI驱动的五行能量平衡图片与动图生成及开光服务**（核心营销亮点）：
  - 用户可上传个人图片或选择系统模板，平台通过AI模型自动检测图片中的五行（金木水火土）能量分布，输出专属能量平衡数值。
  - 系统根据用户八字分析结果，智能调整图片的五行能量参数，实现个性化能量优化，生成专属背景图片或动图。
  - 支持一键修改、风格定制、能量强化多种调整方式，满足不同用户的个性化需求。
  - 提供“开光”仪式服务，为生成的能量图片/动图赋予专属祝福与能量加持，提升用户体验与仪式感。
  - 适用于社交头像、壁纸、能量符号、商品包装等多场景，助力个人能量提升与专属定制体验。

### 商城图片五行能量服务

1. **图片上传**：用户可上传个人图片或选择系统模板，支持头像、壁纸、商品包装等多种场景。
2. **五行能量检测**：平台AI模型自动检测图片中的五行（金木水火土）能量分布，输出专属能量平衡数值，并以图表可视化展示。
3. **能量调整与定制**：用户可根据八字分析结果或个人偏好，选择目标五行分布，系统智能调整图片能量参数，支持一键修改、风格定制、能量强化多种方式，生成专属背景图片或动图。
4. **开光仪式**：为生成的能量图片/动图提供开光仪式服务，赋予专属祝福与能量加持，生成认证信息。
5. **结果展示与下载**：用户可对比前后效果，下载、保存、分享到个人中心或社交平台。

- **用户体验**：全流程进度提示，操作简单直观，检测与调整结果可视化，隐私与安全保障，支持积分/付费机制。
## 技术栈

- Next.js
- React
- Chakra UI
- Chart.js
- Lunar-JavaScript（农历计算）
<<<<<<< HEAD
- Netlify Functions
- Vercel Serverless Functions
=======
>>>>>>> 1af66ab390b14a1bf97a1e4da8306e198dc67bd1

## 本地开发

1. 克隆仓库
```bash
<<<<<<< HEAD
git clone https://github.com/aoogoost5/aoogoost5.git
cd aoogoost5
=======
git clone https://github.com/yourusername/wuxing.git
cd wuxing
>>>>>>> 1af66ab390b14a1bf97a1e4da8306e198dc67bd1
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

## 部署

### Vercel部署
项目使用Vercel进行部署，每次推送到主分支会自动触发部署。

<<<<<<< HEAD
- **部署地址**: https://aoogoost5.vercel.app/
- **配置文件**: vercel.json
- **API端点**: /api/calculate-bazi.js

### Netlify部署
项目也支持通过Netlify部署，每次推送到主分支会自动触发部署。

- **部署地址**: https://aoogoost5.netlify.app/
- **配置文件**: netlify.toml
- **Netlify函数**: netlify/functions/calculate-bazi.js
- **详细说明**: 请参考[Netlify部署指南](./NETLIFY-DEPLOY-GUIDE.md)

#### 使用Netlify CLI部署:
=======
### Netlify部署
项目也支持通过Netlify部署，详细说明请参考[Netlify部署指南](./NETLIFY-DEPLOY.md)。

1. 使用Netlify CLI部署:
>>>>>>> 1af66ab390b14a1bf97a1e4da8306e198dc67bd1
```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录Netlify
netlify login

# 初始化项目
netlify init

# 部署
netlify deploy --prod
```

<<<<<<< HEAD
## 平台差异

- **前端代码**: 会自动检测当前平台（Vercel或Netlify），并调用相应的API端点
- **API端点**: 
  - Vercel: `/api/calculate-bazi`
  - Netlify: `/.netlify/functions/calculate-bazi`
- **版本信息**: 在分析结果页面可以看到当前使用的API版本和平台信息

=======
>>>>>>> 1af66ab390b14a1bf97a1e4da8306e198dc67bd1
## 许可证

MIT