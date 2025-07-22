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
        
        // 🔍 调试信息：检查接收到的性别参数
        console.log('🔍 API调试 - 接收到的数据：', { year, month, day, hour, noHour, gender, userName, calendar })
        console.log('🔍 API调试 - 性别参数类型：', typeof gender, '值：', gender)
        
        // 使用LUNAR库进行农历转换
        let lunar;
        if (calendar === 'lunar') {
            lunar = Lunar.fromYmdHms(year, month, day, hour || 0, 0, 0)
        } else {
            lunar = Lunar.fromDate(new Date(year, month - 1, day, hour || 0))
        }
        
        // 获取八字
        const eightChar = lunar.getEightChar()
        
        console.log('🔍 API调试 - 八字信息：', {
            year: eightChar.getYear(),
            month: eightChar.getMonth(),
            day: eightChar.getDay(),
            time: noHour ? '未知' : eightChar.getTime()
        })
        
        // 🔍 调试信息：调用计算函数前
        console.log('🔍 API调试 - 调用calculateBazi前，性别参数：', gender)
        
        // 调用统一私有库
        const result = calculateBazi(eightChar, noHour, gender, lunar, userName)
        
        // 🔍 调试信息：检查返回结果
        console.log('🔍 API调试 - calculateBazi返回结果包含的键：', Object.keys(result))
        console.log('🔍 API调试 - 分析内容预览：', result.analysis?.substring(0, 200))
        
        const responseData = {
            eightChar: {
                year: eightChar.getYear(),
                month: eightChar.getMonth(), 
                day: eightChar.getDay(),
                time: noHour ? '未知' : eightChar.getTime()
            },
            gender: gender, // 添加这一行
            genderDebug: `🔍 性别调试标记: ${gender}`, // 🔍 添加调试标记
            ...result
        }
        
        // 🔍 调试信息：检查最终响应数据
        console.log('🔍 API调试 - 最终响应数据包含gender：', 'gender' in responseData)
        console.log('🔍 API调试 - 响应数据的gender值：', responseData.gender)
        
        res.status(200).json({
            success: true,
            data: responseData
        })
    } catch (error) {
        console.error('❌ API错误详情：', error)
        res.status(500).json({ 
            success: false, 
            error: `计算失败：${error.message}`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}