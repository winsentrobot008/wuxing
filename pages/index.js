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

        {/* ... existing form code ... */}

        {result && (
          <div className="space-y-6">
            {/* ... existing debug and analysis sections ... */}
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">3D Five Elements Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px] border rounded-lg">
                  <h4 className="text-center font-medium p-2">3D Pie Chart</h4>
                  <div className="h-[350px]">
                    <Wuxing3DPieChart data={result.wuxingCounts} />
                  </div>
                </div>
                <div className="h-[400px] border rounded-lg">
                  <h4 className="text-center font-medium p-2">3D Radar Chart</h4>
                  <div className="h-[350px]">
                    <Wuxing3DRadarChart data={result.wuxingCounts} />
                  </div>
                </div>
              </div>
              
              {/* 操作提示 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                💡 提示：可以用鼠标拖拽旋转、滚轮缩放、右键平移来查看3D图表
              </div>
              
              {/* ... existing element counts display ... */}
            </div>
            
            {/* ... rest of existing code ... */}
          </div>
        )}
      </div>

      {/* ... existing footer ... */}
    </div>
  )
}