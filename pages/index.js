import { useState, useEffect, useRef, Suspense } from 'react'
import Head from 'next/head'
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
                {/* 3D饼图扇形 */}
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
                
                {/* 3D标签 */}
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
          {/* 雷达图网格 */}
          {[1, 2, 3, 4, 5].map(level => (
            <mesh key={level} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[level * 0.4 - 0.02, level * 0.4, 32]} />
              <meshBasicMaterial color="#ddd" transparent opacity={0.3} />
            </mesh>
          ))}
          
          {/* 雷达图轴线 */}
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
          
          {/* 3D数据点 */}
          {elements.map((element, index) => {
            const normalizedValue = element.value / maxValue
            const radius = normalizedValue * 2
            
            return (
              <group key={element.name}>
                {/* 数据点球体 */}
                <mesh position={[
                  Math.cos(element.angle) * radius,
                  0.2,
                  Math.sin(element.angle) * radius
                ]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial color={element.color} />
                </mesh>
                
                {/* 数据柱 */}
                <mesh position={[
                  Math.cos(element.angle) * radius,
                  0,
                  Math.sin(element.angle) * radius
                ]}>
                  <cylinderGeometry args={[0.05, 0.05, element.value * 0.3]} />
                  <meshStandardMaterial color={element.color} transparent opacity={0.7} />
                </mesh>
                
                {/* 标签 */}
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
          
          {/* 连接线形成雷达图形状 */}
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={elements.length + 1}
                array={new Float32Array([
                  ...elements.flatMap(element => {
                    const normalizedValue = element.value / maxValue
                    const radius = normalizedValue * 2
                    return [
                      Math.cos(element.angle) * radius,
                      0.1,
                      Math.sin(element.angle) * radius
                    ]
                  }),
                  // 闭合线条
                  Math.cos(elements[0].angle) * (elements[0].value / maxValue) * 2,
                  0.1,
                  Math.sin(elements[0].angle) * (elements[0].value / maxValue) * 2
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#2196F3" linewidth={3} />
          </mesh>
        </group>
      </Suspense>
    </Canvas>
  )
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
        <meta name="description" content="Analyze your BaZi chart and discover your five elements balance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Chinese BaZi Five Elements Analysis</h1>
          <p className="text-lg text-gray-600">Discover your elemental balance and life insights through traditional Chinese metaphysics</p>
        </div>

        {/* 输入表单 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名 (Name)</label>
                <input
                  type="text"
                  name="userName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">性别 (Gender)</label>
                <select
                  name="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="male">男 (Male)</option>
                  <option value="female">女 (Female)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">出生日期 (Birth Date)</label>
                <input
                  type="date"
                  name="birthday"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">出生时间 (Birth Time)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    name="birthtime"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={unknownTime}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={unknownTime}
                      onChange={(e) => setUnknownTime(e.target.checked)}
                      className="mr-1"
                    />
                    <span className="text-sm text-gray-600">时间不详</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">历法类型 (Calendar Type)</label>
              <select
                name="calendar"
                value={calendar}
                onChange={(e) => setCalendar(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="solar">公历 (Solar Calendar)</option>
                <option value="lunar">农历 (Lunar Calendar)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '分析中...' : '开始分析 (Start Analysis)'}
            </button>
          </form>
        </div>

        {/* 五行基础知识 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">🌟 五行基础知识 (Five Elements Basics)</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🌳</div>
              <h4 className="font-medium text-green-800">木 (Wood)</h4>
              <p className="text-sm text-green-600">生长、创造、仁慈</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-medium text-red-800">火 (Fire)</h4>
              <p className="text-sm text-red-600">热情、活力、礼貌</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">🏔️</div>
              <h4 className="font-medium text-yellow-800">土 (Earth)</h4>
              <p className="text-sm text-yellow-600">稳定、诚信、包容</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⚔️</div>
              <h4 className="font-medium text-gray-800">金 (Metal)</h4>
              <p className="text-sm text-gray-600">坚毅、正义、果断</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">💧</div>
              <h4 className="font-medium text-blue-800">水 (Water)</h4>
              <p className="text-sm text-blue-600">智慧、灵活、包容</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">正在分析您的八字...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* 八字图表 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">📊 您的八字图表 (Your BaZi Chart)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2">年柱 (Year)</th>
                      <th className="border border-gray-300 px-4 py-2">月柱 (Month)</th>
                      <th className="border border-gray-300 px-4 py-2">日柱 (Day)</th>
                      <th className="border border-gray-300 px-4 py-2">时柱 (Hour)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="font-bold text-lg">{result.bazi?.year || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="font-bold text-lg">{result.bazi?.month || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="font-bold text-lg">{result.bazi?.day || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="font-bold text-lg">{result.bazi?.hour || '时辰不详'}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 调试信息 */}
            {result.debug && (
              <div className="bg-gray-50 rounded-lg p-4">
                <details>
                  <summary className="cursor-pointer font-medium text-gray-700">🔍 调试信息 (Debug Info)</summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(result.debug, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* 性别标识 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">👤 个人信息 (Personal Info)</h3>
              <div className="flex items-center space-x-4">
                <span className="text-lg">性别: {result.gender === 'male' ? '👨 男性' : '👩 女性'}</span>
                <span className="text-lg">姓名: {result.userName || '未提供'}</span>
              </div>
            </div>

            {/* 详细分析内容 */}
            {result.analysis && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">🔮 详细八字分析 (Detailed BaZi Analysis)</h3>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {result.analysis}
                  </pre>
                </div>
              </div>
            )}

            {/* 3D五行分布图表 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🎯 3D五行分布图表 (3D Five Elements Distribution)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px] border rounded-lg">
                  <h4 className="text-center font-medium p-2">3D饼图 (3D Pie Chart)</h4>
                  <div className="h-[350px]">
                    <Wuxing3DPieChart data={result.wuxingCounts} />
                  </div>
                </div>
                <div className="h-[400px] border rounded-lg">
                  <h4 className="text-center font-medium p-2">3D雷达图 (3D Radar Chart)</h4>
                  <div className="h-[350px]">
                    <Wuxing3DRadarChart data={result.wuxingCounts} />
                  </div>
                </div>
              </div>
              
              {/* 操作提示 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                💡 提示：可以用鼠标拖拽旋转、滚轮缩放、右键平移来查看3D图表
              </div>
            </div>

            {/* 五行能量平衡分析 - 带进度条 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-6">⚖️ 五行能量平衡分析 (Five Elements Energy Balance)</h3>
              
              {/* 五行进度条显示 */}
              <div className="space-y-4 mb-6">
                {[
                  { name: 'Metal', chinese: '金', value: result.wuxingCounts.metal, color: '#9E9E9E', icon: '⚔️' },
                  { name: 'Wood', chinese: '木', value: result.wuxingCounts.wood, color: '#4CAF50', icon: '🌳' },
                  { name: 'Water', chinese: '水', value: result.wuxingCounts.water, color: '#2196F3', icon: '💧' },
                  { name: 'Fire', chinese: '火', value: result.wuxingCounts.fire, color: '#FF5722', icon: '🔥' },
                  { name: 'Earth', chinese: '土', value: result.wuxingCounts.earth, color: '#795548', icon: '🏔️' }
                ].map((element) => {
                  const total = Object.values(result.wuxingCounts).reduce((sum, val) => sum + val, 0)
                  const percentage = total > 0 ? (element.value / total * 100) : 0
                  const idealRange = 20 // 理想情况下每个元素占20%
                  const deviation = Math.abs(percentage - idealRange)
                  
                  let status = 'Balanced'
                  let statusColor = 'text-green-600'
                  let statusBg = 'bg-green-100'
                  
                  if (deviation > 10) {
                    if (percentage > idealRange) {
                      status = 'Excessive'
                      statusColor = 'text-red-600'
                      statusBg = 'bg-red-100'
                    } else {
                      status = 'Deficient'
                      statusColor = 'text-orange-600'
                      statusBg = 'bg-orange-100'
                    }
                  } else if (deviation > 5) {
                    status = 'Moderate'
                    statusColor = 'text-yellow-600'
                    statusBg = 'bg-yellow-100'
                  }
                  
                  return (
                    <div key={element.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{element.icon}</span>
                          <span className="font-medium text-gray-800">
                            {element.chinese} ({element.name})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">{element.value}/8</span>
                          <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} ${statusBg}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                      
                      {/* 进度条 */}
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          {/* 理想范围指示器 */}
                          <div 
                            className="absolute top-0 bg-green-300 h-4 opacity-30"
                            style={{
                              left: '15%',
                              width: '10%'
                            }}
                          ></div>
                          
                          {/* 实际数值进度条 */}
                          <div 
                            className="h-4 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: element.color
                            }}
                          ></div>
                        </div>
                        
                        {/* 刻度标记 */}
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      {/* 理想范围提示 */}
                      <div className="mt-2 text-xs text-gray-500">
                        💡 理想范围: 15-25% (绿色区域表示平衡状态)
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* 整体平衡评估 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🎯 整体平衡评估</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {Object.values(result.wuxingCounts).reduce((sum, val) => sum + val, 0)}/8
                    </div>
                    <div className="text-gray-600">总元素数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {Object.values(result.wuxingCounts).filter(val => val > 0).length}/5
                    </div>
                    <div className="text-gray-600">活跃元素</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.max(...Object.values(result.wuxingCounts)) - Math.min(...Object.values(result.wuxingCounts))}
                    </div>
                    <div className="text-gray-600">分布差异</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 五行计数显示 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">📈 五行统计 (Five Elements Count)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">⚔️</div>
                  <div className="font-semibold">金 (Metal)</div>
                  <div className="text-xl font-bold text-gray-600">{result.wuxingCounts.metal}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">🌳</div>
                  <div className="font-semibold">木 (Wood)</div>
                  <div className="text-xl font-bold text-green-600">{result.wuxingCounts.wood}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="font-semibold">水 (Water)</div>
                  <div className="text-xl font-bold text-blue-600">{result.wuxingCounts.water}</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-semibold">火 (Fire)</div>
                  <div className="text-xl font-bold text-red-600">{result.wuxingCounts.fire}</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-2">🏔️</div>
                  <div className="font-semibold">土 (Earth)</div>
                  <div className="text-xl font-bold text-yellow-600">{result.wuxingCounts.earth}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2024 五行分析系统 - 传统智慧与现代科技的完美结合</p>
          <p className="text-gray-400 text-sm">Chinese BaZi Five Elements Analysis - Ancient Wisdom Meets Modern Technology</p>
        </div>
      </footer>
    </div>
  )
}