'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // 清除本地存储的用户信息和令牌
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // 跳转到主页
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在退出登录...</p>
      </div>
    </div>
  )
}
