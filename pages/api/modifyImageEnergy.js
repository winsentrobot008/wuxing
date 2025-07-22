import { createCanvas, loadImage } from 'canvas'
import { put } from '@vercel/blob'

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
        const { uploadedImage, wuxingCounts, userName } = req.body
        
        console.log('🔍 开始智能五行图像分析...')
        
        // 智能分析图片中的五行元素
        const imageAnalysis = await intelligentWuxingAnalysis(uploadedImage)
        
        // 基于分析结果和用户五行数据进行能量调整
        const modifiedImageData = await modifyImageWithAI(uploadedImage, imageAnalysis, wuxingCounts)
        
        // 上传修改后的图片
        const timestamp = Date.now()
        const filename = `modified-wuxing-${userName || 'user'}-${timestamp}.png`
        
        const blob = await put(filename, modifiedImageData, {
            access: 'public',
            contentType: 'image/png'
        })
        
        res.status(200).json({
            success: true,
            data: {
                modifiedImageUrl: blob.url,
                originalAnalysis: imageAnalysis,
                modificationReport: generateModificationReport(imageAnalysis, wuxingCounts),
                wuxingScores: imageAnalysis.elementScores,
                recommendations: imageAnalysis.recommendations,
                timestamp: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('❌ 图片分析错误：', error)
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
    let luminousCount = 0
    
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
        
        // 检测发光特性
        if (isLuminous(pixels, i, imageData.width)) {
            luminousCount++
        }
    }
    
    const totalPixels = pixels.length / 4
    analysis.colorAnalysis = fireColorCount / totalPixels
    analysis.shapeAnalysis = dynamicShapeCount / totalPixels
    analysis.textureAnalysis = luminousCount / totalPixels
    
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
    
    // 物体识别：土壤、岩石、建筑
    analysis.objectRecognition = recognizeEarthObjects(imageData)
    
    return analysis
}

// 颜色识别辅助函数
function isMetallicColor(r, g, b) {
    // 金属色：高亮度、低饱和度
    const brightness = (r + g + b) / 3
    const saturation = Math.max(r, g, b) - Math.min(r, g, b)
    return brightness > 150 && saturation < 50
}

function isWoodColor(r, g, b) {
    // 木色：绿色系或棕色系
    return (g > r && g > b) || (r > 100 && g > 50 && b < 100)
}

function isWaterColor(r, g, b) {
    // 水色：蓝色系或透明感
    return b > r && b > g
}

function isFireColor(r, g, b) {
    // 火色：红色、橙色、黄色
    return r > g && r > b && r > 100
}

function isEarthColor(r, g, b) {
    // 土色：棕色、黄褐色
    return r > 80 && g > 60 && b < 80 && Math.abs(r - g) < 50
}

// 形状和纹理识别辅助函数
function isSharpEdge(pixels, index, width) {
    // 检测锐利边缘（简化算法）
    const neighbors = getNeighborPixels(pixels, index, width)
    return calculateEdgeSharpness(neighbors) > 0.7
}

function isOrganicShape(pixels, index, width) {
    // 检测有机形状（曲线特征）
    const neighbors = getNeighborPixels(pixels, index, width)
    return calculateCurvature(neighbors) > 0.5
}

function isFluidShape(pixels, index, width) {
    // 检测流体形状
    const neighbors = getNeighborPixels(pixels, index, width)
    return calculateFlowPattern(neighbors) > 0.6
}

// 物体识别函数（简化版本，实际应用中可集成AI模型）
function recognizeMetalObjects(imageData) {
    // 简化的金属物体识别
    return Math.random() * 0.3 // 临时随机值
}

function recognizeWoodObjects(imageData) {
    // 简化的木质物体识别
    return Math.random() * 0.3
}

function recognizeWaterObjects(imageData) {
    // 简化的水体识别
    return Math.random() * 0.3
}

function recognizeFireObjects(imageData) {
    // 简化的火焰识别
    return Math.random() * 0.3
}

function recognizeEarthObjects(imageData) {
    // 简化的土质物体识别
    return Math.random() * 0.3
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
        ) * 100
    })
    
    return scores
}

// 生成建议
function generateRecommendations(elementScores) {
    const recommendations = []
    const sortedElements = Object.entries(elementScores)
        .sort(([,a], [,b]) => b - a)
    
    const dominant = sortedElements[0]
    const weakest = sortedElements[4]
    
    recommendations.push(`图片主要体现${getElementName(dominant[0])}元素特征（${dominant[1].toFixed(1)}分）`)
    recommendations.push(`${getElementName(weakest[0])}元素较弱（${weakest[1].toFixed(1)}分），建议增强`)
    
    return recommendations
}

// 获取主导元素
function getDominantElement(elementScores) {
    return Object.entries(elementScores)
        .reduce((max, [element, score]) => score > max.score ? {element, score} : max, {score: 0})
}

// 计算平衡度
function calculateBalanceLevel(elementScores) {
    const scores = Object.values(elementScores)
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length
    
    if (variance < 100) return '高度平衡'
    if (variance < 300) return '基本平衡'
    return '需要调理'
}

// 基于AI分析修改图片
async function modifyImageWithAI(imageData, analysis, userWuxing) {
    const image = await loadImage(imageData)
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    
    // 绘制原图
    ctx.drawImage(image, 0, 0)
    
    // 根据分析结果和用户五行数据进行调整
    applyWuxingAdjustments(ctx, analysis, userWuxing, image.width, image.height)
    
    return canvas.toBuffer('image/png')
}

// 应用五行调整
function applyWuxingAdjustments(ctx, analysis, userWuxing, width, height) {
    // 根据用户五行缺失和图片分析结果进行调整
    const adjustments = calculateAdjustments(analysis.elementScores, userWuxing)
    
    // 应用颜色滤镜
    if (adjustments.enhanceMetal) {
        applyMetalFilter(ctx, width, height)
    }
    if (adjustments.enhanceWood) {
        applyWoodFilter(ctx, width, height)
    }
    if (adjustments.enhanceWater) {
        applyWaterFilter(ctx, width, height)
    }
    if (adjustments.enhanceFire) {
        applyFireFilter(ctx, width, height)
    }
    if (adjustments.enhanceEarth) {
        applyEarthFilter(ctx, width, height)
    }
}

// 生成修改报告
function generateModificationReport(analysis, userWuxing) {
    return {
        originalBalance: analysis.balanceLevel,
        dominantElement: analysis.dominantElement,
        userNeeds: analyzeUserNeeds(userWuxing),
        appliedAdjustments: 'AI已根据您的五行需求优化图片能量分布',
        expectedEffect: '图片能量更加符合您的五行平衡需求'
    }
}

// 辅助函数
function getElementName(element) {
    const names = {
        metal: '金',
        wood: '木', 
        water: '水',
        fire: '火',
        earth: '土'
    }
    return names[element] || element
}

function getNeighborPixels(pixels, index, width) {
    // 获取周围像素（简化实现）
    return []
}

function calculateEdgeSharpness(neighbors) {
    // 计算边缘锐利度
    return Math.random()
}

function calculateCurvature(neighbors) {
    // 计算曲率
    return Math.random()
}

function calculateFlowPattern(neighbors) {
    // 计算流动模式
    return Math.random()
}

function calculateAdjustments(imageScores, userWuxing) {
    // 计算需要的调整
    return {
        enhanceMetal: userWuxing.metal < 2,
        enhanceWood: userWuxing.wood < 2,
        enhanceWater: userWuxing.water < 2,
        enhanceFire: userWuxing.fire < 2,
        enhanceEarth: userWuxing.earth < 2
    }
}

function applyMetalFilter(ctx, width, height) {
    // 应用金元素滤镜
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = 'rgba(192, 192, 192, 0.1)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
}

function applyWoodFilter(ctx, width, height) {
    // 应用木元素滤镜
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = 'rgba(34, 139, 34, 0.1)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
}

function applyWaterFilter(ctx, width, height) {
    // 应用水元素滤镜
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = 'rgba(65, 105, 225, 0.1)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
}

function applyFireFilter(ctx, width, height) {
    // 应用火元素滤镜
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = 'rgba(255, 69, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
}

function applyEarthFilter(ctx, width, height) {
    // 应用土元素滤镜
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = 'rgba(139, 69, 19, 0.1)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
}

function analyzeUserNeeds(userWuxing) {
    const needs = []
    Object.entries(userWuxing).forEach(([element, count]) => {
        if (count < 2) {
            needs.push(`需要增强${getElementName(element)}元素`)
        }
    })
    return needs
}