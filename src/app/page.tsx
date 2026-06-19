"use client"

import * as React from "react"
import { Navbar } from "@/components/Navbar"
import { ChatContainer } from "@/components/ChatContainer"
import { ImageUploader } from "@/components/ImageUploader"
import { ToolsChecklist, ToolItem } from "@/components/ToolsChecklist"
import { Camera, MessageSquare, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedImage {
  file: File
  base64: string
}

type Tab = "upload" | "chat" | "checklist"

const tabs: { id: Tab; label: string; icon: React.ReactNode; mobileLabel: string }[] = [
  { id: "upload", label: "อัปโหลดรูปภาพ", mobileLabel: "รูปภาพ", icon: <Camera className="w-4 h-4" /> },
  { id: "chat",   label: "พูดคุยกับ AI",   mobileLabel: "AI Chat", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "checklist", label: "รายการอุปกรณ์", mobileLabel: "อุปกรณ์", icon: <Wrench className="w-4 h-4" /> },
]

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<Tab>("upload")
  const [uploadedImage, setUploadedImage] = React.useState<UploadedImage | null>(null)
  const [tools, setTools] = React.useState<ToolItem[]>([])
  const [toolsCount, setToolsCount] = React.useState(0)

  const handleUploadSuccess = (file: File, base64: string) => {
    setUploadedImage({ file, base64 })
    // Auto-switch to chat tab after upload
    setTimeout(() => setActiveTab("chat"), 500)
  }

  const handleClearImage = () => {
    setUploadedImage(null)
  }

  const handleToolsParsed = (newTools: ToolItem[]) => {
    setTools(newTools)
    setToolsCount(newTools.length)
  }

  const handleToggleTool = (id: string) => {
    setTools(prevTools => prevTools.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  const checkedCount = tools.filter(t => t.checked).length

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-4 md:py-8">

        {/* ===== TAB BAR ===== */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-2xl p-1.5 mb-6 border border-border/50 shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const badgeCount = tab.id === "checklist" ? toolsCount : 0
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-background text-foreground shadow-md ring-1 ring-border/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {tab.icon}
                {/* Desktop label */}
                <span className="hidden sm:inline">{tab.label}</span>
                {/* Mobile label */}
                <span className="sm:hidden">{tab.mobileLabel}</span>

                {/* Badge for checklist count */}
                {badgeCount > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center transition-all",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-amber-500 text-white"
                  )}>
                    {badgeCount}
                  </span>
                )}

                {/* Progress dot for checklist */}
                {tab.id === "checklist" && checkedCount > 0 && toolsCount > 0 && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
                )}
              </button>
            )
          })}
        </div>

        {/* ===== DESKTOP LAYOUT (lg+): always show all 3 side by side ===== */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 lg:gap-8 h-full">
          {/* Left: Image Upload */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <section aria-label="อัปโหลดรูปภาพปัญหา">
              <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                อัปโหลดรูปภาพปัญหา
              </h2>
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </section>
          </div>

          {/* Middle: Chat */}
          <div className="lg:col-span-4 flex flex-col min-h-[500px]">
            <section aria-label="พูดคุยกับผู้ช่วย" className="flex-1 flex flex-col">
              <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                พูดคุยกับผู้ช่วย AI
              </h2>
              <ChatContainer
                uploadedImage={uploadedImage}
                onClearImage={handleClearImage}
                onToolsParsed={handleToolsParsed}
              />
            </section>
          </div>

          {/* Right: Checklist */}
          <div className="lg:col-span-4 flex flex-col">
            <section aria-label="รายการอุปกรณ์" className="sticky top-24 h-[calc(100vh-8rem)] min-h-[400px]">
              <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                รายการอุปกรณ์
                {toolsCount > 0 && (
                  <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    {checkedCount}/{toolsCount}
                  </span>
                )}
              </h2>
              <ToolsChecklist tools={tools} onToggle={handleToggleTool} />
            </section>
          </div>
        </div>

        {/* ===== MOBILE/TABLET LAYOUT (<lg): Tab-based ===== */}
        <div className="lg:hidden">
          {/* Tab: Upload */}
          <div className={activeTab === "upload" ? "block" : "hidden"}>
            <section aria-label="อัปโหลดรูปภาพปัญหา">
              <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                อัปโหลดรูปภาพปัญหา
              </h2>
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
              {uploadedImage && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">รูปภาพพร้อมวิเคราะห์แล้ว</p>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80">กดแท็บ "AI Chat" เพื่อดูผลวิเคราะห์</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    ไปที่ AI Chat →
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Tab: Chat */}
          <div className={activeTab === "chat" ? "block" : "hidden"}>
            <section aria-label="พูดคุยกับผู้ช่วย" className="flex flex-col min-h-[60vh]">
              <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                พูดคุยกับผู้ช่วย AI
              </h2>
              <ChatContainer
                uploadedImage={activeTab === "chat" ? uploadedImage : null}
                onClearImage={handleClearImage}
                onToolsParsed={handleToolsParsed}
              />
              {toolsCount > 0 && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">
                    AI แนะนำ <strong>{toolsCount} รายการ</strong> อุปกรณ์สำหรับงานนี้
                  </p>
                  <button
                    onClick={() => setActiveTab("checklist")}
                    className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0"
                  >
                    ดูรายการ →
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Tab: Checklist */}
          <div className={activeTab === "checklist" ? "block" : "hidden"}>
            <section aria-label="รายการอุปกรณ์" className="flex flex-col min-h-[60vh]">
              <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                รายการอุปกรณ์
                {toolsCount > 0 && (
                  <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    {checkedCount}/{toolsCount}
                  </span>
                )}
              </h2>
              <ToolsChecklist tools={tools} onToggle={handleToggleTool} />
            </section>
          </div>
        </div>

      </main>
    </>
  )
}
