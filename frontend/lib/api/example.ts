// 这是一个使用示例，展示如何在组件中使用登录 API

import { login, LoginRequest, LoginResponse } from './auth'

// 在 React 组件中使用登录 API 的示例
export async function handleLogin(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    // 调用登录 API
    const response = await login(credentials)
    
    if (response.success && response.data) {
      // 登录成功，保存用户信息和令牌
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // 可以在这里添加其他成功处理逻辑
      console.log('登录成功:', response.data.user.name)
      
      return response
    } else {
      // 登录失败
      console.error('登录失败:', response.error)
      throw new Error(response.error || '登录失败')
    }
  } catch (error) {
    console.error('登录请求失败:', error)
    throw error
  }
}

// 在组件中的使用示例：
/*
import { useState } from 'react'
import { handleLogin } from '../lib/api/example'

function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await handleLogin({ email, password })
      // 登录成功，跳转到首页或仪表板
      window.location.href = '/dashboard'
    } catch (error) {
      setError(error instanceof Error ? error.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="邮箱"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密码"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
*/ 