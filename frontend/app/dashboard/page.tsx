'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserAvatar from '../../components/UserAvatar'
import Navigation from '../../components/Navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { t } from '../../lib/translations'
import { Heart, MessageCircle, Calendar, User, Settings, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const { language } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      // 如果没有用户信息，跳转到登录页面
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <Navigation isAuthenticated={true} user={user} />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-4">
              <UserAvatar user={user} size={64} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  欢迎回来，{user.name}！
                </h1>
                <p className="text-gray-600">
                  您的信任分数：{user.trustScore} 分
                  {user.isVerified && (
                    <span className="ml-2 text-green-600">✓ 已验证</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">智能匹配</h3>
                  <p className="text-gray-600">找到您的理想伴侣</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">聊天</h3>
                  <p className="text-gray-600">与匹配的用户交流</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">活动</h3>
                  <p className="text-gray-600">参加线下交友活动</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">12</div>
                <div className="text-gray-600">匹配用户</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <div className="text-gray-600">聊天会话</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                <div className="text-gray-600">参加活动</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">资料完整度</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">最近活动</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">新的匹配推荐</p>
                  <p className="text-gray-600 text-sm">田中雪 与您匹配度高达 85%</p>
                </div>
                <span className="text-sm text-gray-500">2小时前</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">新消息</p>
                  <p className="text-gray-600 text-sm">山田浩 给您发送了一条消息</p>
                </div>
                <span className="text-sm text-gray-500">4小时前</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">活动提醒</p>
                  <p className="text-gray-600 text-sm">东京线下交友活动将在明天举行</p>
                </div>
                <span className="text-sm text-gray-500">1天前</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mx-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 