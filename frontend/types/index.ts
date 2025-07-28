// 用户相关类型
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  nationality: 'chinese' | 'japanese' | 'other'
  gender: 'male' | 'female' | 'other'
  birthDate: string
  location: string
  bio?: string
  interests: string[]
  isVerified: boolean
  trustScore: number
  createdAt: string
  updatedAt: string
}

// 匹配相关类型
export interface Match {
  id: string
  userId: string
  matchedUserId: string
  matchScore: number
  isMutual: boolean
  createdAt: string
}

// 聊天相关类型
export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'file'
  isTranslated: boolean
  originalLanguage: string
  translatedContent?: string
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

// 活动相关类型
export interface Event {
  id: string
  title: string
  description: string
  type: 'language_exchange' | 'cultural_workshop' | 'dating_event' | 'travel_group' | 'online_chat'
  location: string
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  organizerId: string
  isOnline: boolean
  imageUrl?: string
  createdAt: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 表单数据类型
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  name: string
  nationality: 'chinese' | 'japanese' | 'other'
  gender: 'male' | 'female' | 'other'
  birthDate: string
  location: string
}

// 导航类型
export interface NavItem {
  href: string
  label: string
  icon?: any
}

// 语言类型
export type Language = 'zh' | 'ja' | 'en'

// 组件 Props 类型
export interface NavigationProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    avatar?: string
  }
} 