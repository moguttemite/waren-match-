'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import UserAvatar from './UserAvatar'
import { 
  Menu, 
  X, 
  Heart, 
  MessageCircle, 
  Calendar, 
  User, 
  Settings,
  Globe,
  LogOut
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../lib/translations'

interface NavigationProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    avatar?: string
  }
}

export default function Navigation({ isAuthenticated = false, user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // 关闭移动端菜单
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 导航项配置
  const navItems = [
    { href: '/', label: t(language, 'navigation.home'), icon: null },
    { href: '/matching', label: t(language, 'navigation.matching'), icon: Heart },
    { href: '/chat', label: t(language, 'navigation.chat'), icon: MessageCircle },
    { href: '/events', label: t(language, 'navigation.events'), icon: Calendar },
  ]

  // 退出登录处理函数
  const handleLogout = () => {
    // 清除本地存储的用户信息和令牌
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // 关闭用户菜单
    setIsUserMenuOpen(false)
    
    // 跳转到主页
    router.push('/')
  }

  // 用户菜单项
  const userMenuItems: Array<{
    href: string
    label: string
    icon: any
    onClick?: () => void
  }> = [
    { href: '/profile', label: t(language, 'navigation.profile'), icon: User },
    { href: '/settings', label: t(language, 'navigation.settings'), icon: Settings },
    { href: '/logout', label: t(language, 'navigation.logout'), icon: LogOut, onClick: handleLogout },
  ]

  // 语言选项
  const languages = [
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ]

  // 检查当前路径是否激活
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // 切换语言菜单
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen)
    setIsUserMenuOpen(false) // 关闭用户菜单
  }

  // 切换用户菜单
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
    setIsLanguageMenuOpen(false) // 关闭语言菜单
  }

  // 选择语言
  const selectLanguage = (langCode: 'zh' | 'ja' | 'en') => {
    setLanguage(langCode)
    setIsLanguageMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">和恋</span>
              <span className="text-sm text-gray-500">(Waren)</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side - Language, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find(lang => lang.code === language)?.flag}</span>
              </button>
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => selectLanguage(lang.code as 'zh' | 'ja' | 'en')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                                 <button
                   onClick={toggleUserMenu}
                   className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                 >
                   <UserAvatar user={user} size={32} />
                   <span className="hidden sm:block text-sm font-medium text-gray-700">
                     {user?.name || '用户'}
                   </span>
                 </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.href}>
                          {item.onClick ? (
                            <button
                              onClick={() => {
                                item.onClick?.()
                                setIsUserMenuOpen(false)
                              }}
                              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{item.label}</span>
                            </button>
                          ) : (
                            <Link
                              href={item.href}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{item.label}</span>
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  {t(language, 'navigation.login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t(language, 'navigation.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  {t(language, 'navigation.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                >
                  {t(language, 'navigation.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 