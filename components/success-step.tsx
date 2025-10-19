"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Copy, Download, Mail, Users, X } from "lucide-react"
import type { OrderData } from "@/app/purchase/page"
import { motion } from "framer-motion"

interface SuccessStepProps {
  orderData: OrderData
  updateOrderData: (data: Partial<OrderData>) => void
  onNext: () => void
  onBack: () => void
  setAuthCode: (code: string) => void
  authCode: string
}

export function SuccessStep({ orderData, authCode }: SuccessStepProps) {
  const [copied, setCopied] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(authCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = () => {
    const licenseNames = {
      standard: "普通授权码",
      premium: "高级授权码",
    }

    const content = `
小红书授权码购买凭证
===================

授权码: ${authCode}
类型: ${orderData.licenseType ? licenseNames[orderData.licenseType as keyof typeof licenseNames] : "-"}
有效期: ${orderData.duration} 个月
购买日期: ${new Date().toLocaleDateString("zh-CN")}
支付金额: ¥${orderData.totalPrice}

使用说明:
1. 请妥善保管您的授权码
2. 授权码在有效期内可随时激活使用
3. 如有问题请联系客服

感谢您的购买！
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `授权码-${authCode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const licenseNames = {
    standard: "普通授权码",
    premium: "高级授权码",
  }

  const accountLimits = {
    standard: 3,
    premium: 10,
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent"
        >
          <Check className="h-8 w-8 text-accent-foreground" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">购买成功！</h2>
          <p className="text-muted-foreground">您的授权码已生成，请妥善保管</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">您的授权码</label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-border bg-muted px-4 py-3 font-mono text-lg text-foreground">
                  {authCode}
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleCopy} variant="outline" size="lg" className="shrink-0 bg-transparent">
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </motion.div>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-accent mt-2"
                >
                  已复制到剪贴板
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-lg border border-border bg-card p-4 space-y-3"
            >
              <h3 className="font-semibold text-foreground">授权码信息</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">类型</span>
                  <span className="font-medium text-foreground">
                    {orderData.licenseType ? licenseNames[orderData.licenseType as keyof typeof licenseNames] : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">可绑定账号数</span>
                  <span className="font-medium text-foreground">
                    {orderData.licenseType ? accountLimits[orderData.licenseType as keyof typeof accountLimits] : "-"} 个
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">有效期</span>
                  <span className="font-medium text-foreground">{orderData.duration} 个月</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">购买日期</span>
                  <span className="font-medium text-foreground">{new Date().toLocaleDateString("zh-CN")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">支付金额</span>
                  <span className="text-lg font-bold text-foreground">¥{orderData.totalPrice}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg bg-muted p-4"
            >
              <h4 className="font-semibold text-foreground mb-2">使用说明</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 请妥善保管您的授权码，不要泄露给他人</li>
                <li>• 授权码在有效期内可随时在插件中激活使用</li>
                <li>• 激活后即可绑定相应数量的小红书账号</li>
                <li className="flex items-center gap-1">
                  • 如遇到购买问题或使用问题
                  <button
                    onClick={() => setShowQrCode(true)}
                    className="inline-flex items-center gap-1 text-accent hover:underline font-medium transition-all"
                  >
                    <Users className="h-4 w-4" />
                    点击此处加群
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* 群二维码弹窗 */}
            <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    加入客服群
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/Wechat_qunliao.jpg"
                      alt="微信群二维码"
                      width={280}
                      height={280}
                      className="rounded-lg border-2 border-border"
                    />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-foreground">使用微信扫描二维码</p>
                    <p className="text-xs text-muted-foreground">加入客服群获得实时支持</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  下载凭证
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <Mail className="mr-2 h-4 w-4" />
                  发送到邮箱
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex gap-3"
            >
              <Button onClick={() => window.location.reload()} className="w-full" size="lg">
                购买新的授权码
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
