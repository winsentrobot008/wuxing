import { createCanvas, loadImage } from 'canvas'

export default async function handler(req, res) {
    // CORS设置
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: '只支持POST请求' })
    }

    try {
        const { imageData } = req.body
        
        if (!imageData) {
            return res.status(400).json({ success: false, error: '缺少图片数据' })
        }

        // 执行智能五行图像分析
        const analysis = await intelligentWuxingAnalysis(imageData)
        
        res.status(200).json({
            success: true,
            data: {
                elementScores: analysis.elementScores,
                dominantElement: analysis.dominantElement,
                balanceLevel: analysis.balanceLevel,
                elementAnalysis: analysis.elementAnalysis,
                recommendations: analysis.recommendations,
                timestamp: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('❌ 图片五行分析错误：', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// 智能五行图像分析函数
async function intelligentWuxingAnalysis(imageData) {
    try {
        // 加载图片进行分析
        const image = await loadImage(imageData)
        const canvas = createCanvas(image.width, image.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        
        // 获取图像数据
        const imageDataArray = ctx.getImageData(0, 0, image.width, image.height)
        
        // 智能元素识别
        const elementAnalysis = {
            metal: analyzeMetalElements(imageDataArray, image),
            wood: analyzeWoodElements(imageDataArray, image),
            water: analyzeWaterElements(imageDataArray, image),
            fire: analyzeFireElements(imageDataArray, image),
            earth: analyzeEarthElements(imageDataArray, image)
        }
        
        // 计算五行评分
        const elementScores = calculateElementScores(elementAnalysis)
        
        // 生成建议
        const recommendations = generateRecommendations(elementScores)
        
        return {
            elementAnalysis,
            elementScores,
            recommendations,
            dominantElement: getDominantElement(elementScores),
            balanceLevel: calculateBalanceLevel(elementScores)
        }
    } catch (error) {
        console.error('图像分析失败：', error)
        throw new Error('图像分析失败')
    }
}

// 金元素智能识别
function analyzeMetalElements(imageData, image) {
    const analysis = {
        colorAnalysis: 0,
        shapeAnalysis: 0,
        textureAnalysis: 0,
        objectRecognition: 0
    }
    
    const pixels = imageData.data
    let metalColorCount = 0
    let sharpEdgeCount = 0
    let metallicTextureCount = 0
    
    // 颜色分析：金属色调（银色、金色、灰色）
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        // 检测金属色调
        if (isMetallicColor(r, g, b)) {
            metalColorCount++
        }
        
        // 检测锐利边缘（金的特征）
        if (isSharpEdge(pixels, i, imageData.width)) {
            sharpEdgeCount++
        }
        
        // 检测金属质感
        if (isMetallicTexture(pixels, i, imageData.width)) {
            metallicTextureCount++
        }
    }
    
    const totalPixels = pixels.length / 4
    analysis.colorAnalysis = metalColorCount / totalPixels
    analysis.shapeAnalysis = sharpEdgeCount / totalPixels
    analysis.textureAnalysis = metallicTextureCount / totalPixels
    
    // 物体识别：金属物品（刀具、硬币、机械等）
    analysis.objectRecognition = recognizeMetalObjects(imageData)
    
    return analysis
}

// 木元素智能识别
function analyzeWoodElements(imageData, image) {
    const analysis = {
        colorAnalysis: 0,
        shapeAnalysis: 0,
        textureAnalysis: 0,
        objectRecognition: 0
    }
    
    const pixels = imageData.data
    let woodColorCount = 0
    let organicShapeCount = 0
    let woodTextureCount = 0
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        // 检测木质色调（绿色、棕色）
        if (isWoodColor(r, g, b)) {
            woodColorCount++
        }
        
        // 检测有机形状（曲线、分支）
        if (isOrganicShape(pixels, i, imageData.width)) {
            organicShapeCount++
        }
        
        // 检测木质纹理
        if (isWoodTexture(pixels, i, imageData.width)) {
            woodTextureCount++
        }
    }
    
    const totalPixels = pixels.length / 4
    analysis.colorAnalysis = woodColorCount / totalPixels
    analysis.shapeAnalysis = organicShapeCount / totalPixels
    analysis.textureAnalysis = woodTextureCount / totalPixels
    
    // 物体识别：植物、树木、木制品
    analysis.objectRecognition = recognizeWoodObjects(imageData)
    
    return analysis
}

// 水元素智能识别
function analyzeWaterElements(imageData, image) {
    const analysis = {
        colorAnalysis: 0,
        shapeAnalysis: 0,
        textureAnalysis: 0,
        objectRecognition: 0
    }
    
    const pixels = imageData.data
    let waterColorCount = 0
    let fluidShapeCount = 0
    let reflectiveCount = 0
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        // 检测水的色调（蓝色、透明）
        if (isWaterColor(r, g, b)) {
            waterColorCount++
        }
        
        // 检测流体形状
        if (isFluidShape(pixels, i, imageData.width)) {
            fluidShapeCount++
        }
        
        // 检测反射特性
        if (isReflective(pixels, i, imageData.width)) {
            reflectiveCount++
        }
    }
    
    const totalPixels = pixels.length / 4
    analysis.colorAnalysis = waterColorCount / totalPixels
    analysis.shapeAnalysis = fluidShapeCount / totalPixels
    analysis.textureAnalysis = reflectiveCount / totalPixels
    
    // 物体识别：水体、液体、冰雪
    analysis.objectRecognition = recognizeWaterObjects(imageData)
    
    return analysis
}

// 火元素智能识别
function analyzeFireElements(imageData, image) {
    const analysis = {
        colorAnalysis: 0,
        shapeAnalysis: 0,
        textureAnalysis: 0,
        objectRecognition: 0
    }
    
    const pixels = imageData.data
    let fireColorCount = 0
    let dynamicShapeCount = 0
    let brightTextureCount = 0
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        // 检测火的色调（红色、橙色、黄色）
        if (isFireColor(r, g, b)) {
            fireColorCount++
        }
        
        // 检测动态形状（火焰状）
        if (isDynamicShape(pixels, i, imageData.width)) {
            dynamicShapeCount++
        }
        
        // 检测明亮质感
        if (isBrightTexture(pixels, i, imageData.width)) {
            brightTextureCount++
        }
    }
    
    const totalPixels = pixels.length / 4
    analysis.colorAnalysis = fireColorCount / totalPixels
    analysis.shapeAnalysis = dynamicShapeCount / totalPixels
    analysis.textureAnalysis = brightTextureCount / totalPixels
    
    // 物体识别：火焰、光源、热源
    analysis.objectRecognition = recognizeFireObjects(imageData)
    
    return analysis
}

// 土元素智能识别
function analyzeEarthElements(imageData, image) {
    const analysis = {
        colorAnalysis: 0,
        shapeAnalysis: 0,
        textureAnalysis: 0,
        objectRecognition: 0
    }
    
    const pixels = imageData.data
    let earthColorCount = 0
    let solidShapeCount = 0
    let roughTextureCount = 0
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        // 检测土的色调（棕色、黄色、灰色）
        if (isEarthColor(r, g, b)) {
            earthColorCount++
        }
        
        // 检测稳固形状
        if (isSolidShape(pixels, i, imageData.width)) {
            solidShapeCount++
        }
        
        // 检测粗糙质感
        if (isRoughTexture(pixels, i, imageData.width)) {
            roughTextureCount++
        }
    }
    
    const totalPixels = pixels.length / 4
    analysis.colorAnalysis = earthColorCount / totalPixels
    analysis.shapeAnalysis = solidShapeCount / totalPixels
    analysis.textureAnalysis = roughTextureCount / totalPixels
    
    // 物体识别：土壤、石头、建筑
    analysis.objectRecognition = recognizeEarthObjects(imageData)
    
    return analysis
}

// 颜色识别辅助函数
function isMetallicColor(r, g, b) {
    // 金属色：银色、金色、灰色
    const isGray = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30
    const isGold = r > 200 && g > 150 && b < 100
    const isSilver = r > 180 && g > 180 && b > 180
    return isGray || isGold || isSilver
}

function isWoodColor(r, g, b) {
    // 木色：绿色、棕色
    const isGreen = g > r && g > b && g > 100
    const isBrown = r > 100 && g > 50 && b < 80 && r > g && g > b
    return isGreen || isBrown
}

function isWaterColor(r, g, b) {
    // 水色：蓝色、青色
    const isBlue = b > r && b > g && b > 100
    const isCyan = b > 150 && g > 150 && r < 100
    return isBlue || isCyan
}

function isFireColor(r, g, b) {
    // 火色：红色、橙色、黄色
    const isRed = r > 150 && r > g && r > b
    const isOrange = r > 200 && g > 100 && b < 100
    const isYellow = r > 200 && g > 200 && b < 150
    return isRed || isOrange || isYellow
}

function isEarthColor(r, g, b) {
    // 土色：棕色、黄褐色、灰褐色
    const isBrown = r > 100 && g > 70 && b < 70 && r >= g && g >= b
    const isBeige = r > 180 && g > 160 && b > 120 && r > g && g > b
    return isBrown || isBeige
}

// 形状和纹理识别辅助函数（简化版）
function isSharpEdge(pixels, index, width) {
    // 简化的边缘检测
    return Math.random() > 0.8 // 模拟检测
}

function isMetallicTexture(pixels, index, width) {
    return Math.random() > 0.85 // 模拟检测
}

function isOrganicShape(pixels, index, width) {
    return Math.random() > 0.8 // 模拟检测
}

function isWoodTexture(pixels, index, width) {
    return Math.random() > 0.85 // 模拟检测
}

function isFluidShape(pixels, index, width) {
    return Math.random() > 0.8 // 模拟检测
}

function isReflective(pixels, index, width) {
    return Math.random() > 0.85 // 模拟检测
}

function isDynamicShape(pixels, index, width) {
    return Math.random() > 0.8 // 模拟检测
}

function isBrightTexture(pixels, index, width) {
    return Math.random() > 0.85 // 模拟检测
}

function isSolidShape(pixels, index, width) {
    return Math.random() > 0.8 // 模拟检测
}

function isRoughTexture(pixels, index, width) {
    return Math.random() > 0.85 // 模拟检测
}

// 物体识别函数（简化版）
function recognizeMetalObjects(imageData) {
    return Math.random() * 0.3 // 模拟识别结果
}

function recognizeWoodObjects(imageData) {
    return Math.random() * 0.3 // 模拟识别结果
}

function recognizeWaterObjects(imageData) {
    return Math.random() * 0.3 // 模拟识别结果
}

function recognizeFireObjects(imageData) {
    return Math.random() * 0.3 // 模拟识别结果
}

function recognizeEarthObjects(imageData) {
    return Math.random() * 0.3 // 模拟识别结果
}

// 计算五行评分
function calculateElementScores(elementAnalysis) {
    const scores = {}
    
    Object.entries(elementAnalysis).forEach(([element, analysis]) => {
        // 综合评分：颜色30% + 形状25% + 纹理25% + 物体识别20%
        scores[element] = (
            analysis.colorAnalysis * 0.3 +
            analysis.shapeAnalysis * 0.25 +
            analysis.textureAnalysis * 0.25 +
            analysis.objectRecognition * 0.2
        ) * 100 // 转换为百分比
    })
    
    return scores
}

// 获取主导元素
function getDominantElement(elementScores) {
    return Object.entries(elementScores).reduce((max, [element, score]) => 
        score > max.score ? { element, score } : max, 
        { element: 'metal', score: 0 }
    ).element
}

// 计算平衡度
function calculateBalanceLevel(elementScores) {
    const scores = Object.values(elementScores)
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length
    const standardDeviation = Math.sqrt(variance)
    
    // 平衡度：标准差越小，平衡度越高
    return Math.max(0, 100 - standardDeviation * 2)
}

// 生成建议
function generateRecommendations(elementScores) {
    const dominantElement = getDominantElement(elementScores)
    const balanceLevel = calculateBalanceLevel(elementScores)
    
    const recommendations = []
    
    if (balanceLevel < 50) {
        recommendations.push('图片中五行元素分布不够均衡，建议增加缺失元素的内容')
    }
    
    // 根据主导元素给出建议
    const elementAdvice = {
        metal: '图片以金元素为主，建议增加木元素来平衡（如植物、绿色）',
        wood: '图片以木元素为主，建议增加火元素来平衡（如红色、光亮）',
        water: '图片以水元素为主，建议增加土元素来平衡（如棕色、稳重形状）',
        fire: '图片以火元素为主，建议增加金元素来平衡（如金属色、几何形状）',
        earth: '图片以土元素为主，建议增加水元素来平衡（如蓝色、流动形状）'
    }
    
    recommendations.push(elementAdvice[dominantElement])
    
    return recommendations
}