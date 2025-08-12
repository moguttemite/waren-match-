'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import LoginModal from '../components/LoginModal'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../lib/translations'
import { isMobileDevice } from '../lib/deviceDetection'

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { language } = useLanguage()
  const router = useRouter()

  // 检测设备类型
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  // 检查用户登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // 处理登录按钮点击
  const handleLoginClick = () => {
    if (isMobile) {
      // 移动端打开登录弹窗
      setIsLoginModalOpen(true)
    } else {
      // 桌面端跳转到登录页面
      router.push('/login')
    }
  }

  // 处理登录成功
  const handleLoginSuccess = (userData: any) => {
    setUser(userData)
    // 可以在这里添加登录成功后的逻辑
    
  }

  // 处理注册按钮点击
  const handleRegisterClick = () => {
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <Navigation isAuthenticated={!!user} user={user} />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                {t(language, 'hero.title')}
                <span className="block text-4xl md:text-6xl text-pink-600">{t(language, 'hero.subtitle')}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t(language, 'hero.tagline')}
                <br />
                {t(language, 'hero.tagline2')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleLoginClick}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  {user ? t(language, 'hero.dashboard') : t(language, 'hero.explore')}
                </button>
                {!user && (
                  <button 
                    onClick={handleRegisterClick}
                    className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                  >
                    {t(language, 'hero.learnMore')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t(language, 'features.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t(language, 'features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💕</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(language, 'features.smartMatching.title')}</h3>
                <p className="text-gray-600">
                  {t(language, 'features.smartMatching.description')}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌏</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(language, 'features.languageBridge.title')}</h3>
                <p className="text-gray-600">
                  {t(language, 'features.languageBridge.description')}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(language, 'features.secure.title')}</h3>
                <p className="text-gray-600">
                  {t(language, 'features.secure.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 to-red-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t(language, 'cta.title')}
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              {t(language, 'cta.subtitle')}
            </p>
            <button 
              onClick={handleRegisterClick}
              className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              {t(language, 'cta.register')}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">和恋 (Waren)</h3>
              <p className="text-gray-400">
                {t(language, 'footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">{t(language, 'footer.products')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t(language, 'navigation.matching')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t(language, 'navigation.chat')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t(language, 'navigation.events')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">{t(language, 'footer.support')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t(language, 'footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t(language, 'footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t(language, 'footer.privacy')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">{t(language, 'footer.followUs')}</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">微信</span>
                  <span className="text-xl">💬</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">微博</span>
                  <span className="text-xl">📱</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t(language, 'footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Login Modal for Desktop */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}