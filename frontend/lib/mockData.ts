// Mock 数据管理系统
// 用于在后端未准备好时模拟数据库表

import { User } from '../types'

// 从 auth_users.json 加载认证用户数据
export async function loadAuthUsers() {
  try {
    // 首先尝试从 localStorage 读取
    const storedAuthUsers = localStorage.getItem('mock_auth_users')
    if (storedAuthUsers) {
      const parsed = JSON.parse(storedAuthUsers)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('从 localStorage 加载认证用户数据:', parsed.length, '个用户')
        return parsed
      }
    }
    
    // 如果 localStorage 没有数据，从文件加载
    const response = await fetch('/mock/auth_users.json')
    if (response.ok) {
      const data = await response.json()
      console.log('从文件加载认证用户数据:', data.length, '个用户')
      return data
    }
    throw new Error('Failed to load auth users')
  } catch (error) {
    console.error('Error loading auth users:', error)
    return []
  }
}

// 从 users.json 加载用户资料数据
export async function loadUsers() {
  try {
    // 首先尝试从 localStorage 读取
    const storedUsers = localStorage.getItem('mock_users')
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('从 localStorage 加载用户资料数据:', parsed.length, '个用户')
        return parsed
      }
    }
    
    // 如果 localStorage 没有数据，从文件加载
    const response = await fetch('/mock/users.json')
    if (response.ok) {
      const data = await response.json()
      const users = data.users || []
      console.log('从文件加载用户资料数据:', users.length, '个用户')
      return users
    }
    throw new Error('Failed to load users')
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

// 根据邮箱查找认证用户
export async function findAuthUserByEmail(email: string) {
  await initializeMockData()
  
  // 首先从内存存储中查找
  const memoryUser = mockAuthUsers.find((user: any) => user.email === email)
  if (memoryUser) {
    console.log('从内存存储中找到用户:', email)
    return memoryUser
  }
  
  // 如果内存中没有，从文件加载并查找
  const authUsers = await loadAuthUsers()
  const fileUser = authUsers.find((user: any) => user.email === email)
  if (fileUser) {
    console.log('从文件存储中找到用户:', email)
    return fileUser
  }
  
  console.log('未找到用户:', email)
  return null
}

// 根据邮箱查找用户资料
export async function findUserByEmail(email: string) {
  const users = await loadUsers()
  return users.find((user: any) => user.email === email)
}

// 根据 ID 查找认证用户
export async function findAuthUserById(id: string) {
  const authUsers = await loadAuthUsers()
  return authUsers.find((user: any) => user.id === id)
}

// 根据 ID 查找用户资料
export async function findUserById(id: string) {
  const users = await loadUsers()
  return users.find((user: any) => user.email === id)
}

// 验证用户密码（模拟）
export function verifyPassword(password: string, storedHash: string): boolean {
  // 在实际环境中，这里应该使用 bcrypt 或其他加密库
  // 目前为了测试，我们使用简单的密码验证
  const testPasswords = {
    'password123': '$2b$12$abcdefghijklmnopqrstuv1234567890abcdEfghijklmn',
    'test123': '$2b$12$bcdefghijklmnopqrstuv1234567890abcdEfghijklmn',
    'admin123': '$2b$12$efghijklmnopqrstuv1234567890abcdEfghijklmn'
  }
  
  return testPasswords[password as keyof typeof testPasswords] === storedHash
}

// 合并认证用户和用户资料数据
export async function getFullUserData(email: string) {
  const authUser = await findAuthUserByEmail(email)
  const userProfile = await findUserByEmail(email)
  
  if (!authUser) {
    return null
  }
  
  // 合并数据，优先使用用户资料数据
  return {
    // 认证相关字段
    id: authUser.id,
    public_no: authUser.public_no,
    email: authUser.email,
    phone: authUser.phone,
    status: authUser.status,
    role: authUser.role,
    email_verified_at: authUser.email_verified_at,
    phone_verified_at: authUser.phone_verified_at,
    token_version: authUser.token_version,
    last_sign_in_at: authUser.last_sign_in_at,
    created_at: authUser.created_at,
    updated_at: authUser.updated_at,
    
    // 用户资料字段（如果有的话）
    ...userProfile,
    
    // 确保关键字段存在
    name: userProfile?.fullName || userProfile?.name || 'Unknown User',
    avatar: userProfile?.avatar,
    nationality: userProfile?.nationality || 'other',
    isVerified: authUser.email_verified_at !== null,
    trustScore: userProfile?.trustScore || 0
  }
}

// 获取所有活跃用户
export async function getActiveUsers() {
  const authUsers = await loadAuthUsers()
  const users = await loadUsers()
  
  return authUsers
    .filter((authUser: any) => authUser.status === 'active')
    .map((authUser: any) => {
      const userProfile = users.find((user: any) => user.email === authUser.email)
      return {
        ...authUser,
        ...userProfile,
        name: userProfile?.fullName || userProfile?.name || 'Unknown User',
        isVerified: authUser.email_verified_at !== null
      }
    })
}

// 内存存储，用于模拟数据库
let mockAuthUsers: any[] = []
let mockUsers: any[] = []

// 初始化内存数据
async function initializeMockData() {
  if (mockAuthUsers.length === 0) {
    const authUsers = await loadAuthUsers()
    mockAuthUsers = [...authUsers] // 确保是数组的副本
    console.log('初始化内存认证用户数据:', mockAuthUsers.length, '个用户')
  }
  if (mockUsers.length === 0) {
    const users = await loadUsers()
    mockUsers = [...users] // 确保是数组的副本
    console.log('初始化内存用户资料数据:', mockUsers.length, '个用户')
  }
}

// 模拟创建新用户并添加到mock数据
export async function createMockUser(userData: {
  email: string
  password: string
}) {
  await initializeMockData()
  
  // 生成新的 ID 和 public_no
  const newId = `new-user-${Date.now()}`
  const newPublicNo = Math.max(...mockAuthUsers.map((u: any) => u.public_no)) + 1
  
  // 创建认证用户记录
  const newAuthUser = {
    id: newId,
    public_no: newPublicNo,
    email: userData.email,
    phone: null,
    password_hash: `$2b$12$newhash${Date.now()}`,
    status: 'active',
    role: 'user',
    email_verified_at: null,
    phone_verified_at: null,
    token_version: 0,
    last_password_change_at: new Date().toISOString(),
    last_sign_in_at: null,
    created_ip: '127.0.0.1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // 创建用户资料记录
  const newUserProfile = {
    id: newId,
    email: userData.email,
    fullName: '新用户',
    nationality: 'other',
    isVerified: false,
    trustScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // 添加到内存存储
  mockAuthUsers.push(newAuthUser)
  mockUsers.push(newUserProfile)
  
  // 保存到 localStorage 作为持久化存储
  try {
    localStorage.setItem('mock_auth_users', JSON.stringify(mockAuthUsers))
    localStorage.setItem('mock_users', JSON.stringify(mockUsers))
  } catch (error) {
    console.warn('无法保存到 localStorage:', error)
  }
  
  console.log('Mock: 创建新用户并保存到内存', {
    authUser: newAuthUser,
    userProfile: newUserProfile,
    totalAuthUsers: mockAuthUsers.length,
    totalUsers: mockUsers.length
  })
  
  return {
    authUser: newAuthUser,
    userProfile: newUserProfile,
    success: true
  }
}

// 模拟邮箱验证码发送（为后续功能预留）
export async function sendEmailVerificationCode(email: string): Promise<{ success: boolean; message?: string }> {
  // 模拟发送验证码
  console.log(`Mock: 向 ${email} 发送验证码`)
  
  // 在实际环境中，这里会调用邮件服务
  return {
    success: true,
    message: '验证码已发送到您的邮箱'
  }
}

// 模拟验证邮箱验证码
export async function verifyEmailCode(email: string, code: string): Promise<{ success: boolean; message?: string }> {
  // 模拟验证码验证
  console.log(`Mock: 验证邮箱 ${email} 的验证码 ${code}`)
  
  // 在实际环境中，这里会验证验证码
  if (code === '123456') { // 模拟验证码
    return {
      success: true,
      message: '邮箱验证成功'
    }
  }
  
  return {
    success: false,
    message: '验证码错误'
  }
}

// 获取所有mock用户数据（用于调试）
export async function getAllMockUsers() {
  // 确保数据已初始化
  await initializeMockData()
  
  console.log('=== Mock 用户数据 ===')
  console.log('内存中的认证用户:', mockAuthUsers)
  console.log('内存中的用户资料:', mockUsers)
  console.log('localStorage 中的认证用户:', localStorage.getItem('mock_auth_users'))
  console.log('localStorage 中的用户资料:', localStorage.getItem('mock_users'))
  return {
    authUsers: mockAuthUsers,
    users: mockUsers,
    localStorage: {
      authUsers: localStorage.getItem('mock_auth_users'),
      users: localStorage.getItem('mock_users')
    }
  }
}

// 清除所有mock数据（用于测试）
export function clearMockData() {
  mockAuthUsers = []
  mockUsers = []
  localStorage.removeItem('mock_auth_users')
  localStorage.removeItem('mock_users')
  console.log('已清除所有mock数据')
}

 