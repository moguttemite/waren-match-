// Mock 数据读取工具

// 用户类型定义
export interface MockUser {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  fullName: string
  nationality: 'chinese' | 'japanese' | 'other'
  gender: 'male' | 'female' | 'other'
  birthDate: string
  age: number
  location: string
  targetLocation: string
  bio: string
  avatar?: string
  occupation: string
  education: string
  height: number
  interests: string[]
  languages: string[]
  relationshipGoals: 'casual' | 'serious' | 'marriage'
  isVerified: boolean
  trustScore: number
  verificationStatus: 'pending' | 'verified' | 'rejected'
  lastActive: string
  createdAt: string
  updatedAt: string
  profileCompleted: boolean
  photos: string[]
  preferences: {
    ageRange: {
      min: number
      max: number
    }
    location: string[]
    nationality: string[]
    relationshipGoals: string[]
  }
}

// 认证会话类型
export interface MockSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: string
  createdAt: string
  lastActive: string
  ipAddress: string
  userAgent: string
}

// 验证码类型
export interface MockVerificationCode {
  id: string
  userId: string
  email: string
  code: string
  type: 'email_verification' | 'phone_verification'
  expiresAt: string
  createdAt: string
  used: boolean
}

// 登录尝试类型
export interface MockLoginAttempt {
  id: string
  email: string
  ipAddress: string
  success: boolean
  attemptedAt: string
  userAgent: string
}

// 读取用户数据
export async function getMockUsers(): Promise<MockUser[]> {
  try {
    const response = await fetch('/mock/users.json')
    const data = await response.json()
    return data.users || []
  } catch (error) {
    console.error('Failed to load mock users:', error)
    return []
  }
}

// 读取认证数据
export async function getMockAuthData(): Promise<{
  sessions: MockSession[]
  verificationCodes: MockVerificationCode[]
  loginAttempts: MockLoginAttempt[]
}> {
  try {
    const response = await fetch('/mock/auth.json')
    const data = await response.json()
    return {
      sessions: data.sessions || [],
      verificationCodes: data.verificationCodes || [],
      loginAttempts: data.loginAttempts || [],
    }
  } catch (error) {
    console.error('Failed to load mock auth data:', error)
    return {
      sessions: [],
      verificationCodes: [],
      loginAttempts: [],
    }
  }
}

// 根据邮箱查找用户
export async function findUserByEmail(email: string): Promise<MockUser | null> {
  const users = await getMockUsers()
  return users.find(user => user.email === email) || null
}

// 根据ID查找用户
export async function findUserById(id: string): Promise<MockUser | null> {
  const users = await getMockUsers()
  return users.find(user => user.id === id) || null
}

// 验证用户凭据
export async function validateUserCredentials(email: string, password: string): Promise<MockUser | null> {
  const user = await findUserByEmail(email)
  
  // 在真实环境中，这里会验证密码哈希
  // 在 mock 环境中，我们使用简单的密码验证
  if (user) {
    // 模拟密码验证（实际应该是 bcrypt 比较）
    const mockPassword = 'password123' // 所有用户的默认密码
    if (password === mockPassword) {
      return user
    }
  }
  
  return null
}

// 创建新用户
export async function createMockUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt' | 'lastActive' | 'trustScore' | 'isVerified' | 'verificationStatus' | 'profileCompleted'>): Promise<MockUser> {
  const users = await getMockUsers()
  const newId = (users.length + 1).toString()
  const now = new Date().toISOString()
  
  const newUser: MockUser = {
    ...userData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    lastActive: now,
    trustScore: 50, // 新用户默认信任分数
    isVerified: false,
    verificationStatus: 'pending',
    profileCompleted: false,
  }
  
  return newUser
}

// 更新用户信息
export async function updateMockUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
  const users = await getMockUsers()
  const userIndex = users.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return null
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  return updatedUser
}

// 生成模拟 JWT 令牌
export function generateMockToken(userId: string): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24小时过期
  }
  
  // 简单的 base64 编码（实际应该是真正的 JWT）
  const headerB64 = btoa(JSON.stringify(header))
  const payloadB64 = btoa(JSON.stringify(payload))
  
  return `${headerB64}.${payloadB64}.mock_signature_${userId}`
}

// 验证模拟令牌
export function verifyMockToken(token: string): { userId: string; valid: boolean } {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { userId: '', valid: false }
    }
    
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    
    if (payload.exp < now) {
      return { userId: '', valid: false }
    }
    
    return { userId: payload.userId, valid: true }
  } catch (error) {
    return { userId: '', valid: false }
  }
} 