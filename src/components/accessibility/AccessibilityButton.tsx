"use client"
import { Eye, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"
import { useEffect } from "react"

const ColorblindIcon = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`w-6 h-6 rounded-sm flex items-center justify-center text-sm font-bold leading-none ${
      isActive ? "bg-white text-black border border-black" : "bg-black text-white"
    }`}
  >
    A
  </div>
)

interface AccessibilityButtonProps {
  className?: string
  variant?: "icon" | "full"
  mode?: "largeText" | "highContrast" | "speech" // добавлен режим speech
}

export const AccessibilityButton = ({ className, variant = "icon", mode = "largeText" }: AccessibilityButtonProps) => {
  const {
    isLargeText,
    toggleLargeText,
    isHighContrast,
    toggleHighContrast,
    isSpeechEnabled, // получаем состояние озвучки
    toggleSpeech,
  } = useAccessibilityStore()

  useEffect(() => {
    if (isLargeText) {
      document.documentElement.classList.add("large-text")
    }
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast")
    }
  }, [isLargeText, isHighContrast])

  const isActive = mode === "largeText" ? isLargeText : mode === "highContrast" ? isHighContrast : isSpeechEnabled

  const toggle = mode === "largeText" ? toggleLargeText : mode === "highContrast" ? toggleHighContrast : toggleSpeech

  const Icon = mode === "largeText" ? Eye : mode === "speech" ? Volume2 : null

  const labels = {
    largeText: {
      active: "Обычный режим",
      inactive: "Для слабовидящих",
      titleActive: "Выключить режим для слабовидящих",
      titleInactive: "Включить режим для слабовидящих",
    },
    highContrast: {
      active: "Белым по чёрному",
      inactive: "Чёрным по белому",
      titleActive: "Выключить высококонтрастный режим",
      titleInactive: "Включить высококонтрастный режим",
    },
    speech: {
      active: "Выключить озвучку",
      inactive: "Озвучка страницы",
      titleActive: "Выключить озвучку страницы",
      titleInactive: "Включить озвучку страницы",
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
        {mode === "highContrast" ? (
          <ColorblindIcon isActive={isActive} />
        ) : (
          Icon && <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`} />
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
      {mode === "highContrast" ? (
        <ColorblindIcon isActive={isActive} />
      ) : (
        Icon && <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`} />
      )}
      <span className="sr-only">{isActive ? label.titleActive : label.titleInactive}</span>
    </Button>
  )
}
