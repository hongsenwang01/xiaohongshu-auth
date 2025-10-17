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

const durations = [1, 3, 6, 12]

const licensePrices = {
  standard: 15,
  premium: 25,
}

// 计算折扣系数
const getDiscountRate = (months: number): number => {
  if (months === 6) return 0.95 // 6个月95折
  if (months === 12) return 0.9 // 12个月9折
  return 1.0 // 无折扣
}

export function DurationStep({ orderData, updateOrderData, onNext, onBack }: DurationStepProps) {
  const handleSelectDuration = (months: number) => {
    const basePrice = orderData.licenseType ? licensePrices[orderData.licenseType] : 0
    const discountRate = getDiscountRate(months)
    const totalPrice = Number.parseFloat((basePrice * months * discountRate).toFixed(2))
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

  const basePrice = orderData.licenseType ? licensePrices[orderData.licenseType] : 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            2
          </span>
          <h2 className="text-2xl font-bold text-foreground">选择授权码期限</h2>
        </div>
        <p className="pl-11 text-muted-foreground">选择授权码的有效期限，最长可选择12个月</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {durations.map((months, index) => {
              const discountRate = getDiscountRate(months)
              const originalPrice = basePrice * months
              const totalPrice = Number.parseFloat((originalPrice * discountRate).toFixed(2))
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
            className="rounded-lg bg-muted p-4"
          >
            <h4 className="font-semibold text-foreground mb-2">价格说明</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 1个月：¥{basePrice.toFixed(2)}（标准价格）</li>
              <li>• 3个月：¥{(basePrice * 3).toFixed(2)}（标准价格）</li>
              <li>• 6个月：¥{(basePrice * 6 * 0.95).toFixed(2)}（95折，省 ¥{(basePrice * 6 * 0.05).toFixed(2)}）</li>
              <li>• 12个月：¥{(basePrice * 12 * 0.9).toFixed(2)}（9折，省 ¥{(basePrice * 12 * 0.1).toFixed(2)}）</li>
            </ul>
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
