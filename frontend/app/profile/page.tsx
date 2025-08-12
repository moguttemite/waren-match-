'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserAvatar from '../../components/UserAvatar'
import Navigation from '../../components/Navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { t } from '../../lib/translations'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera,
  Heart,
  Shield,
  Star
} from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { language } = useLanguage()
  const router = useRouter()

  // 编辑表单数据
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    birthDate: '',
    nationality: '',
    gender: '',
    bio: ''
  })

  // 检查用户是否已经登录
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setEditForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        birthDate: userData.birthDate || '',
        nationality: userData.nationality || '',
        gender: userData.gender || '',
        bio: userData.bio || ''
      })
      setIsCheckingAuth(false)
    } else {
      // 用户未登录，跳转到登录页面
      router.push('/login')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新本地存储的用户信息
      const updatedUser = { ...user, ...editForm }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      setIsEditing(false)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // 重置表单数据
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      birthDate: user?.birthDate || '',
      nationality: user?.nationality || '',
      gender: user?.gender || '',
      bio: user?.bio || ''
    })
    setIsEditing(false)
  }

  // 如果正在检查认证状态，显示加载页面
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <Navigation isAuthenticated={true} user={user} />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                         <div className="flex items-center justify-between mb-6">
               <h1 className="text-3xl font-bold text-gray-900">{t(language, 'profile.title')}</h1>
               {!isEditing ? (
                 <button
                   onClick={() => setIsEditing(true)}
                   className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                 >
                   <Edit className="w-4 h-4" />
                   <span>{t(language, 'profile.editProfile')}</span>
                 </button>
               ) : (
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={handleCancel}
                     className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                   >
                     <X className="w-4 h-4" />
                     <span>{t(language, 'profile.cancel')}</span>
                   </button>
                   <button
                     onClick={handleSave}
                     disabled={isLoading}
                     className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                   >
                     <Save className="w-4 h-4" />
                     <span>{isLoading ? t(language, 'profile.saving') : t(language, 'profile.save')}</span>
                   </button>
                 </div>
               )}
            </div>

            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <UserAvatar user={user} size={120} />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    user.name
                  )}
                </h2>
                <p className="text-gray-600 mb-2">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    user.email
                  )}
                </p>
                                 <div className="flex items-center space-x-4">
                   {user.isVerified && (
                     <span className="flex items-center space-x-1 text-green-600">
                       <Shield className="w-4 h-4" />
                       <span className="text-sm">{t(language, 'profile.verified')}</span>
                     </span>
                   )}
                   <span className="flex items-center space-x-1 text-yellow-600">
                     <Star className="w-4 h-4" />
                     <span className="text-sm">{t(language, 'profile.trustScore')}: {user.trustScore || 0}</span>
                   </span>
                 </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-8">
                         {/* Basic Information */}
             <div className="bg-white rounded-2xl shadow-lg p-6">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">{t(language, 'profile.basicInfo')}</h3>
               <div className="space-y-4">
                 <div className="flex items-center space-x-3">
                   <User className="w-5 h-5 text-gray-400" />
                   <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700">{t(language, 'profile.name')}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>
                </div>

                                 <div className="flex items-center space-x-3">
                   <Mail className="w-5 h-5 text-gray-400" />
                   <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700">{t(language, 'profile.email')}</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.email}</p>
                    )}
                  </div>
                </div>

                                 <div className="flex items-center space-x-3">
                   <Phone className="w-5 h-5 text-gray-400" />
                   <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700">{t(language, 'profile.phone')}</label>
                     {isEditing ? (
                       <input
                         type="tel"
                         value={editForm.phone}
                         onChange={(e) => handleInputChange('phone', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                       />
                     ) : (
                       <p className="text-gray-900">{user.phone || t(language, 'profile.notSet')}</p>
                     )}
                   </div>
                 </div>

                 <div className="flex items-center space-x-3">
                   <MapPin className="w-5 h-5 text-gray-400" />
                   <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700">{t(language, 'profile.location')}</label>
                     {isEditing ? (
                       <input
                         type="text"
                         value={editForm.location}
                         onChange={(e) => handleInputChange('location', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                       />
                     ) : (
                       <p className="text-gray-900">{user.location || t(language, 'profile.notSet')}</p>
                     )}
                   </div>
                 </div>

                 <div className="flex items-center space-x-3">
                   <Calendar className="w-5 h-5 text-gray-400" />
                   <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700">{t(language, 'profile.birthDate')}</label>
                     {isEditing ? (
                       <input
                         type="date"
                         value={editForm.birthDate}
                         onChange={(e) => handleInputChange('birthDate', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                       />
                     ) : (
                       <p className="text-gray-900">{user.birthDate || t(language, 'profile.notSet')}</p>
                     )}
                   </div>
                 </div>
              </div>
            </div>

                         {/* Additional Information */}
             <div className="bg-white rounded-2xl shadow-lg p-6">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">{t(language, 'profile.additionalInfo')}</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">{t(language, 'profile.nationality')}</label>
                  {isEditing ? (
                    <select
                      value={editForm.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="chinese">中国</option>
                      <option value="japanese">日本</option>
                      <option value="other">其他</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {user.nationality === 'chinese' ? '中国' : 
                       user.nationality === 'japanese' ? '日本' : 
                       user.nationality || '未设置'}
                    </p>
                  )}
                </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">{t(language, 'profile.gender')}</label>
                   {isEditing ? (
                     <select
                       value={editForm.gender}
                       onChange={(e) => handleInputChange('gender', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                     >
                       <option value="male">{t(language, 'register.genderMale')}</option>
                       <option value="female">{t(language, 'register.genderFemale')}</option>
                       <option value="other">{t(language, 'register.genderOther')}</option>
                     </select>
                   ) : (
                     <p className="text-gray-900">
                       {user.gender === 'male' ? t(language, 'register.genderMale') : 
                        user.gender === 'female' ? t(language, 'register.genderFemale') : 
                        user.gender || t(language, 'profile.notSet')}
                     </p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">{t(language, 'profile.bio')}</label>
                   {isEditing ? (
                     <textarea
                       value={editForm.bio}
                       onChange={(e) => handleInputChange('bio', e.target.value)}
                       rows={4}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                       placeholder={t(language, 'profile.bioPlaceholder')}
                     />
                   ) : (
                     <p className="text-gray-900">{user.bio || t(language, 'profile.noBio')}</p>
                   )}
                 </div>
              </div>
            </div>
          </div>

                     {/* Account Statistics */}
           <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">{t(language, 'profile.accountStats')}</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="text-center p-4 bg-pink-50 rounded-lg">
                 <div className="text-2xl font-bold text-pink-600 mb-1">12</div>
                 <div className="text-sm text-gray-600">{t(language, 'profile.matchedUsers')}</div>
               </div>
               <div className="text-center p-4 bg-blue-50 rounded-lg">
                 <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                 <div className="text-sm text-gray-600">{t(language, 'profile.chatSessions')}</div>
               </div>
               <div className="text-center p-4 bg-green-50 rounded-lg">
                 <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                 <div className="text-sm text-gray-600">{t(language, 'profile.attendedEvents')}</div>
               </div>
               <div className="text-center p-4 bg-purple-50 rounded-lg">
                 <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                 <div className="text-sm text-gray-600">{t(language, 'profile.profileCompleteness')}</div>
               </div>
             </div>
           </div>
        </div>
      </main>
    </div>
  )
}
