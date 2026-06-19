"use client"

import * as React from "react"
import { Moon, Sun, Wrench, Type } from "lucide-react"
import { useTheme } from "next-themes"
import { useFontSize } from "./font-size-provider"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const { fontSize, setFontSize } = useFontSize()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const cycleFontSize = () => {
    const sizes: ("sm" | "base" | "lg" | "xl")[] = ["sm", "base", "lg", "xl"]
    const currentIndex = sizes.indexOf(fontSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setFontSize(sizes[nextIndex])
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-xl tracking-tight text-foreground">
            FixPrompt<span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={cycleFontSize}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            aria-label="เปลี่ยนขนาดตัวอักษร"
            title="เปลี่ยนขนาดตัวอักษร"
          >
            <Type className="h-4 w-4" />
            <span className="sr-only">เปลี่ยนขนาดตัวอักษร</span>
          </button>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            aria-label="สลับโหมดมืด/สว่าง"
            title="สลับโหมดมืด/สว่าง"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">สลับโหมดมืด/สว่าง</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
