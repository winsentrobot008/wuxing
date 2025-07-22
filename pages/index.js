import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Script from 'next/script'

function WuxingPieChart({ data }) {
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
            '#FF5722', // 火
            '#795548', // 土
            '#9E9E9E', // 金
            '#2196F3'  // 水
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: '五行分布',
            font: {
              size: 14
            }
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

  return <canvas ref={chartRef} style={{ maxHeight: '200px' }} />
}

function WuxingRadarChart({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!data || !window.Chart) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    chartInstance.current = new window.Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['木', '火', '土', '金', '水'],
        datasets: [{
          label: '五行强度',
          data: [
            data.wood,
            data.fire,
            data.earth,
            data.metal,
            data.water
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: Math.max(...Object.values(data)) + 1,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '五行强度分布',
            font: {
              size: 14
            }
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

  return <canvas ref={chartRef} style={{ maxHeight: '200px' }} />
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [unknownTime, setUnknownTime] = useState(false)
  const [calendar, setCalendar] = useState('solar')

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
      userName: formData.get('userName'),
      calendar: formData.get('calendar')
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
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>八字五行分析系统</title>
        <meta name="description" content="基于八字理论的五行分析系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/images/icon-192x192.png" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">八字五行分析系统</h1>
          <p className="text-gray-600">探索你的命理五行，找寻人生方向</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleCalculate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input
                    type="text"
                    name="userName"
                    placeholder="请输入姓名（选填）"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出生日期</label>
                  <input
                    type="date"
                    name="birthday"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">出生时间</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="unknownTime"
                        checked={unknownTime}
                        onChange={(e) => setUnknownTime(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <label htmlFor="unknownTime" className="ml-2 text-sm text-gray-600">不清楚出生时间</label>
                    </div>
                  </div>
                  <input
                    type="time"
                    name="birthtime"
                    disabled={unknownTime}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                  <select 
                    name="gender" 
                    required 
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">历法选择</label>
                  <select 
                    name="calendar" 
                    value={calendar}
                    onChange={(e) => setCalendar(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="solar">阳历（公历）</option>
                    <option value="lunar">阴历（农历）</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">五行基础知识</h3>
                <div className="space-y-2 text-sm">
                  <p>🌳 <span className="font-medium">木</span>：代表生长、向上</p>
                  <p>🔥 <span className="font-medium">火</span>：代表温暖、光明</p>
                  <p>🗺️ <span className="font-medium">土</span>：代表稳重、包容</p>
                  <p>⚔️ <span className="font-medium">金</span>：代表坚强、果断</p>
                  <p>💧 <span className="font-medium">水</span>：代表智慧、灵活</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                {loading ? '分析中...' : '开始分析'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center">
            <div className="loading"></div>
            <p className="text-center mt-4 text-gray-600">正在进行命理分析...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">八字</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-gray-600">年柱</div>
                  <div className="text-2xl font-bold">{result.eightChar?.year}</div>
                </div>
                <div>
                  <div className="text-gray-600">月柱</div>
                  <div className="text-2xl font-bold">{result.eightChar?.month}</div>
                </div>
                <div>
                  <div className="text-gray-600">日柱</div>
                  <div className="text-2xl font-bold">{result.eightChar?.day}</div>
                </div>
                <div>
                  <div className="text-gray-600">时柱</div>
                  <div className="text-2xl font-bold">{result.eightChar?.time}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
      
      <footer className="text-center text-gray-400 text-sm py-4">
        版本号：1.0.0 &nbsp;|&nbsp; 日期：2024-06-09
      </footer>
    </div>
  )
}