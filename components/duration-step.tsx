"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import type { OrderData } from "@/app/purchase/page"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface DurationStepProps {
  orderData: OrderData
  updateOrderData: (data: Partial<OrderData>) => void
  onNext: () => void
  onBack: () => void
}

const durations = [1, 3, 6]

// 原价配置
const originalPrices = {
  standard: {
    1: 35,
    3: 105,
    6: 220,
  },
  premium: {
    1: 60,
    3: 180,
    6: 360,
  },
}

// 活动价配置
const currentPrices = {
  standard: {
    1: 29,
    3: 80,
    6: 165,
  },
  premium: {
    1: 50,
    3: 135,
    6: 270,
  },
}

export function DurationStep({ orderData, updateOrderData, onNext, onBack }: DurationStepProps) {
  const handleSelectDuration = (months: number) => {
    if (!orderData.licenseType) return
    const totalPrice = currentPrices[orderData.licenseType][months as keyof typeof currentPrices.standard]
    updateOrderData({
      duration: months,
      totalPrice,
    })
  }

  const handleNext = () => {
    if (orderData.duration > 0) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            2
          </span>
          <h2 className="text-2xl font-bold text-foreground">选择授权码期限</h2>
        </div>
        <p className="pl-11 text-muted-foreground">选择授权码的有效期限，最长可选择6个月</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {durations.map((months, index) => {
              if (!orderData.licenseType) return null
              const originalPrice = originalPrices[orderData.licenseType][months as keyof typeof originalPrices.standard]
              const totalPrice = currentPrices[orderData.licenseType][months as keyof typeof currentPrices.standard]
              const discount = Math.round(((originalPrice - totalPrice) / originalPrice) * 100)

              return (
                <motion.div
                  key={months}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={cn(
                      "relative cursor-pointer p-4 transition-all hover:border-accent hover:shadow-md",
                      orderData.duration === months && "border-accent ring-2 ring-accent shadow-md",
                    )}
                    onClick={() => handleSelectDuration(months)}
                  >
                    {discount > 0 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute -top-2 -right-2"
                      >
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                          {discount}% 优惠
                        </span>
                      </motion.div>
                    )}

                    <div className="space-y-2 text-center">
                      <div className="text-3xl font-bold text-foreground">{months}</div>
                      <div className="text-sm text-muted-foreground">个月</div>
                      <div className="pt-2 border-t border-border">
                        <div className="text-lg font-semibold text-foreground">¥{totalPrice.toFixed(2)}</div>
                        {discount > 0 && (
                          <div className="text-xs text-accent">
                            原价 ¥{originalPrice.toFixed(2)} 省 ¥{(originalPrice - totalPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg bg-accent/10 border border-accent/20 p-4"
          >
            <div className="flex items-start gap-2">
              <div className="text-sm">
                <h4 className="font-semibold text-accent mb-2">优惠信息</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {orderData.licenseType && durations.map((months) => {
                    const originalPrice = originalPrices[orderData.licenseType!][months as keyof typeof originalPrices.standard]
                    const totalPrice = currentPrices[orderData.licenseType!][months as keyof typeof currentPrices.standard]
                    const saved = originalPrice - totalPrice
                    const discount = Math.round((saved / originalPrice) * 100)
                    return (
                      <li key={months}>
                        • {months}个月：¥{totalPrice} <span className="line-through text-xs">¥{originalPrice}</span> ({discount}%折扣，省 ¥{saved})
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">当前选择</div>
                <div className="text-lg font-semibold text-foreground">{orderData.duration} 个月</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">总价</div>
                <motion.div
                  key={orderData.totalPrice}
                  initial={{ scale: 1.2, color: "rgb(var(--accent))" }}
                  animate={{ scale: 1, color: "rgb(var(--foreground))" }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold"
                >
                  ¥{orderData.totalPrice.toFixed(2)}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" size="lg" className="transition-all bg-transparent">
          <ArrowLeft className="mr-2 h-5 w-5" />
          上一步
        </Button>
        <Button
          onClick={handleNext}
          disabled={orderData.duration === 0}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          下一步
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
