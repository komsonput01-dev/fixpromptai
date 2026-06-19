"use client"

import * as React from "react"

type FontSize = "sm" | "base" | "lg" | "xl"

interface FontSizeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const FontSizeContext = React.createContext<FontSizeContextType | undefined>(undefined)

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = React.useState<FontSize>("base")

  React.useEffect(() => {
    const saved = localStorage.getItem("fixpromptai-font-size") as FontSize
    if (saved && ["sm", "base", "lg", "xl"].includes(saved)) {
      setFontSizeState(saved)
    }
  }, [])

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
    localStorage.setItem("fixpromptai-font-size", size)
    // Update the html element class for tailwind to use or use CSS variables
    const html = document.documentElement
    html.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
    html.classList.add(`text-${size}`)
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = React.useContext(FontSizeContext)
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider")
  }
  return context
}
