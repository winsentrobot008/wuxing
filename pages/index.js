import { useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleCalculate(event) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    const data = {
      userName: formData.get('userName'),
      birthday: formData.get('birthday'),
      birthtime: formData.get('birthtime'),
      unknownTime: formData.get('unknownTime') === 'on',
      gender: formData.get('gender')
    }

    try {
      const res = await fetch('/api/calculateBazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">八字五行分析系统</h1>

        <form onSubmit={handleCalculate} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-2">姓名</label>
            <input
              type="text"
              name="userName"
              className="w-full p-2 border rounded"
              placeholder="请输入姓名（选填）"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">出生日期</label>
            <input
              type="date"
              name="birthday"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">出生时间</label>
            <input
              type="time"
              name="birthtime"
              className="w-full p-2 border rounded"
              disabled={formData?.get('unknownTime') === 'on'}
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" name="unknownTime" className="mr-2" />
                <span>不知道出生时间</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">性别</label>
            <select name="gender" required className="w-full p-2 border rounded">
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '计算中...' : '开始分析'}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">分析结果</h2>
            {/* 这里添加结果展示的组件 */}
          </div>
        )}
      </main>

      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
    </div>
  )
} 