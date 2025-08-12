import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== 简单测试API被调用 ===')
  console.log('请求URL:', request.url)
  
  return NextResponse.json({
    success: true,
    message: '简单测试API工作正常',
    timestamp: new Date().toISOString()
  })
}
