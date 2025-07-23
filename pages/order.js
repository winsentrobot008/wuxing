import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    birthTime: '',
    package: 'basic',
    serviceType: 'analysis'
  })
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('analysis')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const router = useRouter()

  // 根据README定义的商业模式
  const packages = {
    basic: { 
      name: '基础五行分析', 
      price: 0, 
      originalPrice: 99,
      features: ['八字五行分析', '五行能量分布图', '基础平衡建议', '可视化图表展示'],
      type: 'free'
    },
    premium: { 
      name: '深度分析报告', 
      price: 9.99, 
      features: ['基础分析全部内容', '详细命理解读', '个性化调理方案', '一年运势预测', '五行平衡图片生成'],
      type: 'paid'
    },
    vip: { 
      name: 'VIP专家咨询', 
      price: 29.99, 
      features: ['深度报告全部内容', '专家一对一咨询', '定制化能量符号', '终身更新服务', 'AI画像生成'],
      type: 'premium'
    }
  }

  // 五行能量服务
  const services = {
    analysis: {
      name: '八字五行分析',
      description: '基于传统命理学，分析您的五行能量分布',
      icon: '🔮'
    },
    balance: {
      name: '五行平衡图生成',
      description: '生成个性化的五行能量平衡图片',
      icon: '⚖️'
    },
    symbol: {
      name: '能量符号定制',
      description: '根据五行分析结果，生成专属能量符号',
      icon: '🎯'
    },
    image: {
      name: '图片五行识别',
      description: '上传图片，AI识别其中的五行元素',
      icon: '🖼️'
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateBalanceImage = async () => {
    if (!generatedContent) {
      alert('请先进行五行分析')
      return
    }
    
    setImageLoading(true)
    try {
      const response = await fetch('/api/generateEnergyImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wuxingData: generatedContent.wuxing,
          userName: formData.name
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setGeneratedImage(result)
        setGeneratedContent(prev => ({
          ...prev,
          balanceImage: result.imageUrl
        }))
      }
    } catch (error) {
      console.error('生成图片失败:', error)
      alert('生成图片失败，请重试')
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 根据选择的服务类型处理不同的逻辑
      if (selectedService === 'analysis') {
        // 八字分析
        const response = await fetch('/api/calculateBazi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            birthDate: formData.birthDate,
            birthTime: formData.birthTime,
            package: formData.package
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          setGeneratedContent(result)
          // 如果是付费套餐，跳转到支付页面
          if (packages[formData.package].type !== 'free') {
            // 这里集成支付接口
            alert(`请支付 $${packages[formData.package].price} 获取完整报告`)
          }
        }
      } else if (selectedService === 'image') {
        // 图片五行识别
        if (!uploadedImage) {
          alert('请先上传图片')
          return
        }
        
        const response = await fetch('/api/analyzeImageWuxing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: uploadedImage
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          setGeneratedContent(result)
        }
      }
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>五行能量服务订购 - 五行分析系统</title>
        <meta name="description" content="订购个性化五行分析服务，获取专业的命理指导和能量平衡方案" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">五行分析系统</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌟 五行能量服务中心
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              基于传统五行理论与现代AI技术，为您提供个性化的命理分析和能量平衡解决方案
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 左侧：服务选择和表单 */}
            <div className="space-y-8">
              {/* 服务类型选择 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">选择服务类型</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(services).map(([key, service]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedService(key)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedService === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{service.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 套餐选择 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">选择分析套餐</h2>
                <div className="space-y-4">
                  {Object.entries(packages).map(([key, pkg]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.package === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, package: key }))}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
                        <div className="text-right">
                          {pkg.type === 'free' ? (
                            <div>
                              <span className="text-2xl font-bold text-green-600">免费</span>
                              <div className="text-sm text-gray-500 line-through">${pkg.originalPrice}</div>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-blue-600">${pkg.price}</span>
                          )}
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 用户信息表单 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">填写信息</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您的姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您的邮箱"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手机号
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您的手机号"
                    />
                  </div>

                  {(selectedService === 'analysis' || selectedService === 'balance') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          出生日期 *
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          出生时间
                        </label>
                        <input
                          type="time"
                          name="birthTime"
                          value={formData.birthTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {selectedService === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        上传图片 *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadedImage && (
                        <div className="mt-2">
                          <img src={uploadedImage} alt="上传的图片" className="max-w-full h-32 object-cover rounded" />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {loading ? '处理中...' : (
                      packages[formData.package].type === 'free' ? '开始免费分析' : `支付 $${packages[formData.package].price} 获取报告`
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* 右侧：结果展示 */}
            <div className="space-y-8">
              {/* 分析结果 */}
              {generatedContent && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">分析结果</h2>
                  
                  {selectedService === 'analysis' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">五行分布</h3>
                        {generatedContent.wuxing && Object.entries(generatedContent.wuxing).map(([element, value]) => (
                          <div key={element} className="flex justify-between items-center mb-1">
                            <span className="text-blue-800">{element}</span>
                            <span className="font-semibold text-blue-900">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {generatedContent.advice && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h3 className="font-semibold text-green-900 mb-2">平衡建议</h3>
                          <p className="text-green-800">{generatedContent.advice}</p>
                        </div>
                      )}

                      {/* 五行能量平衡分析 - 紧凑版 */}
                      <div className="flex justify-center my-8">
                        <div className="bg-white rounded-lg shadow-md p-4 max-w-md w-full">
                          <h3 className="text-lg font-bold text-center mb-4 text-gray-800">
                            ⚖️ 五行能量平衡分析
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">⚔️</span>
                                <span className="text-sm font-medium">金 (Metal)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">平衡</span>
                                <span className="text-sm font-bold">{generatedContent.wuxing?.金 || 1}</span>
                                <span className="text-xs text-gray-500">12.5%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">🌳</span>
                                <span className="text-sm font-medium">木 (Wood)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">平衡</span>
                                <span className="text-sm font-bold">{generatedContent.wuxing?.木 || 2}</span>
                                <span className="text-xs text-gray-500">25.0%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">💧</span>
                                <span className="text-sm font-medium">水 (Water)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">平衡</span>
                                <span className="text-sm font-bold">{generatedContent.wuxing?.水 || 2}</span>
                                <span className="text-xs text-gray-500">25.0%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">🔥</span>
                                <span className="text-sm font-medium">火 (Fire)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">平衡</span>
                                <span className="text-sm font-bold">{generatedContent.wuxing?.火 || 2}</span>
                                <span className="text-xs text-gray-500">25.0%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">🏔️</span>
                                <span className="text-sm font-medium">土 (Earth)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">平衡</span>
                                <span className="text-sm font-bold">{generatedContent.wuxing?.土 || 1}</span>
                                <span className="text-xs text-gray-500">12.5%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService === 'image' && generatedContent.elements && (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-900 mb-2">图片五行元素识别</h3>
                        {Object.entries(generatedContent.elements).map(([element, score]) => (
                          <div key={element} className="flex justify-between items-center mb-1">
                            <span className="text-purple-800">{element}</span>
                            <span className="font-semibold text-purple-900">{score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 五行平衡图生成 */}
                  {selectedService === 'analysis' && packages[formData.package].type !== 'free' && (
                    <div className="mt-6">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">🎨 专属五行平衡能量图</h3>
                        <p className="text-gray-600 mb-4">
                          基于您的八字分析，生成个性化的五行平衡图，帮助您了解需要调理的能量方向
                        </p>
                        
                        {!generatedImage ? (
                          <button
                            onClick={generateBalanceImage}
                            disabled={imageLoading}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50"
                          >
                            {imageLoading ? '🎨 生成中...' : '🎨 生成我的平衡图'}
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <img 
                              src={generatedImage.imageUrl} 
                              alt="五行平衡能量图" 
                              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                            />
                            <div className="text-center space-y-2">
                              <div className="space-x-4">
                                <a 
                                  href={generatedImage.imageUrl} 
                                  download="五行平衡图.png"
                                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                                >
                                  📥 下载图片
                                </a>
                                <button
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: '我的五行平衡能量图',
                                        url: generatedImage.imageUrl
                                      })
                                    } else {
                                      alert('您的浏览器不支持分享功能')
                                    }
                                  }}
                                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                                >
                                  📤 分享图片
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 服务说明 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">服务说明</h2>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">🔮</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">专业分析</h3>
                      <p>基于传统八字命理学，结合现代数据分析技术</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">⚡</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">即时生成</h3>
                      <p>AI智能分析，几秒钟内获得详细报告</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 mt-1">🎯</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">个性化建议</h3>
                      <p>针对您的五行特点，提供专属调理方案</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 用户评价 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">用户评价</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="ml-2 font-semibold">张女士</span>
                    </div>
                    <p className="text-gray-700">"分析很准确，建议也很实用，帮助我更好地了解自己的性格特点。"</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="ml-2 font-semibold">李先生</span>
                    </div>
                    <p className="text-gray-700">"生成的平衡图很漂亮，分享给朋友们都说很有意思。"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">五行分析系统</h3>
                <p className="text-gray-400">
                  传统智慧与现代科技的完美结合，为您提供专业的五行能量分析服务。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">服务项目</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>八字五行分析</li>
                  <li>五行平衡图生成</li>
                  <li>能量符号定制</li>
                  <li>图片五行识别</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">联系我们</h3>
                <div className="space-y-2 text-gray-400">
                  <p>📧 contact@wuxing.ai</p>
                  <p>📱 400-888-8888</p>
                  <p>🌐 www.wuxing.ai</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 五行分析系统. 保留所有权利.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}