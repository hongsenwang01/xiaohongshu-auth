"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface PurchaseRecord {
  id: string
  accountNumber: string
  licenseType: "standard" | "premium"
  timeAgo: string
}

// 模拟购买记录数据
const generateMockRecords = (): PurchaseRecord[] => {
  const records: PurchaseRecord[] = []
  const timeOptions = ["1分钟前", "3分钟前", "5分钟前", "8分钟前", "12分钟前", "15分钟前", "20分钟前", "25分钟前"]

  for (let i = 0; i < 20; i++) {
    const accountPrefix = Math.floor(Math.random() * 90 + 10)
    const accountSuffix = Math.floor(Math.random() * 900 + 100)
    records.push({
      id: `record-${i}`,
      accountNumber: `${accountPrefix}******${accountSuffix}`,
      licenseType: Math.random() > 0.5 ? "premium" : "standard",
      timeAgo: timeOptions[Math.floor(Math.random() * timeOptions.length)],
    })
  }
  return records
}

export function PurchaseRecords() {
  const [records] = useState<PurchaseRecord[]>(generateMockRecords())
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            // 元素进入视口，逐渐显示
            target.style.opacity = "1"
          } else {
            // 元素离开视口，逐渐隐藏
            target.style.opacity = "0"
          }
        })
      },
      {
        root: container,
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: "-20px 0px -20px 0px",
      },
    )

    const items = container.querySelectorAll(".record-item")
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[300px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={cn("flex flex-col gap-4 py-4", !isPaused && "animate-scroll")}>
        {/* 渲染两次记录以实现无缝滚动 */}
        {[...records, ...records].map((record, index) => (
          <div
            key={`${record.id}-${index}`}
            className="record-item flex items-center justify-between px-6 transition-opacity duration-500"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <span className="text-xs font-medium text-accent-foreground/80">
                  {record.licenseType === "premium" ? "高" : "普"}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-foreground/90">
                  小红书号 <span className="font-mono">{record.accountNumber}</span>
                </p>
                <p className="text-xs text-muted-foreground/60">
                  成功购买{record.licenseType === "premium" ? "高级" : "普通"}授权码
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground/50">{record.timeAgo}</span>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background via-background/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  )
}
