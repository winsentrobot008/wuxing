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
        <title>BaZi Five Elements Analysis System</title>
        <meta name="description" content="A Five Elements analysis system based on BaZi theory" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/images/icon-192x192.png" />
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">BaZi Five Elements Analysis</h1>
          <p className="text-gray-600">Explore your destiny through the Five Elements</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleCalculate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" name="userName" placeholder="Enter your name (optional)" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input type="date" name="birthday" required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Time of Birth</label>
                    <div className="flex items-center">
                      <input type="checkbox" id="unknownTime" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                      <label htmlFor="unknownTime" className="ml-2 text-sm text-gray-600">Unknown</label>
                    </div>
                  </div>
                  <input type="time" name="birthtime" disabled={unknownTime} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select name="gender" required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Five Elements Basics</h3>
                <div className="space-y-2 text-sm">
                  <p>🌳 <span className="font-medium">Wood</span>: Growth, upward</p>
                  <p>🔥 <span className="font-medium">Fire</span>: Warmth, brightness</p>
                  <p>🗺️ <span className="font-medium">Earth</span>: Stability, inclusiveness</p>
                  <p>⚔️ <span className="font-medium">Metal</span>: Strength, decisiveness</p>
                  <p>💧 <span className="font-medium">Water</span>: Wisdom, flexibility</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
                {loading ? 'Analyzing...' : 'Start Analysis'}
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

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">五行分布</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[200px] flex items-center justify-center">
                  <WuxingPieChart data={result.wuxingCounts} />
                </div>
                <div className="h-[200px] flex items-center justify-center">
                  <WuxingRadarChart data={result.wuxingCounts} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#4CAF50] mx-auto mb-1"></div>
                  <div>木: {result.wuxingCounts.wood}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#FF5722] mx-auto mb-1"></div>
                  <div>火: {result.wuxingCounts.fire}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#795548] mx-auto mb-1"></div>
                  <div>土: {result.wuxingCounts.earth}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#9E9E9E] mx-auto mb-1"></div>
                  <div>金: {result.wuxingCounts.metal}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#2196F3] mx-auto mb-1"></div>
                  <div>水: {result.wuxingCounts.water}</div>
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
                      <p className="whitespace-pre-line">{result.wuxingAdvice}</p>
                      {result.detailedAdvice && (
                        <p className="mt-2 text-sm text-gray-600">{result.detailedAdvice}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {result.fortunePrediction && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium mb-2">运势预测</h4>
                    <p className="bg-gray-50 p-4 rounded">{result.fortunePrediction}</p>
                  </div>
                )}
                
                {result.nameAnalysis && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium mb-2">姓名五行分析</h4>
                    <div className="bg-gray-50 p-4 rounded">
                      <p>姓名五行：{result.nameAnalysis.wuxing.map(w => `${w.char}(${w.element})`).join(' ')}</p>
                      <p className="mt-2">{result.nameAnalysis.compatibility?.summary}</p>
                    </div>
                  </div>
                )}
                
                {result.nayinTable && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium mb-2">纳音五行</h4>
                    <p className="whitespace-pre-line bg-gray-50 p-4 rounded">{result.nayinTable}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {result && (
          <div className="mt-8 flex flex-col items-center">
            <div className="bg-white rounded-lg shadow p-4 w-full max-w-xl text-sm">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><span className="font-medium">公历：</span>{result.solarDate}</div>
                <div><span className="font-medium">农历：</span>{result.lunarDate}</div>
                <div><span className="font-medium">生肖：</span>{result.zodiac}</div>
                <div><span className="font-medium">节气：</span>{result.solarTerm}</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div><span className="font-medium">年柱：</span>{result.eightChar?.year}</div>
                <div><span className="font-medium">月柱：</span>{result.eightChar?.month}</div>
                <div><span className="font-medium">日柱：</span>{result.eightChar?.day}</div>
                <div><span className="font-medium">时柱：</span>{result.eightChar?.time || '未知'}</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div><span className="font-medium">年纳音：</span>{result.nayin?.year}</div>
                <div><span className="font-medium">月纳音：</span>{result.nayin?.month}</div>
                <div><span className="font-medium">日纳音：</span>{result.nayin?.day}</div>
                <div><span className="font-medium">时纳音：</span>{result.nayin?.time || '未知'}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div><span className="font-medium">年干：</span>{result.tenGods?.year}</div>
                <div><span className="font-medium">月干：</span>{result.tenGods?.month}</div>
                <div><span className="font-medium">日干：</span>{result.tenGods?.day}</div>
                <div><span className="font-medium">时干：</span>{result.tenGods?.time || '未知'}</div>
              </div>
            </div>
            <a href="/mall" className="mt-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">前往五行能量商城</button>
            </a>
          </div>
        )}
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
    </div>
  )
}