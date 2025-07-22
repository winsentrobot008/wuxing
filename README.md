# 五行分析系统 (Five Elements Analysis System)

基于中国传统五行理论的综合性项目，提供八字五行分析、能量符号定制与专属商城服务。

*A comprehensive project based on traditional Chinese Five Elements theory, providing BaZi analysis, energy symbol customization, and exclusive marketplace services.*

## 🌟 项目概述 (Project Overview)

五行分析系统结合古老智慧与现代科技，为用户提供个性化的命理分析和能量平衡解决方案。借鉴Starla等成功APP的商业模式，我们专注于创造具有社交传播价值的个性化内容。

*The Five Elements Analysis System combines ancient wisdom with modern technology, providing personalized destiny analysis and energy balance solutions. Drawing from successful apps like Starla, we focus on creating shareable, personalized content.*

## Git仓库 (Repository)

- **GitHub仓库**: `https://github.com/aoogoost5/aoogoost5.git`
- **主分支**: master
- **自动部署**: 推送到master分支会自动触发Netlify和Vercel的部署

## 🚀 核心功能 (Core Features)

### 当前功能 (Current Features)
- **八字五行分析**: 输入生辰八字，精准分析五行能量分布
- **可视化图表**: 饼图和雷达图展示五行分布
- **五行平衡图片生成**: 基于用户五行数据生成个性化能量平衡图
- **能量符号定制**: 根据五行分析结果，生成专属能量符号
- **多语言支持**: 中英文界面，适应全球用户

### 规划功能 (Planned Features)
- **缘分预测**: 基于五行理论的理想伴侣特征分析
- **AI画像生成**: 生成"命定伴侣"的五行能量画像
- **社交分享**: 一键分享个性化分析结果
- **付费深度报告**: 详细的命理分析和建议

## 🎨 五行平衡图片生成规则 (Five Elements Balance Image Generation Rules)

### 核心理念 (Core Concept)
五行平衡图片生成遵循传统中医"阴阳平衡"和"五行相生相克"理论，通过视觉化方式帮助用户调和自身能量场。

### 平衡算法 (Balance Algorithm)

#### 1. 反向平衡原则 (Inverse Balance Principle)
- **过多元素减少**: 用户五行中数值较高的元素，在生成图片中占比相对减少
- **缺失元素增强**: 用户五行中数值较低或为0的元素，在图片中占比相对增加
- **目标**: 使图片中的五行分布趋向于理想的平衡状态（每个元素约20%）

#### 2. 计算公式 (Calculation Formula)

## 💼 商业模式 (Business Model)

借鉴Starla等成功APP的策略：
- **免费基础分析**: 吸引用户体验
- **付费深度报告**: $9.99 详细分析
- **社交传播**: 鼓励用户分享结果
- **订阅服务**: 月度/年度会员制

## 🛠 技术栈 (Tech Stack)

- **前端**: Next.js, React, Chakra UI
- **图表**: Chart.js (饼图、雷达图)
- **计算**: Lunar-JavaScript（农历计算）
- **部署**: Vercel, Netlify
- **API**: Serverless Functions

## 📁 项目结构 (Project Structure)

## 🤖 智能五行图像识别技术 (Intelligent Wuxing Image Recognition)

### 核心技术 (Core Technology)
我们的AI图像识别系统采用多维度分析方法，不仅仅基于颜色，而是综合识别图片中的实际五行元素：

#### 1. 多维度识别算法 (Multi-dimensional Recognition)

**金元素识别 (Metal Element Recognition)**
- **颜色分析**: 识别金属色调（银色、金色、灰色）
- **形状分析**: 检测锐利边缘和几何形状
- **纹理分析**: 识别金属光泽和反射特性
- **物体识别**: 识别刀具、硬币、机械、金属制品

**木元素识别 (Wood Element Recognition)**
- **颜色分析**: 识别绿色系和棕色系
- **形状分析**: 检测有机曲线和分支结构
- **纹理分析**: 识别木质纹理和生长纹路
- **物体识别**: 识别植物、树木、木制品、花草

**水元素识别 (Water Element Recognition)**
- **颜色分析**: 识别蓝色系和透明质感
- **形状分析**: 检测流体形状和波浪纹
- **纹理分析**: 识别反射和流动特性
- **物体识别**: 识别水体、液体、冰雪、雨滴

**火元素识别 (Fire Element Recognition)**
- **颜色分析**: 识别红色、橙色、黄色暖色调
- **形状分析**: 检测动态火焰状和发散形
- **纹理分析**: 识别发光和热辐射特性
- **物体识别**: 识别火焰、光源、热源、太阳

**土元素识别 (Earth Element Recognition)**
- **颜色分析**: 识别棕色、黄褐色、灰色
- **形状分析**: 检测稳固和块状结构
- **纹理分析**: 识别粗糙和颗粒质感
- **物体识别**: 识别土壤、岩石、建筑、山川

#### 2. 智能评分系统 (Intelligent Scoring System)

```javascript
// 综合评分算法
elementScore = (
    colorAnalysis * 30% +     // 颜色权重
    shapeAnalysis * 25% +     // 形状权重
    textureAnalysis * 25% +   // 纹理权重
    objectRecognition * 20%   // 物体识别权重
) * 100
```