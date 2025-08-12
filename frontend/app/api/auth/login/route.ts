import { NextRequest, NextResponse } from 'next/server'
async function loadAuthUsers() {
  try {
    const response = await fetch('http://localhost:3000/mock/auth_users.json')
    if (response.ok) {
      return await response.json()
    }
    throw new Error('Failed to load auth users')
  } catch (error) {
    console.error('Error loading auth users:', error)
    return []
  }
}

async function loadUsers() {
  try {
    const response = await fetch('http://localhost:3000/mock/users.json')
    if (response.ok) {
      const data = await response.json()
      return data.users || []
    }
    throw new Error('Failed to load users')
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

async function findAuthUserByEmail(email: string) {
  const authUsers = await loadAuthUsers()
  return authUsers.find((user: any) => user.email === email)
}

async function findUserByEmail(email: string) {
  const users = await loadUsers()
  return users.find((user: any) => user.email === email)
}

function verifyPassword(password: string, storedHash: string): boolean {
  const testPasswords = {
    'password123': '$2b$12$abcdefghijklmnopqrstuv1234567890abcdEfghijklmn',
    'test123': '$2b$12$bcdefghijklmnopqrstuv1234567890abcdEfghijklmn',
    'admin123': '$2b$12$efghijklmnopqrstuv1234567890abcdEfghijklmn'
  }
  
  return testPasswords[password as keyof typeof testPasswords] === storedHash
}



export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json()
    const { email, password } = body

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱和密码不能为空' 
        },
        { status: 400 }
      )
    }

    // 查找认证用户
    const authUser = await findAuthUserByEmail(email)
    
    if (!authUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: '用户不存在' 
        },
        { status: 404 }
      )
    }

    // 检查用户状态
    if (authUser.status !== 'active') {
      return NextResponse.json(
        { 
          success: false, 
          error: '账户已被禁用或待验证' 
        },
        { status: 403 }
      )
    }

    // 验证密码
    if (!verifyPassword(password, authUser.password_hash)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱或密码错误' 
        },
        { status: 401 }
      )
    }

    // 查找用户资料
    const userProfile = await findUserByEmail(email)
    
    // 生成模拟令牌
    const token = `mock_token_${authUser.id}_${Date.now()}`
    
    // 更新最后登录时间（在实际环境中会更新数据库）
    const updatedAuthUser = {
      ...authUser,
      last_sign_in_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authUser.id,
          public_no: authUser.public_no,
          email: authUser.email,
          phone: authUser.phone,
          name: userProfile?.fullName || userProfile?.name || 'Unknown User',
          avatar: userProfile?.avatar,
          nationality: userProfile?.nationality || 'other',
          isVerified: authUser.email_verified_at !== null,
          trustScore: userProfile?.trustScore || 0,
          role: authUser.role,
          status: authUser.status
        },
        token: token,
        authUser: updatedAuthUser
      },
      message: '登录成功'
    })

  } catch (error) {
    console.error('Login API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误' 
      },
      { status: 500 }
    )
  }
} 