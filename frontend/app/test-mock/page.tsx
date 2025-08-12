'use client'

import { useState } from 'react'
import { getAllMockUsers, clearMockData } from '../../lib/mockData'

export default function TestMockPage() {
  const [mockData, setMockData] = useState<any>(null)

  const handleViewMockData = async () => {
    const data = await getAllMockUsers()
    setMockData(data)
  }

  const handleClearMockData = () => {
    clearMockData()
    setMockData(null)
    alert('已清除所有mock数据')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mock 数据测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="space-x-4">
            <button
              onClick={handleViewMockData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              查看 Mock 数据
            </button>
            <button
              onClick={handleClearMockData}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              清除 Mock 数据
            </button>
          </div>
        </div>

        {mockData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mock 数据</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">内存中的认证用户 ({mockData.authUsers.length})</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(mockData.authUsers, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">内存中的用户资料 ({mockData.users.length})</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(mockData.users, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">localStorage 数据</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">认证用户</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-48">
                    {mockData.localStorage.authUsers || 'null'}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">用户资料</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-48">
                    {mockData.localStorage.users || 'null'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
