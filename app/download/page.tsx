"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Chrome, ArrowLeft, FolderArchive, FileText } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DownloadPage() {
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
                    {/* 文件夹图标 */}
                    <div className="flex items-center justify-center py-4">
                      <FolderArchive className="h-24 w-24 text-muted-foreground/60" />
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
                          帮助文档
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* 底部提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-muted-foreground/60"
              >
                <p>
                  下载插件后，需要
                  <Link href="/purchase" className="text-accent hover:underline mx-1">
                    获取授权码
                  </Link>
                  才能使用全部功能
                </p>
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

