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

    try {
        const { wuxingCounts, userName } = req.body
        
        // 模拟动图生成
        const animationUrl = await generateWuxingAnimation(wuxingCounts)
        
        res.status(200).json({
            success: true,
            data: {
                animationUrl,
                duration: '3秒循环',
                format: 'GIF',
                size: '800x600',
                timestamp: new Date().toISOString()
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

async function generateWuxingAnimation(wuxingCounts) {
    // 免费版本返回预设动图
    return '/images/wuxing-animation-sample.gif'
}