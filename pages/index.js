import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Script from 'next/script'

function WuxingChart({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!data || !window.Chart) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    chartInstance.current = new window.Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['木', '火', '土', '金', '水'],
        datasets: [{
          data: [
            data.wood,
            data.fire,
            data.earth,
            data.metal,
            data.water
          ],
          backgroundColor: [
            '#4CAF50', // 木
            '#F44336', // 火
            '#795548', // 土
            '#9E9E9E', // 金
            '#2196F3'  // 水
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: '五行分布'
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [unknownTime, setUnknownTime] = useState(false)

  async function handleCalculate(event) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    const birthday = formData.get('birthday')
    const [year, month, day] = birthday.split('-').map(Number)
    let hour = null
    
    if (!unknownTime) {
      const birthtime = formData.get('birthtime')
      if (birthtime) {
        const [h] = birthtime.split(':').map(Number)
        hour = h
      }
    }

    const data = {
      year,
      month,
      day,
      hour,
      noHour: unknownTime,
      gender: formData.get('gender'),
      userName: formData.get('userName')
    }

    try {
      const res = await fetch('/api/calculateBazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const responseData = await res.json()
      if (!responseData.success) {
        throw new Error(responseData.error || '计算失败')
      }

      setResult(responseData.data)
    } catch (error) {
      console.error('计算失败：', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>八字五行分析系统</title>
        <meta name="description" content="基于八字理论的五行分析系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">八字五行分析系统</h1>

        <form onSubmit={handleCalculate} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-2">姓名</label>
            <input
              type="text"
              name="userName"
              className="w-full p-2 border rounded"
              placeholder="请输入姓名（选填）"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">出生日期</label>
            <input
              type="date"
              name="birthday"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">出生时间</label>
            <input
              type="time"
              name="birthtime"
              className="w-full p-2 border rounded"
              disabled={unknownTime}
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="mr-2"
                />
                <span>不知道出生时间</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">性别</label>
            <select name="gender" required className="w-full p-2 border rounded">
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '计算中...' : '开始分析'}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">分析结果</h2>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">八字</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-gray-600">年柱</div>
                  <div className="text-2xl font-bold">{result.eightChar.year}</div>
                </div>
                <div>
                  <div className="text-gray-600">月柱</div>
                  <div className="text-2xl font-bold">{result.eightChar.month}</div>
                </div>
                <div>
                  <div className="text-gray-600">日柱</div>
                  <div className="text-2xl font-bold">{result.eightChar.day}</div>
                </div>
                <div>
                  <div className="text-gray-600">时柱</div>
                  <div className="text-2xl font-bold">{result.eightChar.time}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">五行分布</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square">
                  <WuxingChart data={result.wuxingCounts} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#4CAF50] mr-2"></div>
                    <div>木：{result.wuxingCounts.wood} (代表生长、向上)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#F44336] mr-2"></div>
                    <div>火：{result.wuxingCounts.fire} (代表温暖、光明)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#795548] mr-2"></div>
                    <div>土：{result.wuxingCounts.earth} (代表稳重、包容)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#9E9E9E] mr-2"></div>
                    <div>金：{result.wuxingCounts.metal} (代表坚强、果断)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#2196F3] mr-2"></div>
                    <div>水：{result.wuxingCounts.water} (代表智慧、灵活)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">五行分析</h3>
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <h4 className="text-lg font-medium mb-2">五行特征</h4>
                  <p className="whitespace-pre-line">{result.analysis}</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">五行关系</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <h5 className="font-medium mb-2">生克关系</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>木生火：生长之气助长温暖光明</li>
                        <li>火生土：温暖之气促进包容稳重</li>
                        <li>土生金：包容之气增强坚毅果断</li>
                        <li>金生水：果断之气化为智慧灵动</li>
                        <li>水生木：智慧之气助益生长向上</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <h5 className="font-medium mb-2">五行平衡建议</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {result.wuxingCounts.wood > 0 && (
                          <li>木：宜亲近植物，多去户外活动</li>
                        )}
                        {result.wuxingCounts.fire > 0 && (
                          <li>火：宜保持乐观，培养创造力</li>
                        )}
                        {result.wuxingCounts.earth > 0 && (
                          <li>土：宜稳重踏实，注重责任心</li>
                        )}
                        {result.wuxingCounts.metal > 0 && (
                          <li>金：宜坚持原则，提升执行力</li>
                        )}
                        {result.wuxingCounts.water > 0 && (
                          <li>水：宜灵活变通，增进智慧学习</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
    </div>
  )
} 