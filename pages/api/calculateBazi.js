import { Lunar } from 'lunar-javascript'
import { calculateBazi } from '../../my-library/unifiedBaziLibrary.js'

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
        return res.status(405).json({ 
            success: false,
            error: '只支持POST请求' 
        })
    }

    try {
        const { year, month, day, hour, noHour, gender, userName, calendar } = req.body
        
        // 使用LUNAR库进行真正的农历转换
        let lunar;
        if (calendar === 'lunar') {
            // 农历转公历
            lunar = Lunar.fromYmdHms(year, month, day, hour || 0, 0, 0)
        } else {
            // 公历转农历
            lunar = Lunar.fromDate(new Date(year, month - 1, day, hour || 0))
        }
        
        // 获取八字
        const eightChar = lunar.getEightChar()
        
        // 使用统一私有库进行真正的八字计算
        const result = calculateBazi(eightChar, noHour, gender, lunar, userName)
        
        res.status(200).json({
            success: true,
            data: {
                eightChar: {
                    year: eightChar.getYear(),
                    month: eightChar.getMonth(), 
                    day: eightChar.getDay(),
                    time: noHour ? '未知' : eightChar.getTime()
                },
                ...result
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}