import { put } from '@vercel/blob'
import { createCanvas, loadImage } from 'canvas'
import path from 'path'

export default async function handler(req, res) {
    // 设置CORS头
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
        return res.status(405).json({ 
            success: false,
            error: '只支持POST请求' 
        })
    }

    try {
        const { wuxingCounts, userName, gender, eightChar } = req.body
        
        console.log('🎨 生成五行能量图 - 输入数据：', { wuxingCounts, userName, gender })
        
        // 生成个性化能量图
        const imageBuffer = await generateWuxingEnergyImage({
            wuxingCounts,
            userName,
            gender,
            eightChar
        })
        
        // 生成唯一文件名
        const timestamp = Date.now()
        const filename = `wuxing-energy-${userName || 'user'}-${timestamp}.png`
        
        // 上传到 Vercel Blob
        const blob = await put(filename, imageBuffer, {
            access: 'public',
            contentType: 'image/png'
        })
        
        console.log('✅ 图片上传成功：', blob.url)
        
        // 返回图片URL和相关信息
        res.status(200).json({
            success: true,
            data: {
                imageUrl: blob.url,
                filename: filename,
                uploadedAt: new Date().toISOString(),
                userInfo: {
                    name: userName,
                    gender: gender
                },
                wuxingData: wuxingCounts
            }
        })
        
    } catch (error) {
        console.error('❌ 图片生成或上传错误：', error)
        res.status(500).json({ 
            success: false, 
            error: `图片生成失败：${error.message}`
        })
    }
}

// 五行平衡图片生成函数
async function generateWuxingEnergyImage({ wuxingCounts, userName, gender, eightChar }) {
    const canvas = createCanvas(800, 600)
    const ctx = canvas.getContext('2d')
    
    // 计算五行平衡值（反向平衡原则）
    const balancedElements = calculateBalancedElements(wuxingCounts)
    
    // 加载背景图片
    const backgroundPath = path.join(process.cwd(), 'images', 'bagua-static.png')
    const backgroundImage = await loadImage(backgroundPath)
    
    // 绘制背景
    ctx.drawImage(backgroundImage, 0, 0, 800, 600)
    
    // 添加半透明遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(0, 0, 800, 600)
    
    // 五行颜色和符号映射
    const elementConfig = {
        metal: { color: '#C0C0C0', symbol: '⚔️', name: '金' },
        wood: { color: '#228B22', symbol: '🌳', name: '木' },
        water: { color: '#4169E1', symbol: '💧', name: '水' },
        fire: { color: '#FF4500', symbol: '🔥', name: '火' },
        earth: { color: '#8B4513', symbol: '🏔️', name: '土' }
    }
    
    // 绘制五行能量环（基于平衡后的数值）
    const centerX = 400
    const centerY = 300
    const baseRadius = 60
    
    Object.entries(balancedElements).forEach(([element, balanceValue], index) => {
        const angle = (index * 72) * Math.PI / 180 // 五行均匀分布
        const config = elementConfig[element]
        
        // 计算位置和大小
        const distance = 100 + (balanceValue * 20) // 根据平衡值调整距离
        const radius = baseRadius + (balanceValue * 30) // 根据平衡值调整大小
        
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        
        // 绘制能量球（渐变效果）
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, config.color + 'DD')
        gradient.addColorStop(0.7, config.color + '88')
        gradient.addColorStop(1, config.color + '22')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fill()
        
        // 绘制元素符号
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 28px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(config.symbol, x, y + 10)
        
        // 绘制元素名称
        ctx.font = 'bold 20px Arial'
        ctx.fillText(config.name, x, y + 40)
        
        // 绘制平衡指数
        ctx.font = '16px Arial'
        ctx.fillStyle = '#FFFF00'
        ctx.fillText(`${(balanceValue * 100).toFixed(0)}%`, x, y - 35)
    })
    
    // 绘制标题
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${userName || '用户'} 的五行平衡能量图`, 400, 60)
    
    // 绘制副标题
    ctx.font = '18px Arial'
    ctx.fillStyle = '#CCCCCC'
    ctx.fillText('Five Elements Balance Energy Chart', 400, 90)
    
    // 绘制八字信息
    if (eightChar) {
        ctx.font = '20px Arial'
        ctx.fillText(`八字：${eightChar.year} ${eightChar.month} ${eightChar.day} ${eightChar.time}`, 400, 120)
    }
    
    // 绘制性别标识
    const genderSymbol = gender === 'male' ? '♂' : '♀'
    const genderColor = gender === 'male' ? '#4169E1' : '#E91E63'
    ctx.fillStyle = genderColor
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(genderSymbol, 750, 60)
    
    // 绘制平衡说明
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('※ 图中元素大小反映您需要加强的五行能量', 400, 520)
    ctx.fillText('※ 较大的元素表示需要重点关注和调理', 400, 545)
    
    // 绘制生成时间戳
    ctx.fillStyle = '#AAAAAA'
    ctx.font = '14px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(`生成时间：${new Date().toLocaleString('zh-CN')}`, 780, 580)
    
    return canvas.toBuffer('image/png')
}

// 五行平衡计算函数（反向平衡原则）
function calculateBalancedElements(wuxingCounts) {
    const total = Object.values(wuxingCounts).reduce((sum, val) => sum + val, 0)
    const idealRatio = 0.2 // 理想情况下每个元素占20%
    const adjustmentFactor = 0.6 // 调节系数
    
    const balanced = {}
    
    Object.entries(wuxingCounts).forEach(([element, count]) => {
        const currentRatio = total > 0 ? count / total : 0
        const deviation = idealRatio - currentRatio
        
        // 反向平衡：缺少的元素在图片中增强，过多的元素减弱
        balanced[element] = Math.max(0.1, Math.min(1.0, 
            idealRatio + (deviation * adjustmentFactor)
        ))
    })
    
    return balanced
}