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
        labels: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
        datasets: [{
          data: [
            data.wood,
            data.fire,
            data.earth,
            data.metal,
            data.water
          ],
          backgroundColor: [
            '#4CAF50', // Wood
            '#FF5722', // Fire
            '#795548', // Earth
            '#9E9E9E', // Metal
            '#2196F3'  // Water
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
            text: 'Five Elements Distribution',
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
        labels: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
        datasets: [{
          label: 'Element Strength',
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
            text: 'Element Strength Distribution',
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
        throw new Error(responseData.error || 'Calculation failed')
      }

      setResult(responseData.data)
    } catch (error) {
      console.error('Calculation failed:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Chinese BaZi Five Elements Analysis</title>
        <meta name="description" content="Traditional Chinese BaZi Five Elements Analysis System" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/images/icon-192x192.png" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">BaZi Five Elements Analysis</h1>
          <p className="text-gray-600">Discover your elemental nature and life path through ancient Chinese wisdom</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleCalculate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="userName"
                    placeholder="Enter your name (optional)"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                  <input
                    type="date"
                    name="birthday"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Birth Time</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="unknownTime"
                        checked={unknownTime}
                        onChange={(e) => setUnknownTime(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <label htmlFor="unknownTime" className="ml-2 text-sm text-gray-600">Unknown birth time</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    name="gender" 
                    required 
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Type</label>
                  <select 
                    name="calendar" 
                    value={calendar}
                    onChange={(e) => setCalendar(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="solar">Solar Calendar (Gregorian)</option>
                    <option value="lunar">Lunar Calendar (Chinese)</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Five Elements Basics</h3>
                <div className="space-y-2 text-sm">
                  <p>🌳 <span className="font-medium">Wood</span>: Growth, creativity, flexibility</p>
                  <p>🔥 <span className="font-medium">Fire</span>: Energy, passion, transformation</p>
                  <p>🗺️ <span className="font-medium">Earth</span>: Stability, nurturing, grounding</p>
                  <p>⚔️ <span className="font-medium">Metal</span>: Structure, precision, determination</p>
                  <p>💧 <span className="font-medium">Water</span>: Wisdom, adaptability, intuition</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center">
            <div className="loading"></div>
            <p className="text-center mt-4 text-gray-600">Performing elemental analysis...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">BaZi Chart (Four Pillars)</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-gray-600">Year Pillar</div>
                  <div className="text-2xl font-bold">{result.eightChar?.year}</div>
                </div>
                <div>
                  <div className="text-gray-600">Month Pillar</div>
                  <div className="text-2xl font-bold">{result.eightChar?.month}</div>
                </div>
                <div>
                  <div className="text-gray-600">Day Pillar</div>
                  <div className="text-2xl font-bold">{result.eightChar?.day}</div>
                </div>
                <div>
                  <div className="text-gray-600">Hour Pillar</div>
                  <div className="text-2xl font-bold">{result.eightChar?.time}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Five Elements Distribution</h3>
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
                  <div>Wood: {result.wuxingCounts.wood}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#FF5722] mx-auto mb-1"></div>
                  <div>Fire: {result.wuxingCounts.fire}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#795548] mx-auto mb-1"></div>
                  <div>Earth: {result.wuxingCounts.earth}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#9E9E9E] mx-auto mb-1"></div>
                  <div>Metal: {result.wuxingCounts.metal}</div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-[#2196F3] mx-auto mb-1"></div>
                  <div>Water: {result.wuxingCounts.water}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-center text-white">
              <h3 className="text-xl font-semibold mb-2">Get Detailed Report</h3>
              <p className="mb-4">Want deeper insights and personalized recommendations?</p>
              <button 
                onClick={() => window.location.href = '/order'}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
              >
                Order Full Report - $14.99
              </button>
            </div>
          </div>
        )}
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
      
      <footer className="text-center text-gray-400 text-sm py-4">
        Version: 1.0.1 &nbsp;|&nbsp; Date: 2024-12-19
      </footer>
    </div>
  )
}