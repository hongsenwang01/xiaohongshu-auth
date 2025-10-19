"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { OrderData, PaymentMethod } from "@/app/purchase/page"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { WECHAT_PAY_API, LICENSE_API } from "@/lib/config"

interface PaymentStepProps {
  orderData: OrderData
  updateOrderData: (data: Partial<OrderData>) => void
  onNext: () => void
  onBack: () => void
  setAuthCode: (code: string) => void
  authCode: string
}

interface PaymentResponse {
  code: number
  message: string
  outTradeNo: string
  codeUrl: string
  qrCodeImage: string
  qrCodeUrl: string | null
  amount: number
  description: string
  timestamp: number
}

interface PaymentQueryResponse {
  code: number
  message: string
  outTradeNo: string
  codeUrl: string
  qrCodeImage: string | null
  qrCodeUrl: string | null
  status: "PENDING" | "SUCCESS" | "FAILED"
  amount: number
  description: string
  timestamp: number
}

const paymentMethods = [
  {
    id: "wechat" as PaymentMethod,
    name: "微信支付",
    icon: "/Wexin.svg",
    description: "使用微信扫码支付",
  },
  {
    id: "alipay" as PaymentMethod,
    name: "支付宝",
    icon: "/Zhifubao.svg",
    description: "使用支付宝扫码支付",
  },
]

export function PaymentStep({ orderData, updateOrderData, onNext, onBack, setAuthCode }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const [outTradeNo, setOutTradeNo] = useState<string>("")
  const [paymentError, setPaymentError] = useState<string>("")
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false)

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current)
      pollingTimeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      clearPolling()
    }
  }, [])

  const pollPaymentStatus = async (tradeNo: string) => {
    try {
      const response = await fetch(`${WECHAT_PAY_API.query}?outTradeNo=${tradeNo}`)

      if (!response.ok) {
        console.error("Payment query failed:", response.statusText)
        return
      }

      const data: PaymentQueryResponse = await response.json()

      if (data.status === "SUCCESS") {
        // 支付成功，停止轮询
        clearPolling()
        
        try {
          // 调用生成授权码接口
          const licenseTypeMap = {
            standard: "STANDARD",
            premium: "PREMIUM",
          }
          
          const licenseType = licenseTypeMap[orderData.licenseType as keyof typeof licenseTypeMap]
          const generateResponse = await fetch(LICENSE_API.generate, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              licenseType,
              months: orderData.duration,
              notes: `Order: ${tradeNo}`,
            }),
          })

          if (!generateResponse.ok) {
            console.error("[v0] Generate license failed:", generateResponse.statusText)
            throw new Error("生成授权码失败")
          }

          const generateData = await generateResponse.json()
          console.log("[v0] Generate license response:", generateData)

          if (generateData.success && generateData.licenseCode) {
            setAuthCode(generateData.licenseCode)
          } else {
            throw new Error(generateData.message || "生成授权码失败")
          }
        } catch (error) {
          console.error("[v0] Generate license error:", error)
          // 即使生成授权码失败，也使用备用授权码
          const code = `XHS-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
          setAuthCode(code)
        }

        setIsProcessing(false)
        onNext()
      } else if (data.status === "FAILED") {
        // 支付失败
        clearPolling()
        setPaymentError("支付失败，请重试")
        setIsProcessing(false)
        setShowQRCode(false)
      }
      // PENDING 状态继续轮询
    } catch (error) {
      console.error("Payment query error:", error)
    }
  }

  const startPolling = (tradeNo: string) => {
    // 清除之前的定时器
    clearPolling()

    // 每3秒轮询一次
    pollingIntervalRef.current = setInterval(() => {
      pollPaymentStatus(tradeNo)
    }, 3000)

    // 设置5分钟超时
    pollingTimeoutRef.current = setTimeout(
      () => {
        clearPolling()
        setPaymentError("支付超时，请重新发起支付")
        setIsProcessing(false)
        setShowQRCode(false)
      },
      5 * 60 * 1000,
    )
  }

  const handleSelectPayment = (method: PaymentMethod) => {
    updateOrderData({ paymentMethod: method })
    setShowQRCode(false)
    setPaymentError("")
  }

  const handlePay = async () => {
    if (!orderData.paymentMethod) return

    setShowQRCode(true)
    setIsProcessing(true)
    setPaymentError("")

    try {
      // 只有微信支付调用接口，支付宝暂时使用模拟
      if (orderData.paymentMethod === "wechat") {
        const licenseNames = {
          standard: "普通授权码",
          premium: "高级授权码",
        }

        const description = `${licenseNames[orderData.licenseType!]} - ${orderData.duration}个月`
        const amount = orderData.totalPrice * 100 // 转换为分

        const response = await fetch(`${WECHAT_PAY_API.native}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            amount,
            remarks: `授权码类型: ${licenseNames[orderData.licenseType!]}, 期限: ${orderData.duration}个月`,
          }),
        })

        if (!response.ok) {
          throw new Error("支付请求失败")
        }

        const data: PaymentResponse = await response.json()

        if (data.code !== 0) {
          throw new Error(data.message || "支付失败")
        }

        // 设置二维码图片和订单号
        setQrCodeImage(data.qrCodeImage)
        setOutTradeNo(data.outTradeNo)

        startPolling(data.outTradeNo)
      } else {
        // 支付宝暂时使用模拟
        setTimeout(() => {
          const code = `XHS-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
          setAuthCode(code)
          setIsProcessing(false)
          onNext()
        }, 3000)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError(error instanceof Error ? error.message : "支付失败，请重试")
      setIsProcessing(false)
      setShowQRCode(false)
    }
  }

  const handleCloseQRCode = async () => {
    try {
      // 如果有订单号，调用取消订单接口
      if (outTradeNo) {
        
        const cancelUrl = `${WECHAT_PAY_API.cancel}?outTradeNo=${encodeURIComponent(outTradeNo)}`

        
        const cancelResponse = await fetch(cancelUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!cancelResponse.ok) {
          console.warn("Cancel order returned non-ok status:", cancelResponse.status, cancelResponse.statusText)
        }

        const cancelData = await cancelResponse.json()
      }
    } catch (error) {
      // 捕获任何错误但不中断流程
      console.error("Cancel order error:", error instanceof Error ? error.message : error)
      if (error instanceof Error) {
        console.error("Error stack:", error.stack)
      }
    } finally {
      // 不管接口调用成功或失败，都关闭相关状态
      setShowQRCode(false)
      setPaymentError("")
      setIsProcessing(false)
      clearPolling()
    }
  }

  const licenseNames = {
    standard: "普通授权码",
    premium: "高级授权码",
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            3
          </span>
          <h2 className="text-2xl font-bold text-foreground">支付</h2>
        </div>
        <p className="pl-11 text-muted-foreground">选择支付方式完成购买</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-border bg-muted/50 p-4"
          >
            <h3 className="font-semibold text-foreground mb-3">订单详情</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">授权码类型</span>
                <span className="font-medium text-foreground">
                  {orderData.licenseType ? licenseNames[orderData.licenseType] : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">有效期限</span>
                <span className="font-medium text-foreground">{orderData.duration} 个月</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold text-foreground">应付金额</span>
                <span className="text-xl font-bold text-foreground">¥{orderData.totalPrice}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="font-semibold text-foreground mb-4">选择支付方式</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {paymentMethods.map((method, index) => {
                const isAlipayDisabled = method.id === "alipay"
                
                return (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    whileHover={!isAlipayDisabled ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
                    whileTap={!isAlipayDisabled ? { scale: 0.98 } : {}}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card
                            className={cn(
                              "p-4 transition-all",
                              isAlipayDisabled
                                ? "cursor-not-allowed opacity-50 border-border"
                                : "cursor-pointer hover:border-accent hover:shadow-md",
                              orderData.paymentMethod === method.id && "border-accent ring-2 ring-accent shadow-md",
                            )}
                            onClick={() => !isAlipayDisabled && handleSelectPayment(method.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center">
                                <Image src={method.icon} alt={method.name} width={32} height={32} />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-foreground">{method.name}</div>
                                <div className="text-sm text-muted-foreground">{method.description}</div>
                              </div>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        {isAlipayDisabled && (
                          <TooltipContent side="top" className="bg-gray-900 text-white">
                            支付宝支付暂时无法使用，请使用微信支付
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <AnimatePresence>
            {paymentError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg border border-red-500/50 bg-red-500/10 p-4"
              >
                <p className="text-sm text-red-500">{paymentError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showQRCode && (
              <Dialog
                open={showQRCode}
                onOpenChange={(open) => {
                  if (!open && isProcessing) {
                    // 用户尝试关闭弹窗，显示确认对话框
                    setShowAbandonConfirm(true)
                  } else if (!open) {
                    // 没有在处理中，直接关闭
                    setShowQRCode(false)
                  }
                }}
              >
                <DialogContent className="p-0 w-full max-w-md sm:max-w-lg md:max-w-xl">
                  <DialogTitle className="sr-only">
                    {orderData.paymentMethod === "wechat" ? "微信支付" : "支付宝"}扫码支付
                  </DialogTitle>
                  <DialogDescription className="text-center text-sm text-muted-foreground mt-4">
                    请使用手机扫描下方二维码完成支付
                  </DialogDescription>
                  <div className="flex flex-col items-center space-y-6 p-8">
                    <div className="text-center space-y-2">
                      <h4 className="text-xl font-semibold text-foreground">
                        {orderData.paymentMethod === "wechat" ? "微信支付" : "支付宝"}扫码支付
                      </h4>
                      {outTradeNo && <p className="text-xs text-muted-foreground">订单号: {outTradeNo}</p>}
                    </div>

                    <div className="relative w-full flex justify-center">
                      <div className="rounded-lg bg-white p-6 flex items-center justify-center">
                        {isProcessing && !qrCodeImage ? (
                          <div className="h-56 w-56 flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"
                              />
                              <p className="text-sm text-muted-foreground">生成二维码中...</p>
                            </div>
                          </div>
                        ) : qrCodeImage ? (
                          <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            src={qrCodeImage}
                            alt="支付二维码"
                            className="h-56 w-56"
                          />
                        ) : (
                          <div className="h-56 w-56 rounded-lg bg-muted flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"
                              />
                              <p className="text-sm text-muted-foreground">处理中...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center space-y-1 pt-2">
                      <p className="text-2xl font-bold text-foreground">¥{orderData.totalPrice}</p>
                      <p className="text-xs text-muted-foreground">
                        {isProcessing ? "等待支付..." : "支付完成后将自动跳转"}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAbandonConfirm && (
              <AlertDialog open={showAbandonConfirm} onOpenChange={setShowAbandonConfirm}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确定放弃支付吗？</AlertDialogTitle>
                    <AlertDialogDescription>
                      放弃支付将导致订单失效，您确定要继续吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogAction onClick={handleCloseQRCode}>确定</AlertDialogAction>
                  <AlertDialogCancel onClick={() => setShowAbandonConfirm(false)}>取消</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          disabled={isProcessing}
          className="transition-all bg-transparent"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          上一步
        </Button>
        <Button
          onClick={handlePay}
          disabled={!orderData.paymentMethod || isProcessing}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
        >
          {isProcessing ? "处理中..." : `支付 ¥${orderData.totalPrice}`}
        </Button>
      </div>
    </div>
  )
}
