"use client"

import * as React from "react"
import { CheckSquare, Square, Wrench, ShieldAlert } from "lucide-react"

export type ToolItem = {
  id: string
  name: string
  checked: boolean
  required: boolean
  type: 'tool' | 'part'
}

interface ToolsChecklistProps {
  tools: ToolItem[]
  onToggle: (id: string) => void
}

export function ToolsChecklist({ tools, onToggle }: ToolsChecklistProps) {
  const completedCount = tools.filter(t => t.checked).length
  const progress = tools.length > 0 ? Math.round((completedCount / tools.length) * 100) : 0

  const toolsList = tools.filter(t => t.type === 'tool')
  const partsList = tools.filter(t => t.type === 'part')

  const renderToolItem = (tool: ToolItem) => (
    <li key={tool.id}>
      <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
        <div className="mt-0.5" onClick={() => onToggle(tool.id)}>
          {tool.checked ? (
            <CheckSquare className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              tool.type === 'tool' ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
            )} />
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
              <span className={cn(
                "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
                tool.type === 'tool' 
                  ? "text-amber-700 bg-amber-500/10 dark:text-amber-300" 
                  : "text-blue-700 bg-blue-500/10 dark:text-blue-300"
              )}>
                จำเป็น
              </span>
            )}
          </div>
        </div>
      </label>
    </li>
  )

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

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {tools.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12 flex flex-col items-center justify-center h-full">
            <Wrench className="w-10 h-10 text-muted-foreground/30 mb-2" />
            <p>เมื่อคุณพูดคุยหรืออัปโหลดรูปภาพปัญหา</p>
            <p className="text-xs text-muted-foreground/80 mt-1">AI จะช่วยวิเคราะห์และแสดงรายการเครื่องมือที่ต้องใช้ที่นี่ครับ</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. เครื่องมือที่ต้องเตรียม */}
            {toolsList.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  1. เครื่องมือที่ต้องเตรียม
                </h4>
                <ul className="space-y-1">
                  {toolsList.map(renderToolItem)}
                </ul>
              </div>
            )}

            {/* 2. อะไหล่สำหรับซ่อมแซม */}
            {partsList.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  2. อะไหล่สำหรับซ่อมแซม
                </h4>
                <ul className="space-y-1">
                  {partsList.map(renderToolItem)}
                </ul>
              </div>
            )}
          </div>
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

// Helper function inside component for class names
import { cn } from "@/lib/utils"
