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