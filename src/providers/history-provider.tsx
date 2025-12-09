"use client"

import { createContext, useContext, useEffect, useRef, useCallback, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useCityStore } from "@/entities/city/cityStore"
import { routerConfig } from "@/config/router.config"

interface HistoryEntry {
  path: string // path without city (e.g., /massage, /spa)
  fullPath: string // full path with city (e.g., /moscow/massage)
}

interface HistoryContextType {
  goBack: () => string // returns the URL to navigate to
  getPreviousPath: () => string | null
}

const HistoryContext = createContext<HistoryContextType | null>(null)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const historyRef = useRef<HistoryEntry[]>([])
  const { city: storedCity } = useCityStore()

  // Extract path without city prefix
  const extractPathWithoutCity = useCallback((fullPath: string): string => {
    const parts = fullPath.split("/").filter(Boolean)
    if (parts.length <= 1) {
      return "/"
    }
    // Remove first part (city slug) and return the rest
    return "/" + parts.slice(1).join("/")
  }, [])

  // Track navigation
  useEffect(() => {
    if (!pathname) return

    const pathWithoutCity = extractPathWithoutCity(pathname)
    const lastEntry = historyRef.current[historyRef.current.length - 1]

    // Don't add entry if it's the same page (just city changed)
    if (lastEntry?.path !== pathWithoutCity) {
      historyRef.current.push({
        path: pathWithoutCity,
        fullPath: pathname,
      })

      // Keep only last 20 entries to prevent memory issues
      if (historyRef.current.length > 20) {
        historyRef.current = historyRef.current.slice(-20)
      }
    }
  }, [pathname, extractPathWithoutCity])

  const getPreviousPath = useCallback((): string | null => {
    // Need at least 2 entries (current + previous)
    if (historyRef.current.length < 2) {
      return null
    }
    // Return previous entry's path (without city)
    return historyRef.current[historyRef.current.length - 2].path
  }, [])

  const goBack = useCallback((): string => {
    const currentCitySlug = storedCity?.slug || ""
    const previousPath = getPreviousPath()

    if (previousPath && previousPath !== "/") {
      // Remove the current page from history
      historyRef.current.pop()
      // Return previous path with current city
      return routerConfig.withCity(currentCitySlug, previousPath)
    }

    // Fallback to home page with current city
    return routerConfig.withCity(currentCitySlug, routerConfig.home)
  }, [storedCity, getPreviousPath])

  return <HistoryContext.Provider value={{ goBack, getPreviousPath }}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
