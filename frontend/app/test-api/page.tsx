'use client'

import { useState } from 'react'

export default function TestApiPage() {
  const [result, setResult] = useState<string>('')

  const testApi = async () => {
    try {
      console.log('开始测试API...')
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test-api@example.com',
          password: 'test123'
        })
      })
      
      console.log('API响应状态:', response.status)
      const data = await response.json()
      console.log('API响应数据:', data)
      
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('API测试失败:', error)
      setResult(`错误: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API 测试页面</h1>
        
        <button
          onClick={testApi}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          测试注册API
        </button>
        
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API 响应结果</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
