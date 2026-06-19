"use client"

import * as React from "react"
import { CheckSquare, Square, Wrench, ShieldAlert } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export type ToolItem = {
  id: string
  name: string
  checked: boolean
  required: boolean
  type: 'tool' | 'part'
}

interface ToolsChecklistProps {
  tools?: ToolItem[]
  onToggle: (id: string) => void
}

export function ToolsChecklist({ tools = [], onToggle }: ToolsChecklistProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  // Only read resolvedTheme after mount to avoid hydration mismatch
  const isDark = mounted && resolvedTheme === "dark"

  const completedCount = tools.filter(t => t.checked).length
  const progress = tools.length > 0 ? Math.round((completedCount / tools.length) * 100) : 0
  const toolsList = tools.filter(t => t.type === 'tool')
  const partsList = tools.filter(t => t.type === 'part')

  // ---- Dynamic class helpers ----
  const bg       = isDark ? "bg-slate-900"    : "bg-white"
  const border   = isDark ? "border-slate-700" : "border-slate-200"
  const headerBg = isDark ? "bg-slate-800"    : "bg-slate-50"
  const headerBorder = isDark ? "border-slate-700" : "border-slate-200"
  const countBg  = isDark ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-600"
  const barBg    = isDark ? "bg-slate-800"    : "bg-slate-100"
  const textMain = isDark ? "text-slate-100"  : "text-slate-800"
  const textMuted= isDark ? "text-slate-400"  : "text-slate-400"
  const hoverBg  = isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
  const emptyIcon= isDark ? "text-slate-700"  : "text-slate-300"
  const emptyText= isDark ? "text-slate-400"  : "text-slate-500"
  const emptySubtext = isDark ? "text-slate-500" : "text-slate-400"

  const renderToolItem = (tool: ToolItem) => {
    const toolTextColor = tool.checked
      ? isDark ? "text-slate-500 line-through" : "text-slate-400 line-through"
      : isDark ? "text-slate-100" : "text-slate-800"

    const toolIconColor = tool.type === "tool" ? "text-amber-500" : "text-blue-500"

    const badgeClass = tool.type === "tool"
      ? isDark
        ? "bg-amber-900/50 text-amber-300"
        : "bg-amber-100 text-amber-800"
      : isDark
        ? "bg-blue-900/50 text-blue-300"
        : "bg-blue-100 text-blue-800"

    return (
      <li key={tool.id}>
        <label className={cn("flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors group", hoverBg)}>
          <div className="mt-0.5 shrink-0" onClick={() => onToggle(tool.id)}>
            {tool.checked ? (
              <CheckSquare className={cn("w-5 h-5 transition-transform group-hover:scale-110", toolIconColor)} />
            ) : (
              <Square className={cn("w-5 h-5 transition-transform group-hover:scale-110", isDark ? "text-slate-500" : "text-slate-400")} />
            )}
          </div>
          <div className="flex flex-col flex-1">
            <span className={cn("text-sm font-medium leading-snug", toolTextColor)}>
              {tool.name}
            </span>
            {tool.required && (
              <span className={cn("mt-1 inline-flex w-fit text-[10px] font-bold tracking-wider px-2 py-0.5 rounded", badgeClass)}>
                จำเป็น
              </span>
            )}
          </div>
        </label>
      </li>
    )
  }

  return (
    <div className={cn("flex flex-col h-full border rounded-xl overflow-hidden shadow-sm", bg, border)}>

      {/* Header */}
      <div className={cn("p-4 border-b flex items-center justify-between", headerBg, headerBorder)}>
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-500" />
          <h3 className={cn("font-semibold", textMain)}>อุปกรณ์ที่ต้องเตรียม</h3>
        </div>
        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", countBg)}>
          {completedCount} / {tools.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className={cn("w-full h-1.5", barBg)}>
        <div
          className="h-full bg-amber-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {tools.length === 0 ? (
          <div className="text-center text-sm py-12 flex flex-col items-center justify-center h-full">
            <Wrench className={cn("w-10 h-10 mb-3", emptyIcon)} />
            <p className={cn("font-medium", emptyText)}>ยังไม่มีรายการอุปกรณ์</p>
            <p className={cn("text-xs mt-1", emptySubtext)}>AI จะแสดงรายการเครื่องมือที่ต้องใช้ที่นี่</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. เครื่องมือที่ต้องเตรียม */}
            {toolsList.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  1. เครื่องมือที่ต้องเตรียม
                </h4>
                <ul className="space-y-1">{toolsList.map(renderToolItem)}</ul>
              </div>
            )}

            {/* 2. อะไหล่สำหรับซ่อมแซม */}
            {partsList.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  2. อะไหล่สำหรับซ่อมแซม
                </h4>
                <ul className="space-y-1">{partsList.map(renderToolItem)}</ul>
              </div>
            )}
          </div>
        )}

        {/* Warning box */}
        <div className={cn(
          "mt-6 p-3 border rounded-lg flex gap-3 items-start",
          isDark
            ? "bg-amber-950/40 border-amber-700"
            : "bg-amber-50 border-amber-300"
        )}>
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className={cn("text-xs leading-relaxed", isDark ? "text-amber-200" : "text-amber-900")}>
            <strong className="font-bold">ข้อควรระวัง:</strong>{" "}
            โปรดตัดกระแสไฟฟ้าหรือปิดวาล์วน้ำก่อนเริ่มทำการซ่อมแซมทุกครั้ง เพื่อความปลอดภัย
          </p>
        </div>
      </div>
    </div>
  )
}
