import { NextRequest, NextResponse } from 'next/server'
import { LICENSE_API } from '@/lib/config'

interface GenerateLicenseRequest {
  licenseType: string
  months: number
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLicenseRequest = await request.json()

    // 验证请求参数
    if (!body.licenseType || !body.months) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 从环境变量获取 token（不暴露在前端）
    const apiToken = process.env.LICENSE_API_TOKEN
    if (!apiToken) {
      console.error('[API] LICENSE_API_TOKEN 未配置')
      return NextResponse.json(
        { success: false, message: '服务器配置错误' },
        { status: 500 }
      )
    }

    // 调用实际的后端接口
    const backendResponse = await fetch(
      LICENSE_API.generateBackend,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': apiToken,
        },
        body: JSON.stringify(body),
      }
    )

    if (!backendResponse.ok) {
      console.error('[API] Backend error:', backendResponse.statusText)
      return NextResponse.json(
        { success: false, message: '生成授权码失败' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    console.log('[API] License generated successfully:', data.licenseCode)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}
