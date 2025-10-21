"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// 动态导入 PurchaseRecords 组件，禁用 SSR 以避免 hydration 错误
const PurchaseRecords = dynamic(() => import("@/components/purchase-records").then(mod => ({ default: mod.PurchaseRecords })), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-foreground">小红书助手插件授权码管理</h1>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[300px_1fr_300px] lg:gap-8">
              {/* 左侧特性 */}
              <div className="hidden space-y-8 lg:block">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 opacity-90">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">安全可靠</p>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">银行级加密技术</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 opacity-70">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">灵活管理</p>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">多账号轻松绑定</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 中间主要内容 */}
              <div className="space-y-12 text-center">
                {/* Hero Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-bold tracking-tight text-foreground text-balance lg:text-6xl">
                      专业的小红书
                      <br />
                      授权码服务
                    </h2>
                    <p className="text-lg text-muted-foreground/80">安全可靠 · 即时生效 · 多账号管理</p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/download">
                      <Button size="lg" variant="outline" className="group gap-2 text-base bg-transparent">
                        获取小红书插件
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/purchase">
                      <Button size="lg" className="group gap-2 text-base">
                        立即获取授权码
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Purchase Records Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-border/50" />
                    <p className="text-sm text-muted-foreground/60">实时购买动态</p>
                    <div className="h-px w-12 bg-border/50" />
                  </div>

                  <PurchaseRecords />
                </div>
              </div>

              {/* 右侧特性 */}
              <div className="hidden space-y-8 lg:block">
                <div className="space-y-3 opacity-70">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">专业服务</p>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">7×24小时客户支持</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 opacity-90">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">价格实惠</p>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">多种套餐可选</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground/50">
          © 2025 小红书助手插件授权码管理
        </div>
      </footer>
    </div>
  )
}
