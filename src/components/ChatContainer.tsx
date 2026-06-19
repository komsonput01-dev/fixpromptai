"use client"

import { useChat } from "@ai-sdk/react"
import { Send, Bot, User, AlertCircle } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

const promptChips = [
  "ท่อน้ำรั่ว",
  "หน้าจอมือถือแตก",
  "พัดลมไม่หมุน",
  "ปลั๊กไฟช็อต",
]

export function ChatContainer() {
  // @ts-ignore: ai-sdk types might have changed or mismatched
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading, error } = useChat()

  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh] border rounded-xl overflow-hidden bg-card/50 shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-muted-foreground">
            <Bot className="w-16 h-16 text-blue-500/50" />
            <div className="space-y-2">
              <p className="font-medium text-lg text-foreground">สวัสดีครับ! ผมคือ Fixbot AI</p>
              <p className="text-sm max-w-sm mx-auto">
                ผู้ช่วยซ่อมแซม DIY ของคุณ มีอุปกรณ์อะไรเสีย หรือต้องการคำแนะนำในการซ่อมแซมบอกผมได้เลยครับ
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-md pt-4">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors border border-border/50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const m = msg as any;
            return (
            <div
              key={m.id}
              className={cn(
                "flex w-full",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex gap-3 max-w-[85%] rounded-2xl px-4 py-3",
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {m.role !== "user" && (
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {m.content || m.text || ""}
                </div>
              </div>
            </div>
          )})
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-2xl px-4 py-3 flex gap-2 items-center">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center my-2">
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 bg-background border-t">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-muted/50 rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-1 focus-within:ring-ring transition-shadow border border-border/50"
        >
          <input
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            value={input}
            placeholder="พิมพ์ปัญหาของคุณที่นี่ (เช่น ท่อน้ำรั่วซึม)..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={isLoading || !input?.trim()}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">ส่งข้อความ</span>
          </button>
        </form>
      </div>
    </div>
  )
}
