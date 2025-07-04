import { Lunar } from 'lunar-javascript'

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持POST请求' })
    }

    try {
        const { year, month, day, hour, noHour, gender, userName } = req.body
        
        // 验证输入数据
        if (!year || !month || !day) {
            throw new Error('日期数据不完整')
        }

        // 确保数据类型正确
        const y = parseInt(year)
        const m = parseInt(month)
        const d = parseInt(day)
        const h = hour ? parseInt(hour) : 0

        if (isNaN(y) || isNaN(m) || isNaN(d)) {
            throw new Error('日期格式不正确')
        }

        // 创建农历对象
        const lunar = Lunar.fromDate(new Date(y, m - 1, d, h))
        
        // 获取八字
        const eightChar = lunar.getEightChar()

        // 计算五行分布
        const wuxingCounts = {
            wood: 0,
            fire: 0,
            earth: 0,
            metal: 0,
            water: 0
        }

        // 简单的五行计算示例
        const elements = {
            甲: 'wood', 乙: 'wood',
            丙: 'fire', 丁: 'fire',
            戊: 'earth', 己: 'earth',
            庚: 'metal', 辛: 'metal',
            壬: 'water', 癸: 'water'
        }

        // 计算天干的五行
        const stems = [
            eightChar.getYear()[0],
            eightChar.getMonth()[0],
            eightChar.getDay()[0],
            noHour ? null : eightChar.getTime()[0]
        ].filter(Boolean)

        stems.forEach(stem => {
            const element = elements[stem]
            if (element) {
                wuxingCounts[element]++
            }
        })
        
        res.json({
            success: true,
            data: {
                eightChar: {
                    year: eightChar.getYear(),
                    month: eightChar.getMonth(),
                    day: eightChar.getDay(),
                    time: noHour ? '未知' : eightChar.getTime()
                },
                wuxingCounts,
                analysis: `五行分布：
                    木：${wuxingCounts.wood} (代表生长、向上)
                    火：${wuxingCounts.fire} (代表温暖、光明)
                    土：${wuxingCounts.earth} (代表稳重、包容)
                    金：${wuxingCounts.metal} (代表坚强、果断)
                    水：${wuxingCounts.water} (代表智慧、灵活)`
            }
        })
    } catch (error) {
        console.error('API错误：', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
} 