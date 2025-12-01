"use client"
import { Button } from "@/components/ui/button"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"
import { useEffect } from "react"

const ContrastIcon = ({ className, isHighContrast }: { className?: string; isHighContrast: boolean }) => (
  <div
    className={`flex items-center justify-center w-5 h-5 rounded text-sm font-bold ${
      isHighContrast ? "bg-white text-black border border-black" : "bg-black text-white"
    } ${className}`}
  >
    A
  </div>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
)

interface AccessibilityButtonProps {
  className?: string
  variant?: "icon" | "full"
  mode?: "largeText" | "highContrast"
}

export const AccessibilityButton = ({ className, variant = "icon", mode = "largeText" }: AccessibilityButtonProps) => {
  const { isLargeText, toggleLargeText, isHighContrast, toggleHighContrast } = useAccessibilityStore()

  useEffect(() => {
    if (isLargeText) {
      document.documentElement.classList.add("large-text")
    }
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast")
    }
  }, [isLargeText, isHighContrast])

  const isActive = mode === "largeText" ? isLargeText : isHighContrast
  const toggle = mode === "largeText" ? toggleLargeText : toggleHighContrast

  const labels = {
    largeText: {
      active: "Обычный режим",
      inactive: "Для слабовидящих",
      titleActive: "Выключить режим для слабовидящих",
      titleInactive: "Включить режим для слабовидящих",
    },
    highContrast: {
      active: "Обычные цвета",
      inactive: "Для дальтоников",
      titleActive: "Выключить высококонтрастный режим",
      titleInactive: "Включить высококонтрастный режим",
    },
  }

  const label = labels[mode]

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        onClick={toggle}
        className={`justify-start gap-3 p-4 bg-transparent items-center h-auto ${className}`}
      >
        {mode === "largeText" ? (
          <EyeIcon className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`} />
        ) : (
          <ContrastIcon isHighContrast={isHighContrast} />
        )}
        <span>{isActive ? label.active : label.inactive}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className={`p-2 bg-transparent ${isActive ? "border-blue-600 bg-blue-50" : ""} ${className}`}
      title={isActive ? label.titleActive : label.titleInactive}
    >
      {mode === "largeText" ? (
        <EyeIcon className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`} />
      ) : (
        <ContrastIcon isHighContrast={isHighContrast} />
      )}
      <span className="sr-only">{isActive ? label.titleActive : label.titleInactive}</span>
    </Button>
  )
}
