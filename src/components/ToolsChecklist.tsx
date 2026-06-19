"use client"

import * as React from "react"
import { CheckSquare, Square, Wrench, ShieldAlert } from "lucide-react"

type ToolItem = {
  id: string
  name: string
  checked: boolean
  required: boolean
}

const initialTools: ToolItem[] = [
  { id: "1", name: "ไขควงแฉก (Phillips screwdriver)", checked: false, required: true },
  { id: "2", name: "เทปพันเกลียว (Teflon tape)", checked: false, required: true },
  { id: "3", name: "ประแจคอม้า หรือ ประแจเลื่อน", checked: false, required: true },
  { id: "4", name: "ถุงมือยาง (ป้องกันสิ่งสกปรก)", checked: false, required: false },
]

export function ToolsChecklist() {
  const [tools, setTools] = React.useState<ToolItem[]>(initialTools)

  const toggleTool = (id: string) => {
    setTools(tools.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  const completedCount = tools.filter(t => t.checked).length
  const progress = Math.round((completedCount / tools.length) * 100)

  return (
    <div className="flex flex-col h-full bg-card/50 border rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-semibold text-foreground">อุปกรณ์ที่ต้องเตรียม</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {completedCount} / {tools.length}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-amber-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {tools.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            รอการวิเคราะห์ปัญหาจาก AI...
          </div>
        ) : (
          <ul className="space-y-2">
            {tools.map(tool => (
              <li key={tool.id}>
                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                  <div className="mt-0.5" onClick={() => toggleTool(tool.id)}>
                    {tool.checked ? (
                      <CheckSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-110" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground transition-transform group-hover:scale-110" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`text-sm font-medium ${tool.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {tool.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {tool.required && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                          จำเป็น
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <strong className="font-semibold">ข้อควรระวัง:</strong> โปรดตัดกระแสไฟฟ้าหรือปิดวาล์วน้ำก่อนเริ่มทำการซ่อมแซมทุกครั้ง เพื่อความปลอดภัย
          </p>
        </div>
      </div>
    </div>
  )
}
