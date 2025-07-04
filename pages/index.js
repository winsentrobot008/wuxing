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
            '#F44336', // 火
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
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: '五行分布',
            font: {
              size: 13
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

  return <canvas ref={chartRef} style={{ maxHeight: '180px' }} />
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
              size: 13
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

  return <canvas ref={chartRef} style={{ maxHeight: '180px' }} />
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [unknownTime, setUnknownTime] = useState(false)
  const [isLunar, setIsLunar] = useState(false)

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
      isLunar: isLunar
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

      <main className="container mx-auto px-3 py-4">
        <h1 className="text-2xl font-bold text-center mb-4">八字五行分析系统</h1>

        <form onSubmit={handleCalculate} className="max-w-md mx-auto">
          <div className="mb-3">
            <label className="block mb-1">姓名</label>
            <input
              type="text"
              name="userName"
              className="w-full p-1.5 border rounded"
              placeholder="请输入姓名（选填）"
            />
          </div>
          
          <div className="mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isLunar}
                onChange={(e) => setIsLunar(e.target.checked)}
                className="mr-1"
              />
              <span>使用农历日期</span>
            </label>
          </div>

          <div className="mb-3">
            <label className="block mb-1">{isLunar ? '农历出生日期' : '公历出生日期'}</label>
            <input
              type="date"
              name="birthday"
              required
              className="w-full p-1.5 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">出生时间</label>
            <input
              type="time"
              name="birthtime"
              className="w-full p-1.5 border rounded"
              disabled={unknownTime}
            />
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="mr-1"
                />
                <span>不知道出生时间</span>
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">性别</label>
            <select name="gender" required className="w-full p-1.5 border rounded">
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '计算中...' : '开始分析'}
          </button>
        </form>

        {result && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-3">分析结果</h2>
            
            <div className="bg-white rounded-lg shadow p-4 mb-3">
              <h3 className="text-lg font-semibold mb-2">基本信息</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <div className="text-gray-600 text-sm">公历日期</div>
                  <div className="font-medium">{`${result.solar.year}年${result.solar.month}月${result.solar.day}日${result.solar.hour !== null ? ` ${result.solar.hour}时` : ''}`}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">农历日期</div>
                  <div className="font-medium">{`${result.lunar.lunarYear}年${result.lunar.lunarMonthName}月${result.lunar.lunarDayName}`}</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <div className="text-gray-600 text-sm">生肖</div>
                  <div className="font-medium">{result.lunar.zodiac}</div>
                </div>
                
                <div>
                  <div className="text-gray-600 text-sm">节气</div>
                  <div>
                    <span className="text-sm">{result.jieqi.prev.name}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-sm">{result.jieqi.next.name}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 mb-3">
              <h3 className="text-lg font-semibold mb-2">八字</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-gray-600 text-xs">年柱</div>
                  <div className="text-xl font-bold">{result.eightChar.year}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">月柱</div>
                  <div className="text-xl font-bold">{result.eightChar.month}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">日柱</div>
                  <div className="text-xl font-bold">{result.eightChar.day}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">时柱</div>
                  <div className="text-xl font-bold">{result.eightChar.time}</div>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-sm mb-1">纳音五行</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-gray-600 text-xs">年柱</div>
                    <div>{result.nayin.year}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">月柱</div>
                    <div>{result.nayin.month}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">日柱</div>
                    <div>{result.nayin.day}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">时柱</div>
                    <div>{result.nayin.time}</div>
                  </div>
                </div>
              </div>
              
              {result.tenGods && result.tenGods.year && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-1">十神</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-600 text-xs">年干</div>
                      <div>{result.tenGods.year}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs">月干</div>
                      <div>{result.tenGods.month}</div>
                    </div>
                    {result.tenGods.time && (
                      <div>
                        <div className="text-gray-600 text-xs">时干</div>
                        <div>{result.tenGods.time}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-3">
              <h3 className="text-lg font-semibold mb-2">五行分布</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-[180px] flex items-center justify-center">
                  <WuxingPieChart data={result.wuxingCounts} />
                </div>
                <div className="h-[180px] flex items-center justify-center">
                  <WuxingRadarChart data={result.wuxingCounts} />
                </div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-1 text-sm">
                <div className="text-center">
                  <div className="w-3 h-3 bg-[#4CAF50] mx-auto mb-0.5"></div>
                  <div>木: {result.wuxingCounts.wood}</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-[#F44336] mx-auto mb-0.5"></div>
                  <div>火: {result.wuxingCounts.fire}</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-[#795548] mx-auto mb-0.5"></div>
                  <div>土: {result.wuxingCounts.earth}</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-[#9E9E9E] mx-auto mb-0.5"></div>
                  <div>金: {result.wuxingCounts.metal}</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-[#2196F3] mx-auto mb-0.5"></div>
                  <div>水: {result.wuxingCounts.water}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-3">
              <h3 className="text-lg font-semibold mb-2">五行分析</h3>
              <div className="space-y-3">
                <div className="prose max-w-none text-sm">
                  <h4 className="text-base font-medium mb-1">五行特征</h4>
                  <p className="whitespace-pre-line">{result.analysis}</p>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-base font-medium mb-1">五行关系</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <h5 className="font-medium mb-1 text-sm">生克关系</h5>
                      <ul className="list-disc list-inside space-y-0 text-xs">
                        <li>木生火：生长之气助长温暖光明</li>
                        <li>火生土：温暖之气促进包容稳重</li>
                        <li>土生金：包容之气增强坚毅果断</li>
                        <li>金生水：果断之气化为智慧灵动</li>
                        <li>水生木：智慧之气助益生长向上</li>
                        <li>木克土：生长力量制约包容稳重</li>
                        <li>火克金：温暖光明制约坚毅果断</li>
                        <li>土克水：包容稳重制约智慧灵动</li>
                        <li>金克木：坚毅果断制约生长向上</li>
                        <li>水克火：智慧灵动制约温暖光明</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <h5 className="font-medium mb-1 text-sm">五行平衡建议</h5>
                      <ul className="list-disc list-inside space-y-0 text-xs">
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