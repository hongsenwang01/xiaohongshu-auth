"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Check } from "lucide-react"
import type { OrderData, LicenseType } from "@/app/purchase/page"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LicenseTypeStepProps {
  orderData: OrderData
  updateOrderData: (data: Partial<OrderData>) => void
  onNext: () => void
}

const licenseTypes = [
  {
    id: "standard" as LicenseType,
    name: "普通授权码",
    description: "适合个人用户或小型团队使用",
    accounts: 3,
    price: 0.1,
    features: ["同时绑定3个小红书账号", "基础数据分析功能", "邮件客户支持", "每月更新维护"],
  },
  {
    id: "premium" as LicenseType,
    name: "高级授权码",
    description: "适合专业用户或中大型团队",
    accounts: 10,
    price: 0.2,
    features: ["同时绑定10个小红书账号", "高级数据分析与报表", "优先客户支持", "实时更新维护", "专属客户经理"],
    popular: true,
  },
]

export function LicenseTypeStep({ orderData, updateOrderData, onNext }: LicenseTypeStepProps) {
  const handleSelect = (type: LicenseType) => {
    const selectedLicense = licenseTypes.find((l) => l.id === type)
    if (selectedLicense) {
      updateOrderData({
        licenseType: type,
        totalPrice: selectedLicense.price * orderData.duration,
      })
    }
  }

  const handleNext = () => {
    if (orderData.licenseType) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            1
          </span>
          <h2 className="text-2xl font-bold text-foreground">选择授权码类型</h2>
        </div>
        <p className="pl-11 text-muted-foreground">根据您的需求选择合适的授权码套餐</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {licenseTypes.map((license, index) => (
          <motion.div
            key={license.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "relative cursor-pointer p-6 transition-all hover:border-accent hover:shadow-lg",
                orderData.licenseType === license.id && "border-accent ring-2 ring-accent shadow-lg",
              )}
              onClick={() => handleSelect(license.id)}
            >
              {license.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-3 right-6"
                >
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    推荐
                  </span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{license.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{license.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">¥{license.price}</span>
                  <span className="text-muted-foreground">/月</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">支持绑定 {license.accounts} 个账号</p>
                  <ul className="space-y-2">
                    {license.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    variant={orderData.licenseType === license.id ? "default" : "outline"}
                    className="w-full transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(license.id)
                    }}
                  >
                    {orderData.licenseType === license.id ? "已选择" : "选择此套餐"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!orderData.licenseType}
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
