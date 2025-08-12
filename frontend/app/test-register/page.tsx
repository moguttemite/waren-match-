'use client'

import { useState } from 'react'
import { register } from '../../lib/api/auth'

export default function TestRegisterPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRegister = async () => {
    setLoading(true)
    try {
      const response = await register({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: '测试用户',
        nationality: 'chinese',
        gender: 'male',
        birthDate: '1990-01-01',
        location: '北京'
      })
      
      setResult(response)
      console.log('注册结果:', response)
    } catch (error) {
      console.error('注册错误:', error)
      setResult({ error: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">测试注册功能</h1>
        
        <button
          onClick={testRegister}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '注册中...' : '测试注册'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">注册结果:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
