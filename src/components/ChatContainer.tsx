"use client"

import { Send, Bot, AlertCircle } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import { ToolItem } from "./ToolsChecklist"

const promptChips = [
  "ท่อน้ำรั่ว",
  "หน้าจอมือถือแตก",
  "พัดลมไม่หมุน",
  "ปลั๊กไฟช็อต",
]

interface Message {
  id: string
  role: string
  content: string
  image?: string // Data URL for image (data:image/jpeg;base64,...)
}

interface UploadedImage {
  file: File
  base64: string
}

interface ChatContainerProps {
  uploadedImage: UploadedImage | null
  onClearImage: () => void
  onToolsParsed: (tools: ToolItem[]) => void
}

const toolDictionary: { keywords: string[], name: string, required: boolean, type: 'tool' | 'part' }[] = [
  { keywords: ["ไขควงแฉก", "ไขควงปากแฉก"], name: "ไขควงแฉก (Phillips screwdriver)", required: true, type: 'tool' },
  { keywords: ["ไขควงปากแบน", "ไขควงแบน"], name: "ไขควงปากแบน (Flathead screwdriver)", required: true, type: 'tool' },
  { keywords: ["ไขควง"], name: "ไขควงชุดเครื่องมือช่าง", required: true, type: 'tool' },
  { keywords: ["เทปพันเกลียว", "เทปพันท่อ", "เทปเกลียว"], name: "เทปพันเกลียว (Teflon tape)", required: true, type: 'part' },
  { keywords: ["ประแจเลื่อน", "ประแจคอม้า", "ประแจปากตาย", "ประแจ"], name: "ประแจเลื่อน", required: true, type: 'tool' },
  { keywords: ["ถุงมือยาง", "ถุงมือ"], name: "ถุงมือยางป้องกันสิ่งสกปรก", required: false, type: 'tool' },
  { keywords: ["รองเท้าบูท", "รองเท้าบู๊ท"], name: "รองเท้าบูทยางนิรภัย", required: false, type: 'tool' },
  { keywords: ["กาวประสานท่อ", "กาวทาท่อ", "น้ำยาประสานท่อ", "กาว pvc"], name: "กาวประสานท่อ PVC", required: true, type: 'part' },
  { keywords: ["ไขควงวัดไฟ", "วัดไฟ"], name: "ไขควงวัดไฟ (Voltage Tester)", required: true, type: 'tool' },
  { keywords: ["ซิลิโคน", "thermal paste"], name: "ซิลิโคนระบายความร้อน (Thermal Paste)", required: true, type: 'part' },
  { keywords: ["น้ำมันจักร", "น้ำมันหล่อลื่น", "wd-40", "น้ำมันเอนกประสงค์"], name: "น้ำมันจักร / น้ำมันหล่อลื่นเอนกประสงค์", required: true, type: 'part' },
  { keywords: ["คัตเตอร์", "มีดคัตเตอร์"], name: "มีดคัตเตอร์", required: false, type: 'tool' },
  { keywords: ["เทปพันละลาย", "เทปพันสายไฟ"], name: "เทปพันสายไฟ", required: true, type: 'part' },
  { keywords: ["กระเบื้อง", "แผ่นกระเบื้อง"], name: "แผ่นกระเบื้องมุงหลังคา", required: true, type: 'part' },
  { keywords: ["แผ่นปิดรอยต่อ", "flashband", "butyl tape"], name: "แผ่นปิดรอยต่อกันซึม (Flashband)", required: true, type: 'part' },
  { keywords: ["ซีลแลนท์", "pu sealant", "กาวพียู"], name: "โพลียูรีเทนซีลแลนท์ (PU Sealant)", required: true, type: 'part' },
  { keywords: ["กาวอะคริลิก", "อะคริลิกกันซึม"], name: "กาวอะคริลิกกันซึม", required: true, type: 'part' },
  { keywords: ["มัลติมิเตอร์"], name: "มัลติมิเตอร์วัดไฟฟ้า", required: false, type: 'tool' },
  { keywords: ["คาปาซิเตอร์", "c สตาร์ท"], name: "คาปาซิเตอร์ (Capacitor)", required: true, type: 'part' },
  { keywords: ["หัวแร้งบัดกรี", "บัดกรี"], name: "หัวแร้งและตะกั่วบัดกรี", required: true, type: 'tool' },
  { keywords: ["เลื่อย", "เลื่อยตัดท่อ", "เลื่อยเหล็ก"], name: "เลื่อยตัดท่อ / เลื่อยโครงเหล็ก", required: true, type: 'tool' },
  { keywords: ["ตัวรัดซ่อมท่อ", "ตัวรัดท่อ", "repair clamp"], name: "ตัวรัดซ่อมท่อ (Repair Clamp)", required: false, type: 'part' },
  { keywords: ["จอบ", "พลั่ว", "ขุดดิน"], name: "จอบหรือพลั่วขุดดิน", required: true, type: 'tool' },
  { keywords: ["ปืนยิงกาว"], name: "ปืนยิงกาว (Caulking Gun)", required: true, type: 'tool' },
  { keywords: ["บันได"], name: "บันไดอลูมิเนียม", required: true, type: 'tool' },
  { keywords: ["แปรง", "พู่กัน"], name: "แปรงปัดฝุ่น", required: false, type: 'tool' },
  { keywords: ["ลูกยางปั๊มส้วม", "ปั๊มส้วม", "plunger", "ลูกยางปั๊ม"], name: "ลูกยางปั๊มส้วม (Plunger)", required: true, type: 'tool' },
  { keywords: ["งูเหล็ก", "toilet auger", "closet auger"], name: "งูเหล็กทะลวงท่อ (Toilet Auger)", required: true, type: 'tool' },
  { keywords: ["ค้อน"], name: "ค้อนเหล็ก (Hammer)", required: true, type: 'tool' },
  { keywords: ["สว่าน", "สว่านไฟฟ้า"], name: "สว่านไฟฟ้า (Electric Drill)", required: true, type: 'tool' },
  { keywords: ["กระดาษทราย"], name: "กระดาษทราย (Sandpaper)", required: false, type: 'part' },
  { keywords: ["เทปผ้า", "duct tape"], name: "เทปผ้าเอนกประสงค์ (Duct Tape)", required: true, type: 'part' },
  { keywords: ["กาวร้อน", "super glue"], name: "กาวร้อน (Super Glue)", required: true, type: 'part' }
]

function extractTools(text: string): ToolItem[] {
  const foundTools: ToolItem[] = []
  let idCounter = 1
  for (const item of toolDictionary) {
    const matches = item.keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))
    if (matches) {
      foundTools.push({
        id: String(idCounter++),
        name: item.name,
        checked: false,
        required: item.required,
        type: item.type
      })
    }
  }
  return foundTools
}

export function ChatContainer({ uploadedImage, onClearImage, onToolsParsed }: ChatContainerProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Automatically submit image to chat when uploaded
  React.useEffect(() => {
    if (uploadedImage) {
      const defaultText = `ช่วยวิเคราะห์รูปภาพปัญหา "${uploadedImage.file.name}" นี้และแนะนำแนวทางซ่อมแซมให้หน่อยครับ`
      sendMessage(defaultText, uploadedImage)
      onClearImage()
    }
  }, [uploadedImage])

  const sendMessage = async (textToSend: string, imageToSend?: UploadedImage) => {
    if (!textToSend.trim() && !imageToSend) return
    if (isLoading) return

    const imageUri = imageToSend 
      ? `data:${imageToSend.file.type};base64,${imageToSend.base64}` 
      : undefined

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      image: imageUri,
    }

    // Capture current messages list to send to API
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const payload: any = {
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
      }

      if (imageToSend) {
        payload.image = {
          mimeType: imageToSend.file.type,
          base64: imageToSend.base64
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to send message")
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) {
        throw new Error("No reader available")
      }

      const assistantMessageId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { id: assistantMessageId, role: "assistant", content: "" }])

      let accumulatedContent = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (!line.trim()) continue
          if (line.startsWith('0:"')) {
            let clean = line.slice(3)
            if (clean.endsWith('"')) {
              clean = clean.slice(0, -1)
            }
            const text = clean.replace(/\\"/g, '"').replace(/\\n/g, "\n")
            accumulatedContent += text

            // Hiding [TOOLS_LIST] tag and its contents from the chat message display
            let displayContent = accumulatedContent
            let toolsPart = ""
            if (accumulatedContent.includes("[TOOLS_LIST]")) {
              const parts = accumulatedContent.split("[TOOLS_LIST]")
              displayContent = parts[0]
              toolsPart = parts[1] || ""
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, content: displayContent.trim() } : msg
              )
            )

            // Parse and push dynamic tools to checklist side panel
            if (toolsPart.trim()) {
              const parsed: ToolItem[] = []
              let idCounter = 1
              const groups = toolsPart.split("|")
              
              for (const group of groups) {
                const trimmedGroup = group.trim()
                if (trimmedGroup.startsWith("เครื่องมือ:")) {
                  const listText = trimmedGroup.substring("เครื่องมือ:".length).trim()
                  const names = listText.split(",")
                  for (const n of names) {
                    const name = n.trim()
                    if (name) {
                      const isOptional = name.includes("(ถ้ามี)") || name.includes("(ไม่จำเป็น)") || name.includes("optional")
                      parsed.push({
                        id: String(idCounter++),
                        name,
                        checked: false,
                        required: !isOptional,
                        type: 'tool'
                      })
                    }
                  }
                } else if (trimmedGroup.startsWith("อะไหล่:")) {
                  const listText = trimmedGroup.substring("อะไหล่:".length).trim()
                  const names = listText.split(",")
                  for (const n of names) {
                    const name = n.trim()
                    if (name) {
                      const isOptional = name.includes("(ถ้ามี)") || name.includes("(ไม่จำเป็น)") || name.includes("optional")
                      parsed.push({
                        id: String(idCounter++),
                        name,
                        checked: false,
                        required: !isOptional,
                        type: 'part'
                      })
                    }
                  }
                }
              }

              // Fallback classification if formatting didn't strictly separate เครื่องมือ and อะไหล่
              if (parsed.length === 0) {
                const rawItems = toolsPart.split(",")
                for (const item of rawItems) {
                  const name = item.trim()
                  if (name) {
                    let itemType: 'tool' | 'part' = 'tool'
                    const dictionaryMatch = toolDictionary.find(d => d.name === name || d.keywords.some(k => name.toLowerCase().includes(k.toLowerCase())))
                    if (dictionaryMatch) {
                      itemType = dictionaryMatch.type
                    } else {
                      const partKeywords = ["อะไหล่", "วัสดุ", "กาว", "ซิลิโคน", "เทป", "น้ำมัน", "น้ำยา", "กระเบื้อง", "ท่อ", "สายไฟ", "หน้าจอ", "ตัวรัด", "แบตเตอรี่", "เตารับ"]
                      if (partKeywords.some(k => name.toLowerCase().includes(k))) {
                        itemType = 'part'
                      }
                    }
                    const isOptional = name.includes("(ถ้ามี)") || name.includes("(ไม่จำเป็น)") || name.includes("optional")
                    parsed.push({
                      id: String(idCounter++),
                      name,
                      checked: false,
                      required: !isOptional,
                      type: itemType
                    })
                  }
                }
              }
              onToolsParsed(parsed)
            } else {
              // Otherwise, fall back to parsing keywords in real-time as text streams in
              const fallbackTools = extractTools(displayContent)
              onToolsParsed(fallbackTools)
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

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
                  type="button"
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors border border-border/50 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex flex-col gap-2 max-w-[85%] rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {msg.role !== "user" && (
                  <div className="flex gap-2 items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">Fixbot AI</span>
                  </div>
                )}
                
                {msg.image && (
                  <div className="relative max-w-[280px] overflow-hidden rounded-lg border border-border/30 shadow-sm bg-black/5">
                    <img src={msg.image} alt="Uploaded problem" className="w-full h-auto object-contain max-h-[200px]" />
                  </div>
                )}

                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
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
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">ส่งข้อความ</span>
          </button>
        </form>
      </div>
    </div>
  )
}
