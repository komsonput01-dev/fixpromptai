"use client"

import * as React from "react"
import { Upload, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ImageUploader() {
  const [isDragging, setIsDragging] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "uploading" | "analyzing" | "success">("idle")
  const [file, setFile] = React.useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0])
    }
  }

  const simulateUpload = (selectedFile: File) => {
    setFile(selectedFile)
    setStatus("uploading")
    
    // Simulate upload delay
    setTimeout(() => {
      setStatus("analyzing")
      // Simulate analysis delay
      setTimeout(() => {
        setStatus("success")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center min-h-[200px] text-center bg-card/30 relative overflow-hidden",
          isDragging ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.02]" : "border-border hover:border-muted-foreground/50",
          status !== "idle" && "border-solid"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
          onChange={handleFileChange}
          disabled={status !== "idle"}
        />

        {status === "idle" && (
          <div className="space-y-4 pointer-events-none">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm text-foreground">ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่ออัปโหลด</p>
              <p className="text-xs text-muted-foreground">รองรับ JPG, PNG, WEBP (สูงสุด 5MB)</p>
            </div>
          </div>
        )}

        {status === "uploading" && (
          <div className="space-y-4 pointer-events-none flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-sm font-medium animate-pulse">กำลังอัปโหลดรูปภาพ...</p>
          </div>
        )}

        {status === "analyzing" && (
          <div className="space-y-4 pointer-events-none flex flex-col items-center">
            <div className="relative">
              <ImageIcon className="w-10 h-10 text-blue-500" />
              <div className="absolute inset-0 bg-blue-500/20 animate-ping rounded-full" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">AI กำลังวิเคราะห์รูปภาพ...</p>
              <p className="text-xs text-muted-foreground">ค้นหาปัญหาและระบุชิ้นส่วนที่เกี่ยวข้อง</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 pointer-events-none flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">วิเคราะห์เสร็จสมบูรณ์</p>
              <p className="text-xs text-muted-foreground">
                {file?.name || "image.jpg"} พร้อมใช้งาน
              </p>
            </div>
            <button
              className="mt-4 text-xs text-blue-600 hover:underline pointer-events-auto relative z-10"
              onClick={(e) => {
                e.preventDefault()
                setStatus("idle")
                setFile(null)
              }}
            >
              อัปโหลดรูปใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
