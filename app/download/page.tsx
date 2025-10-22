"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Chrome, ArrowLeft, FolderArchive, FileText, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"

export default function DownloadPage() {
  const [showQRCode, setShowQRCode] = useState(false)

  const handleDownload = () => {
    // 下载插件文件
    const link = document.createElement('a')
    link.href = '/downloads/chrome-extension.zip'
    link.download = 'chrome-extension.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* 标题区域 */}
              <div className="text-center space-y-4">
                <div className="relative flex items-center justify-center h-20 overflow-hidden">
                  {/* Chrome 文字 - 固定在图标起始位置的左侧，层级较低 */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="absolute left-1/2 text-2xl font-semibold text-muted-foreground"
                    style={{ 
                      transform: 'translateX(-280px)',
                      zIndex: 0
                    }}
                  >
                    Chrome
                  </motion.span>
                  
                  {/* 浏览器图标 - 从左侧滚动到居中，层级较高 */}
                  <motion.div
                    initial={{ x: -200, scale: 0.8 }}
                    animate={{ x: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.2, 
                      type: "spring", 
                      stiffness: 100,
                      damping: 15,
                      duration: 0.8
                    }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent/20"
                    style={{ zIndex: 10 }}
                  >
                    <Chrome className="h-10 w-10 text-accent-foreground" />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                    小红书助手插件
                  </h1>
                  <p className="text-lg text-muted-foreground/80 mt-3">
                    功能强大 · 简单易用 · 安全可靠
                  </p>
                </motion.div>
              </div>

              {/* 下载卡片 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-8">
                  <div className="space-y-6">
                    {/* 文件夹图标和说明 */}
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <FolderArchive className="h-20 w-20 text-muted-foreground/40 mt-1" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-semibold text-base text-foreground mb-2">
                          3 天免费体验
                        </h3>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                          下载并安装插件后，登录小红书账号即可激活。享受 3 天完整功能体验，体验期结束后需
                          <Link href="/purchase" className="text-accent hover:underline mx-1">
                            获取授权码
                          </Link>
                          以继续使用。
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* 下载按钮 */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleDownload}
                          size="lg"
                          className="w-full gap-2 text-base"
                        >
                          <Download className="h-5 w-5" />
                          立即下载
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full gap-2 text-base bg-transparent"
                          onClick={() => {
                            window.open('https://rcnz4g2yws1h.feishu.cn/docx/IMHPd1Lcxo2HkFxesFHcHPhWn2g?from=from_copylink', '_blank')
                          }}
                        >
                          <FileText className="h-5 w-5" />
                          安装指南
                        </Button>
                      </motion.div>
                    </div>

                    {/* 微信群聊入口 */}
                    <div 
                      className="relative"
                      onMouseEnter={() => setShowQRCode(true)}
                      onMouseLeave={() => setShowQRCode(false)}
                    >
                      <motion.button
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-dashed border-muted-foreground/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
                      >
                        <Users className="h-4 w-4 text-accent" />
                        <span className="text-sm text-foreground">进入群聊获取支持</span>
                      </motion.button>

                      {/* 背景模糊遮罩 - 全屏覆盖 */}
                      <AnimatePresence>
                        {showQRCode && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 backdrop-blur-md bg-black/30 z-40"
                            style={{ backdropFilter: 'blur(4px)' }}
                            onClick={() => setShowQRCode(false)}
                            onMouseEnter={() => setShowQRCode(true)}
                          />
                        )}
                      </AnimatePresence>

                      {/* 二维码卡片 */}
                      <AnimatePresence>
                        {showQRCode && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 z-50 w-96"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Card className="p-4 shadow-xl border-accent/20 bg-background">
                              <div className="flex gap-4">
                                {/* 二维码 */}
                                <div className="flex-shrink-0">
                                  <div className="relative w-46 h-46 bg-muted rounded-lg overflow-hidden border border-border">
                                    <Image
                                      src="/Wechat_qunliao.jpg"
                                      alt="微信群聊二维码"
                                      fill
                                      className="object-cover"
                                      priority
                                    />
                                  </div>
                                </div>

                                {/* 说明文字 */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                  <div>
                                    <h4 className="font-semibold text-sm text-foreground mb-2">
                                      前期体验用户群
                                    </h4>
                                    <ul className="space-y-2">
                                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-accent mt-1">•</span>
                                        <span>体验期间问题答疑</span>
                                      </li>
                                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-accent mt-1">•</span>
                                        <span>可视情况发放体验码</span>
                                      </li>
                                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-accent mt-1">•</span>
                                        <span>最新功能及更新提醒</span>
                                      </li>
                                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-accent mt-1">•</span>
                                        <span>活动通知及优惠信息</span>
                                      </li>
                                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-accent mt-1">•</span>
                                        <span>快速响应新需求反馈</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
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

