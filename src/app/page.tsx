"use client"

import * as React from "react"
import { Navbar } from "@/components/Navbar"
import { ChatContainer } from "@/components/ChatContainer"
import { ImageUploader } from "@/components/ImageUploader"
import { ToolsChecklist, ToolItem } from "@/components/ToolsChecklist"

export interface UploadedImage {
  file: File
  base64: string
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = React.useState<UploadedImage | null>(null)
  const [tools, setTools] = React.useState<ToolItem[]>([])

  const handleUploadSuccess = (file: File, base64: string) => {
    setUploadedImage({ file, base64 })
  }

  const handleClearImage = () => {
    setUploadedImage(null)
  }

  const handleToggleTool = (id: string) => {
    setTools(prevTools => prevTools.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 h-full">
          
          {/* Left Column: Image Upload & Chat */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <section aria-label="อัปโหลดรูปภาพปัญหา">
              <h2 className="text-xl font-semibold mb-4 text-foreground">อัปโหลดรูปภาพปัญหาของคุณ</h2>
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </section>
            
            <section aria-label="พูดคุยกับผู้ช่วย" className="flex-1 flex flex-col min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-foreground">พูดคุยกับผู้ช่วย AI</h2>
              <ChatContainer 
                uploadedImage={uploadedImage} 
                onClearImage={handleClearImage} 
                onToolsParsed={setTools}
              />
            </section>
          </div>

          {/* Right Column: Checklist */}
          <div className="lg:col-span-4 flex flex-col">
            <section aria-label="รายการอุปกรณ์" className="sticky top-24 h-[calc(100vh-8rem)] min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4 text-foreground">รายการอุปกรณ์</h2>
              <ToolsChecklist tools={tools} onToggle={handleToggleTool} />
            </section>
          </div>

        </div>
      </main>
    </>
  )
}


