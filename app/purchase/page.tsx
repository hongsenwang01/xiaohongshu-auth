"use client"

import { useState } from "react"
import { LicenseTypeStep } from "@/components/license-type-step"
import { DurationStep } from "@/components/duration-step"
import { PaymentStep } from "@/components/payment-step"
import { SuccessStep } from "@/components/success-step"
import { OrderSummary } from "@/components/order-summary"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export type LicenseType = "standard" | "premium" | null
export type PaymentMethod = "wechat" | "alipay" | null

export interface OrderData {
  licenseType: LicenseType
  duration: number
  paymentMethod: PaymentMethod
  totalPrice: number
}

export default function PurchasePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState<OrderData>({
    licenseType: null,
    duration: 1,
    paymentMethod: null,
    totalPrice: 0,
  })
  const [authCode, setAuthCode] = useState("")

  const steps = [
    { id: 1, title: "选择授权码类型", component: LicenseTypeStep },
    { id: 2, title: "选择期限", component: DurationStep },
    { id: 3, title: "支付", component: PaymentStep },
    { id: 4, title: "完成", component: SuccessStep },
  ]

  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component || LicenseTypeStep

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateOrderData = (data: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...data }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">小红书授权码管理系统</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentStep === 4 ? (
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <CurrentStepComponent
                  orderData={orderData}
                  updateOrderData={updateOrderData}
                  onNext={handleNext}
                  onBack={handleBack}
                  setAuthCode={setAuthCode}
                  authCode={authCode}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CurrentStepComponent
                    orderData={orderData}
                    updateOrderData={updateOrderData}
                    onNext={handleNext}
                    onBack={handleBack}
                    setAuthCode={setAuthCode}
                    authCode={authCode}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:sticky lg:top-8 lg:self-start"
            >
              <OrderSummary orderData={orderData} currentStep={currentStep} />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
