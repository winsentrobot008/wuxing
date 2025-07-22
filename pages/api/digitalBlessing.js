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
        
        // 生成开光信息
        const blessingData = await performDigitalBlessing(wuxingCounts, userName)
        
        res.status(200).json({
            success: true,
            data: blessingData
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

async function performDigitalBlessing(wuxingCounts, userName) {
    const blessingId = 'BL' + Date.now().toString(36).toUpperCase()
    const energyLevel = calculateEnergyLevel(wuxingCounts)
    
    return {
        blessedImageUrl: '/images/blessed-sample.png', // 预设开光图片
        blessingTime: new Date().toLocaleString('zh-CN'),
        blessingId,
        energyLevel,
        blessingText: `${userName}的五行能量图已完成数字开光仪式，愿五行调和，能量平衡。`,
        certificate: `开光证书编号：${blessingId}`
    }
}

function calculateEnergyLevel(wuxingCounts) {
    const total = Object.values(wuxingCounts).reduce((sum, val) => sum + val, 0)
    if (total >= 7) return '高能级'
    if (total >= 5) return '中能级'
    return '初能级'
}