/**
 * 项目配置文件
 * 集中管理 API 地址、常量等
 */

// API 基础地址
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://oyosyatukogk.sealoshzh.site'

// 微信支付相关接口
export const WECHAT_PAY_API = {
  // 生成支付二维码
  native: `${API_BASE_URL}/api/wechat/pay/native`,
  // 查询支付状态
  query: `${API_BASE_URL}/api/wechat/pay/query`,
  // 取消订单
  cancel: `${API_BASE_URL}/api/wechat/pay/cancel`,
}

// 授权码相关接口
export const LICENSE_API = {
  // 生成授权码（前端应调用本地 API 代理）
  generate: '/api/license/generate',
  // 后端实际地址
  generateBackend: `${API_BASE_URL}/api/license/generate`,
}

// 其他配置
export const API_TOKEN = process.env.LICENSE_API_TOKEN || ''
