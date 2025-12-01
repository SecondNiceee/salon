"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type TAccessibilityState = {
  isLargeText: boolean
  isHighContrast: boolean
  toggleLargeText: () => void
  setLargeText: (value: boolean) => void
  toggleHighContrast: () => void
  setHighContrast: (value: boolean) => void
}

export const useAccessibilityStore = create<TAccessibilityState>()(
  persist(
    (set, get) => ({
      isLargeText: false,
      isHighContrast: false,
      toggleLargeText: () => {
        const newValue = !get().isLargeText
        set({ isLargeText: newValue })
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("large-text", newValue)
        }
      },
      setLargeText: (value: boolean) => {
        set({ isLargeText: value })
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("large-text", value)
        }
      },
      toggleHighContrast: () => {
        const newValue = !get().isHighContrast
        set({ isHighContrast: newValue })
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("high-contrast", newValue)
        }
      },
      setHighContrast: (value: boolean) => {
        set({ isHighContrast: value })
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("high-contrast", value)
        }
      },
    }),
    {
      name: "accessibility-storage",
      onRehydrateStorage: () => (state) => {
        if (typeof document !== "undefined") {
          if (state?.isLargeText) {
            document.documentElement.classList.add("large-text")
          }
          if (state?.isHighContrast) {
            document.documentElement.classList.add("high-contrast")
          }
        }
      },
    },
  ),
)
