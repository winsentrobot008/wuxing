import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: 'basic'
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const packages = {
    basic: { name: '基础报告', price: 99, features: ['详细八字分析', '五行平衡建议', '运势预测'] },
    premium: { name: '高级报告', price: 199, features: ['基础报告全部内容', '姓名五行分析', '个性化调理方案', '一年运势详解'] },
    vip: { name: 'VIP报告', price: 399, features: ['高级报告全部内容', '专家一对一咨询', '定制化建议', '终身更新服务'] }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // 这里可以集成支付接口
    try {
      // 模拟订单处理
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('订单提交成功！我们将在24小时内发送详细报告到您的邮箱。')
      router.push('/')
    } catch (error) {
      alert('订单提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>订购详细报告 - 八字五行分析系统</title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">订购详细报告</h1>
          <p className="text-gray-600">选择适合您的分析套餐</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(packages).map(([key, pkg]) => (
            <div 
              key={key}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer border-2 transition ${
                formData.package === key ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setFormData({...formData, package: key})}
            >
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">¥{pkg.price}</div>
              <ul className="space-y-2">
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">填写订购信息</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="mb-4">
                <span className="text-lg">总计：</span>
                <span className="text-2xl font-bold text-blue-600">¥{packages[formData.package].price}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                {loading ? '处理中...' : '立即支付'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// 🎨 五行能量服务免费测试版设计

我来为你设计一个包含多种服务选项的免费测试版本，让用户可以体验不同的五行能量服务。

### 📋 服务选项设计

#### 1. 更新订单页面 - 添加服务选项
import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: 'basic',
    serviceType: 'generate' // 新增服务类型
  })
  
  const [selectedService, setSelectedService] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [loading, setLoading] = useState(false)

  // 服务选项配置
  const serviceOptions = [
    {
      id: 'generate',
      title: '🎨 AI生成五行平衡图',
      description: '基于您的八字分析，AI生成专属的五行能量平衡图',
      features: ['个性化设计', '高清图片', '可下载保存'],
      price: '免费体验',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'upload',
      title: '🖼️ 图片五行能量修改',
      description: '上传您的照片，AI分析并调整其五行能量属性',
      features: ['照片分析', '能量调整', '对比展示'],
      price: '免费体验',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'animation',
      title: '✨ 五行能量动图生成',
      description: '创建动态的五行能量流转图，展现能量变化过程',
      features: ['动态效果', 'GIF格式', '循环播放'],
      price: '免费体验',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'blessing',
      title: '🙏 数字开光加持',
      description: '为您的五行图片进行传统开光仪式，增强能量效果',
      features: ['传统仪式', '能量加持', '开光证书'],
      price: '免费体验',
      color: 'from-yellow-500 to-red-500'
    }
  ]

  // 处理服务选择
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId)
    setFormData(prev => ({ ...prev, serviceType: serviceId }))
  }

  // 处理图片上传
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // 生成服务内容
  const generateService = async () => {
    try {
      setLoading(true)
      
      // 从localStorage获取用户五行数据
      const wuxingData = JSON.parse(localStorage.getItem('userWuxingData') || '{}')
      
      let apiEndpoint = ''
      let requestBody = {
        wuxingCounts: wuxingData.wuxingCounts,
        userName: formData.name,
        gender: wuxingData.gender,
        eightChar: wuxingData.eightChar,
        serviceType: selectedService
      }

      switch (selectedService) {
        case 'generate':
          apiEndpoint = '/api/generateEnergyImage'
          break
        case 'upload':
          apiEndpoint = '/api/modifyImageEnergy'
          requestBody.uploadedImage = uploadedImage
          break
        case 'animation':
          apiEndpoint = '/api/generateEnergyAnimation'
          break
        case 'blessing':
          apiEndpoint = '/api/digitalBlessing'
          break
        default:
          throw new Error('未选择服务类型')
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      
      if (result.success) {
        setGeneratedContent(result.data)
        alert('🎉 服务生成成功！')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('服务生成错误：', error)
      alert('❌ 服务生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Head>
        <title>五行能量服务 - 免费体验</title>
        <meta name="description" content="体验多种五行能量服务" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🌟 五行能量服务中心</h1>
          <p className="text-xl text-gray-600">选择您需要的五行能量服务，开启能量平衡之旅</p>
        </div>

        {/* 服务选项卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {serviceOptions.map((service) => (
            <div
              key={service.id}
              className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedService === service.id ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-blue-100 mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-300 mr-2">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                    {service.price}
                  </span>
                </div>
              </div>
              {selectedService === service.id && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white rounded-full p-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 服务配置区域 */}
        {selectedService && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4">🔧 服务配置</h3>
            
            {/* 基础信息表单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的邮箱"
                />
              </div>
            </div>

            {/* 图片上传区域（仅上传修改服务显示） */}
            {selectedService === 'upload' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="上传的图片" className="max-w-xs mx-auto rounded-lg" />
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">点击上传图片</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={generateService}
              disabled={loading || !formData.name}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? '🎨 生成中...' : '🚀 开始生成服务'}
            </button>
          </div>
        )}

        {/* 生成结果展示 */}
        {generatedContent && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">✨ 生成结果</h3>
            
            {selectedService === 'generate' && (
              <div className="text-center">
                <img 
                  src={generatedContent.imageUrl} 
                  alt="五行平衡能量图" 
                  className="max-w-full mx-auto rounded-lg shadow-lg mb-4"
                />
                <div className="space-x-4">
                  <a 
                    href={generatedContent.imageUrl} 
                    download={generatedContent.filename}
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    📥 下载图片
                  </a>
                  <button
                    onClick={() => navigator.share && navigator.share({
                      title: '我的五行平衡能量图',
                      url: generatedContent.imageUrl
                    })}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    📤 分享图片
                  </button>
                </div>
              </div>
            )}

            {selectedService === 'upload' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">原始图片</h4>
                  <img src={uploadedImage} alt="原始图片" className="w-full rounded-lg" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">五行调整后</h4>
                  <img src={generatedContent.modifiedImageUrl} alt="调整后图片" className="w-full rounded-lg" />
                </div>
              </div>
            )}

            {selectedService === 'animation' && (
              <div className="text-center">
                <img 
                  src={generatedContent.animationUrl} 
                  alt="五行能量动图" 
                  className="max-w-full mx-auto rounded-lg shadow-lg"
                />
                <p className="mt-4 text-gray-600">动态五行能量流转图已生成</p>
              </div>
            )}

            {selectedService === 'blessing' && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-yellow-100 to-red-100 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-red-800 mb-2">🙏 开光仪式完成</h4>
                  <p className="text-red-700">您的五行能量图已完成数字开光加持</p>
                </div>
                <img 
                  src={generatedContent.blessedImageUrl} 
                  alt="开光后的五行图" 
                  className="max-w-full mx-auto rounded-lg shadow-lg"
                />
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>开光时间：</strong>{generatedContent.blessingTime}<br/>
                    <strong>开光编号：</strong>{generatedContent.blessingId}<br/>
                    <strong>能量等级：</strong>{generatedContent.energyLevel}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: 'basic'
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const packages = {
    basic: { name: '基础报告', price: 99, features: ['详细八字分析', '五行平衡建议', '运势预测'] },
    premium: { name: '高级报告', price: 199, features: ['基础报告全部内容', '姓名五行分析', '个性化调理方案', '一年运势详解'] },
    vip: { name: 'VIP报告', price: 399, features: ['高级报告全部内容', '专家一对一咨询', '定制化建议', '终身更新服务'] }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // 这里可以集成支付接口
    try {
      // 模拟订单处理
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('订单提交成功！我们将在24小时内发送详细报告到您的邮箱。')
      router.push('/')
    } catch (error) {
      alert('订单提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>订购详细报告 - 八字五行分析系统</title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">订购详细报告</h1>
          <p className="text-gray-600">选择适合您的分析套餐</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(packages).map(([key, pkg]) => (
            <div 
              key={key}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer border-2 transition ${
                formData.package === key ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setFormData({...formData, package: key})}
            >
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">¥{pkg.price}</div>
              <ul className="space-y-2">
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">填写订购信息</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="mb-4">
                <span className="text-lg">总计：</span>
                <span className="text-2xl font-bold text-blue-600">¥{packages[formData.package].price}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                {loading ? '处理中...' : '立即支付'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// 在现有的 order.js 文件中添加以下功能
const [generatedImage, setGeneratedImage] = useState(null)
const [imageLoading, setImageLoading] = useState(false)

// 生成五行平衡图片函数
const generateBalanceImage = async () => {
  try {
    setImageLoading(true)
    
    // 从 localStorage 或 props 获取用户的五行数据
    const wuxingData = JSON.parse(localStorage.getItem('userWuxingData') || '{}')
    
    const response = await fetch('/api/generateEnergyImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wuxingCounts: wuxingData.wuxingCounts,
        userName: formData.name,
        gender: wuxingData.gender,
        eightChar: wuxingData.eightChar
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      setGeneratedImage(result.data)
      alert('🎉 您的专属五行平衡图已生成！')
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('生成图片错误：', error)
    alert('❌ 图片生成失败，请重试')
  } finally {
    setImageLoading(false)
  }
}

// 在 JSX 中添加图片生成区域
{/* 五行平衡图生成区域 */}
<div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
  <h3 className="text-xl font-semibold mb-4">🎨 专属五行平衡能量图</h3>
  <p className="text-gray-600 mb-4">
    基于您的八字分析，生成个性的五行平衡图，帮助您了解需要调理的能量方向
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
        <p className="text-sm text-gray-500">生成时间：{new Date(generatedImage.uploadedAt).toLocaleString('zh-CN')}</p>
        <div className="space-x-4">
          <a 
            href={generatedImage.imageUrl} 
            download={generatedImage.filename}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
          >
            📥 下载图片
          </a>
          <button
            onClick={() => navigator.share && navigator.share({
              title: '我的五行平衡能量图',
              url: generatedImage.imageUrl
            })}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            📤 分享图片
          </a>
        </div>
      </div>
    </div>
  )}
</div>