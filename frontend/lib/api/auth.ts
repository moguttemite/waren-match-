// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// 通用请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 确保 endpoint 以斜杠开头
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${normalizedEndpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 登录请求参数类型
export interface LoginRequest {
  email: string
  password: string
}

// 登录响应类型
export interface LoginResponse {
  success: boolean
  data?: {
    user: {
      id: string
      email: string
      name: string
      avatar?: string
      nationality: 'chinese' | 'japanese' | 'other'
      isVerified: boolean
      trustScore: number
    }
    token: string
  }
  message?: string
  error?: string
}

// 注册请求参数类型
export interface RegisterRequest {
  email: string
  password: string
  name: string
  nationality: 'chinese' | 'japanese' | 'other'
  gender: 'male' | 'female' | 'other'
  birthDate: string
  location: string
}

// 注册响应类型
export interface RegisterResponse {
  success: boolean
  data?: {
    user: {
      id: string
      email: string
      name: string
      nationality: 'chinese' | 'japanese' | 'other'
      isVerified: boolean
      trustScore: number
    }
    token: string
  }
  message?: string
  error?: string
}

// 登录 API
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

// 注册 API
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

// 登出 API
export async function logout(): Promise<{ success: boolean; message?: string }> {
  return apiRequest<{ success: boolean; message?: string }>('/auth/logout', {
    method: 'POST',
  })
}

// 刷新令牌 API
export async function refreshToken(): Promise<{ success: boolean; token?: string }> {
  return apiRequest<{ success: boolean; token?: string }>('/auth/refresh', {
    method: 'POST',
  })
}

// 验证令牌 API
export async function verifyToken(token: string): Promise<{ success: boolean; user?: any }> {
  return apiRequest<{ success: boolean; user?: any }>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })
} 