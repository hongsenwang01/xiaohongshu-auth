import { Card } from "@/components/ui/card"
import type { OrderData } from "@/app/purchase/page"

interface OrderSummaryProps {
  orderData: OrderData
  currentStep: number
}

const licenseNames = {
  standard: "普通授权码",
  premium: "高级授权码",
}

const licensePrices = {
  standard: 29,
  premium: 50,
}

export function OrderSummary({ orderData, currentStep }: OrderSummaryProps) {
  const basePrice = orderData.licenseType ? licensePrices[orderData.licenseType as keyof typeof licensePrices] : 0

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">订单摘要</h3>

      <div className="space-y-4">
        {orderData.licenseType && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">授权码类型</span>
              <span className="font-medium text-foreground">{licenseNames[orderData.licenseType as keyof typeof licenseNames]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">单价</span>
              <span className="font-medium text-foreground">¥{basePrice}/月</span>
            </div>
          </div>
        )}

        {currentStep >= 2 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">期限</span>
            <span className="font-medium text-foreground">{orderData.duration} 个月</span>
          </div>
        )}

        {currentStep >= 3 && orderData.paymentMethod && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">支付方式</span>
            <span className="font-medium text-foreground">
              {orderData.paymentMethod === "wechat" ? "微信支付" : "支付宝"}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">总计</span>
            <span className="text-2xl font-bold text-foreground">¥{orderData.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-accent font-medium bg-accent/10 rounded p-2">
            限时活动价（2个月），之后恢复原价
          </div>
        </div>
      </div>
    </Card>
  )
}
