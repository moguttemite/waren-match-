import { NextRequest, NextResponse } from 'next/server'
import { findAuthUserByEmail, createMockUser } from '../../../../lib/mockData'

export async function POST(request: NextRequest) {
  try {
    console.log('=== 注册API开始 ===')
    
    // 获取请求体
    const body = await request.json()
    const { email, password } = body
    
    console.log('注册请求数据:', { email, password: '***' })

    // 验证必填字段
    if (!email || !password) {
      console.log('验证失败: 邮箱或密码为空')
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱和密码不能为空' 
        },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱格式不正确' 
        },
        { status: 400 }
      )
    }

    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: '密码长度至少6位' 
        },
        { status: 400 }
      )
    }



    // 检查邮箱是否已存在
    console.log('检查邮箱是否已存在:', email)
    const existingUser = await findAuthUserByEmail(email)
    if (existingUser) {
      console.log('邮箱已存在:', email)
      return NextResponse.json(
        { 
          success: false, 
          error: '该邮箱已被注册' 
        },
        { status: 409 }
      )
    }
    console.log('邮箱可用，开始创建用户')

    // 创建新用户
    console.log('调用 createMockUser...')
    const createResult = await createMockUser({
      email,
      password
    })
    console.log('createMockUser 结果:', createResult)

    if (!createResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '用户创建失败' 
        },
        { status: 500 }
      )
    }

    // 生成模拟令牌
    const token = `mock_token_${createResult.authUser.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: createResult.authUser.id,
          public_no: createResult.authUser.public_no,
          email: createResult.authUser.email,
          phone: createResult.authUser.phone,
          name: createResult.userProfile.fullName,
          nationality: createResult.userProfile.nationality,
          isVerified: false,
          trustScore: 0,
          role: createResult.authUser.role,
          status: createResult.authUser.status
        },
        token: token
      },
      message: '注册成功'
    })

  } catch (error) {
    console.error('Register API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误' 
      },
      { status: 500 }
    )
  }
}
