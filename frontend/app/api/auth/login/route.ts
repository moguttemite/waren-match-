import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: 'Login API route is working!' 
  })
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

    // 直接测试 mock 数据加载
    try {
      const mockUsersResponse = await fetch('http://localhost:3000/mock/users.json')
      
      if (mockUsersResponse.ok) {
        const mockData = await mockUsersResponse.json()
        
        // 查找用户
        const user = mockData.users?.find((u: any) => u.email === email)
        
        if (user && password === 'password123') {
          // 生成模拟令牌
          const token = `mock_token_${user.id}`
          
          return NextResponse.json({
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email,
                name: user.fullName,
                avatar: user.avatar,
                nationality: user.nationality,
                isVerified: user.isVerified,
                trustScore: user.trustScore,
              },
              token: token
            },
            message: '登录成功'
          })
        } else {
          return NextResponse.json(
            { 
              success: false, 
              error: '邮箱或密码错误' 
            },
            { status: 401 }
          )
        }
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: '无法加载用户数据' 
          },
          { status: 500 }
        )
      }
    } catch (mockError) {
      console.error('Mock data loading error:', mockError)
      return NextResponse.json(
        { 
          success: false, 
          error: '服务器内部错误' 
        },
        { status: 500 }
      )
    }

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