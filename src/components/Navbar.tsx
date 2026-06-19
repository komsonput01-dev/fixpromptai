"use client"

import * as React from "react"
import { Moon, Sun, Wrench, Type } from "lucide-react"
import { useTheme } from "next-themes"
import { useFontSize } from "./font-size-provider"

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const { fontSize, setFontSize } = useFontSize()
  const [mounted, setMounted] = React.useState(false)

  // Only render theme button after mount to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const cycleFontSize = () => {
    const sizes: ("sm" | "base" | "lg" | "xl")[] = ["sm", "base", "lg", "xl"]
    const currentIndex = sizes.indexOf(fontSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setFontSize(sizes[nextIndex])
  }

  const isDark = resolvedTheme === "dark"

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-xl tracking-tight text-foreground">
            FixPrompt<span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font size toggle */}
          <button
            onClick={cycleFontSize}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-9 px-3 border border-border/50"
            aria-label="เปลี่ยนขนาดตัวอักษร"
            title={`ขนาดตัวอักษร: ${fontSize}`}
          >
            <Type className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase hidden sm:inline">{fontSize}</span>
          </button>

          {/* Theme toggle — only renders after hydration to prevent mismatch */}
          {mounted ? (
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-9 px-3 border border-border/50"
              aria-label={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
              title={isDark ? "โหมดมืด (คลิกเปลี่ยน)" : "โหมดสว่าง (คลิกเปลี่ยน)"}
            >
              {isDark ? (
                <>
                  <Moon className="h-4 w-4 text-blue-400" />
                  <span className="text-xs hidden sm:inline">มืด</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="text-xs hidden sm:inline">สว่าง</span>
                </>
              )}
            </button>
          ) : (
            /* Placeholder to prevent layout shift */
            <div className="h-9 w-20 rounded-xl border border-border/50 bg-muted/30 animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  )
}
