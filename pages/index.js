import { useState, useEffect, useRef, Suspense } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js'
import Script from 'next/script'
import dynamic from 'next/dynamic'

// 动态导入Three.js组件，避免SSR问题
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { ssr: false })
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => mod.OrbitControls), { ssr: false })
const Text = dynamic(() => import('@react-three/drei').then(mod => mod.Text), { ssr: false })

// 3D饼图组件
function Wuxing3DPieChart({ data }) {
  const meshRef = useRef()
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  const elements = [
    { name: 'Wood', value: data.wood, color: '#4CAF50', angle: 0 },
    { name: 'Fire', value: data.fire, color: '#FF5722', angle: 0 },
    { name: 'Earth', value: data.earth, color: '#795548', angle: 0 },
    { name: 'Metal', value: data.metal, color: '#9E9E9E', angle: 0 },
    { name: 'Water', value: data.water, color: '#2196F3', angle: 0 }
  ]

  const total = Object.values(data).reduce((sum, val) => sum + val, 0)
  let currentAngle = 0

  elements.forEach(element => {
    element.angle = (element.value / total) * Math.PI * 2
  })

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        
        <group ref={meshRef}>
          {elements.map((element, index) => {
            const startAngle = currentAngle
            currentAngle += element.angle
            const midAngle = startAngle + element.angle / 2
            
            return (
              <group key={element.name}>
                <mesh
                  position={[
                    Math.cos(midAngle) * 0.1,
                    Math.sin(midAngle) * 0.1,
                    0
                  ]}
                  rotation={[0, 0, startAngle]}
                >
                  <cylinderGeometry args={[0, 1.5, 0.3, 32, 1, false, 0, element.angle]} />
                  <meshStandardMaterial color={element.color} />
                </mesh>
                
                <Text
                  position={[
                    Math.cos(midAngle) * 2.2,
                    Math.sin(midAngle) * 2.2,
                    0.2
                  ]}
                  fontSize={0.2}
                  color="#333"
                  anchorX="center"
                  anchorY="middle"
                >
                  {element.name}\n{element.value}
                </Text>
              </group>
            )
          })}
        </group>
      </Suspense>
    </Canvas>
  )
}

// 3D雷达图组件
function Wuxing3DRadarChart({ data }) {
  const groupRef = useRef()
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  const elements = [
    { name: 'Wood', value: data.wood, color: '#4CAF50', angle: 0 },
    { name: 'Fire', value: data.fire, color: '#FF5722', angle: Math.PI * 2 / 5 },
    { name: 'Earth', value: data.earth, color: '#795548', angle: Math.PI * 4 / 5 },
    { name: 'Metal', value: data.metal, color: '#9E9E9E', angle: Math.PI * 6 / 5 },
    { name: 'Water', value: data.water, color: '#2196F3', angle: Math.PI * 8 / 5 }
  ]

  const maxValue = Math.max(...Object.values(data)) || 1

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        
        <group ref={groupRef}>
          {[1, 2, 3, 4, 5].map(level => (
            <mesh key={level} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[level * 0.4 - 0.02, level * 0.4, 32]} />
              <meshBasicMaterial color="#ddd" transparent opacity={0.3} />
            </mesh>
          ))}
          
          {elements.map((element, index) => (
            <mesh key={`axis-${index}`} position={[
              Math.cos(element.angle) * 1,
              0,
              Math.sin(element.angle) * 1
            ]} rotation={[0, -element.angle, Math.PI / 2]}>
              <cylinderGeometry args={[0.01, 0.01, 2]} />
              <meshBasicMaterial color="#999" />
            </mesh>
          ))}
          
          {elements.map((element, index) => {
            const normalizedValue = element.value / maxValue
            const radius = normalizedValue * 2
            
            return (
              <group key={element.name}>
                <mesh position={[
                  Math.cos(element.angle) * radius,
                  0.2,
                  Math.sin(element.angle) * radius
                ]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial color={element.color} />
                </mesh>
                
                <mesh position={[
                  Math.cos(element.angle) * radius,
                  0,
                  Math.sin(element.angle) * radius
                ]}>
                  <cylinderGeometry args={[0.05, 0.05, element.value * 0.3]} />
                  <meshStandardMaterial color={element.color} transparent opacity={0.7} />
                </mesh>
                
                <Text
                  position={[
                    Math.cos(element.angle) * 2.5,
                    0.5,
                    Math.sin(element.angle) * 2.5
                  ]}
                  fontSize={0.15}
                  color="#333"
                  anchorX="center"
                  anchorY="middle"
                >
                  {element.name}\n{element.value}
                </Text>
              </group>
            )
          })}
        </group>
      </Suspense>
    </Canvas>
  )
}

// 2D饼图组件
function WuxingPieChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && window.Chart) {
      const ctx = canvasRef.current.getContext('2d')
      
      if (chartRef.current) {
        chartRef.current.destroy()
      }

      chartRef.current = new window.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['木 (Wood)', '火 (Fire)', '土 (Earth)', '金 (Metal)', '水 (Water)'],
          datasets: [{
            data: [data.wood, data.fire, data.earth, data.metal, data.water],
            backgroundColor: [
              '#4CAF50',
              '#FF5722',
              '#795548',
              '#9E9E9E',
              '#2196F3'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((context.parsed / total) * 100).toFixed(1)
                  return `${context.label}: ${context.parsed} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={canvasRef}></canvas>
}

// 2D雷达图组件
function WuxingRadarChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && window.Chart) {
      const ctx = canvasRef.current.getContext('2d')
      
      if (chartRef.current) {
        chartRef.current.destroy()
      }

      chartRef.current = new window.Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['木 (Wood)', '火 (Fire)', '土 (Earth)', '金 (Metal)', '水 (Water)'],
          datasets: [{
            label: '五行分布',
            data: [data.wood, data.fire, data.earth, data.metal, data.water],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: [
              '#4CAF50',
              '#FF5722',
              '#795548',
              '#9E9E9E',
              '#2196F3'
            ],
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: Math.max(...Object.values(data)) + 1,
              ticks: {
                stepSize: 1
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={canvasRef}></canvas>
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
      userName: formData.get('userName') || '未提供',
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
        <title>五行分析系统 - Chinese BaZi Five Elements Analysis</title>
        <meta name="description" content="专业的八字五行分析系统，发现您的五行平衡和人生洞察" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script 
        src="https://cdn.jsdelivr.net/npm/chart.js" 
        strategy="beforeInteractive"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🌟 五行分析系统</h1>
          <p className="text-lg text-gray-600">通过传统中华玄学发现您的五行平衡和人生洞察</p>
          <p className="text-md text-gray-500 mt-2">Chinese BaZi Five Elements Analysis System</p>
        </div>

        {/* 输入表单 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">📝 请输入您的出生信息</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 姓名 (Name) <span className="text-gray-400">(可选)</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的姓名（可选）"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚧ 性别 (Gender)
                </label>
                <select
                  name="gender"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="male">👨 男 (Male)</option>
                  <option value="female">👩 女 (Female)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 出生日期 (Birth Date)
                </label>
                <input
                  type="date"
                  name="birthday"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 出生时间 (Birth Time)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="time"
                    name="birthtime"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    disabled={unknownTime}
                  />
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unknownTime}
                      onChange={(e) => setUnknownTime(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">时间不详</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📆 历法类型 (Calendar Type)
              </label>
              <select
                name="calendar"
                value={calendar}
                onChange={(e) => setCalendar(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="solar">🌞 公历 (Solar Calendar)</option>
                <option value="lunar">🌙 农历 (Lunar Calendar)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
            >
              {loading ? '🔮 分析中...' : '🚀 开始分析 (Start Analysis)'}
            </button>
          </form>
        </div>

        {/* 五行基础知识 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-6 text-center">🌟 五行基础知识 (Five Elements Basics)</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🌳</div>
              <h4 className="font-bold text-green-800 text-lg mb-2">木 (Wood)</h4>
              <p className="text-sm text-green-600">生长、创造、仁慈</p>
              <p className="text-xs text-green-500 mt-1">Growth, Creation, Kindness</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🔥</div>
              <h4 className="font-bold text-red-800 text-lg mb-2">火 (Fire)</h4>
              <p className="text-sm text-red-600">热情、活力、礼貌</p>
              <p className="text-xs text-red-500 mt-1">Passion, Energy, Courtesy</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🏔️</div>
              <h4 className="font-bold text-yellow-800 text-lg mb-2">土 (Earth)</h4>
              <p className="text-sm text-yellow-600">稳定、诚信、包容</p>
              <p className="text-xs text-yellow-500 mt-1">Stability, Honesty, Tolerance</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">⚔️</div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">金 (Metal)</h4>
              <p className="text-sm text-gray-600">坚毅、正义、果断</p>
              <p className="text-xs text-gray-500 mt-1">Perseverance, Justice, Decisiveness</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">💧</div>
              <h4 className="font-bold text-blue-800 text-lg mb-2">水 (Water)</h4>
              <p className="text-sm text-blue-600">智慧、灵活、包容</p>
              <p className="text-xs text-blue-500 mt-1">Wisdom, Flexibility, Tolerance</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">🔮 正在分析您的八字，请稍候...</p>
            <p className="text-sm text-gray-500">Analyzing your BaZi chart...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* 八字图表 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-6 text-center">📊 您的八字图表 (Your BaZi Chart)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <th className="border border-gray-300 px-6 py-4 text-lg font-semibold">年柱 (Year)</th>
                      <th className="border border-gray-300 px-6 py-4 text-lg font-semibold">月柱 (Month)</th>
                      <th className="border border-gray-300 px-6 py-4 text-lg font-semibold">日柱 (Day)</th>
                      <th className="border border-gray-300 px-6 py-4 text-lg font-semibold">时柱 (Hour)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <div className="font-bold text-2xl text-blue-600">{result.bazi?.year || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <div className="font-bold text-2xl text-green-600">{result.bazi?.month || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <div className="font-bold text-2xl text-purple-600">{result.bazi?.day || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <div className="font-bold text-2xl text-orange-600">{result.bazi?.hour || '时辰不详'}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 个人信息 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">👤 个人信息 (Personal Info)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{result.gender === 'male' ? '👨' : '👩'}</span>
                  <span className="text-lg">性别: {result.gender === 'male' ? '男性' : '女性'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <span className="text-lg">姓名: {result.userName || '未提供'}</span>
                </div>
              </div>
            </div>

            {/* 五行分布图表 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-6 text-center">📊 五行分布图表 (Five Elements Distribution)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-xl font-medium mb-4 text-center">🥧 饼图 (Pie Chart)</h4>
                  <div className="h-80">
                    <WuxingPieChart data={result.wuxingCounts} />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-xl font-medium mb-4 text-center">🕸️ 雷达图 (Radar Chart)</h4>
                  <div className="h-80">
                    <WuxingRadarChart data={result.wuxingCounts} />
                  </div>
                </div>
              </div>
            </div>

            {/* 五行能量平衡分析 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-6 text-center">⚖️ 五行能量平衡分析 (Five Elements Energy Balance)</h3>
              
              <div className="space-y-6">
                {[
                  { name: 'Metal', chinese: '金', value: result.wuxingCounts.metal, color: '#9E9E9E', icon: '⚔️', bgColor: 'bg-gray-100' },
                  { name: 'Wood', chinese: '木', value: result.wuxingCounts.wood, color: '#4CAF50', icon: '🌳', bgColor: 'bg-green-100' },
                  { name: 'Water', chinese: '水', value: result.wuxingCounts.water, color: '#2196F3', icon: '💧', bgColor: 'bg-blue-100' },
                  { name: 'Fire', chinese: '火', value: result.wuxingCounts.fire, color: '#FF5722', icon: '🔥', bgColor: 'bg-red-100' },
                  { name: 'Earth', chinese: '土', value: result.wuxingCounts.earth, color: '#795548', icon: '🏔️', bgColor: 'bg-yellow-100' }
                ].map((element) => {
                  const total = Object.values(result.wuxingCounts).reduce((sum, val) => sum + val, 0)
                  const percentage = total > 0 ? (element.value / total * 100) : 0
                  const idealRange = 20
                  const deviation = Math.abs(percentage - idealRange)
                  
                  let status = '平衡'
                  let statusColor = 'text-green-600'
                  let statusBg = 'bg-green-100'
                  
                  if (deviation > 10) {
                    if (percentage > idealRange) {
                      status = '过旺'
                      statusColor = 'text-red-600'
                      statusBg = 'bg-red-100'
                    } else {
                      status = '不足'
                      statusColor = 'text-orange-600'
                      statusBg = 'bg-orange-100'
                    }
                  }
                  
                  return (
                    <div key={element.name} className={`${element.bgColor} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{element.icon}</span>
                          <div>
                            <h4 className="font-bold text-lg">{element.chinese} ({element.name})</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                              {status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: element.color }}>{element.value}</div>
                          <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: element.color
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 整体平衡评估 */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="text-xl font-semibold mb-4 text-center">🎯 整体平衡评估</h4>
                <div className="text-center">
                  {(() => {
                    const total = Object.values(result.wuxingCounts).reduce((sum, val) => sum + val, 0)
                    const values = Object.values(result.wuxingCounts)
                    const avg = total / 5
                    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / 5
                    const balance = Math.max(0, 100 - variance * 10)
                    
                    let balanceText = '需要调理'
                    let balanceColor = 'text-red-600'
                    let balanceIcon = '⚠️'
                    
                    if (balance > 80) {
                      balanceText = '非常平衡'
                      balanceColor = 'text-green-600'
                      balanceIcon = '✅'
                    } else if (balance > 60) {
                      balanceText = '基本平衡'
                      balanceColor = 'text-blue-600'
                      balanceIcon = '🔵'
                    } else if (balance > 40) {
                      balanceText = '轻微失衡'
                      balanceColor = 'text-yellow-600'
                      balanceIcon = '⚡'
                    }
                    
                    return (
                      <div>
                        <div className="text-4xl mb-2">{balanceIcon}</div>
                        <div className={`text-2xl font-bold ${balanceColor} mb-2`}>{balanceText}</div>
                        <div className="text-lg text-gray-600">平衡度: {balance.toFixed(1)}%</div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* 详细分析内容 */}
            {result.analysis && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-6">🔮 详细八字分析 (Detailed BaZi Analysis)</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {result.analysis}
                  </pre>
                </div>
              </div>
            )}

            {/* 订购详细报告 */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎁 获取完整专业报告</h3>
              <p className="text-lg mb-6">想要更深入的分析和个性化建议吗？</p>
              <Link href="/order" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                📋 订购详细报告
              </Link>
            </div>

            {/* 调试信息 */}
            {result.debug && (
              <div className="bg-gray-50 rounded-lg p-4">
                <details>
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">🔍 调试信息 (Debug Info)</summary>
                  <pre className="mt-4 text-xs text-gray-600 overflow-auto bg-white p-4 rounded border">
                    {JSON.stringify(result.debug, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        {/* 页脚 */}
        <footer className="mt-12 text-center text-gray-500">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-lg font-medium mb-2">🌟 五行分析系统</p>
            <p className="text-sm">基于传统中华玄学的现代化分析工具</p>
            <p className="text-xs mt-2">© 2025 Five Elements Analysis System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}