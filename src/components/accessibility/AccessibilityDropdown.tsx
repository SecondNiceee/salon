"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccessibilityButton } from "./AccessibilityButton"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"

export const AccessibilityDropdown = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isLargeText, isHighContrast, isSpeechEnabled } = useAccessibilityStore()

  const isAnyActive = isLargeText || isHighContrast || isSpeechEnabled

  // Закрытие при клике вне dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef} data-speech-control>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className={`p-2 bg-transparent shrink-0 ${isAnyActive ? "border-blue-600 bg-blue-50" : ""}`}
        title="Режимы доступности"
      >
        <Eye className={`h-5 w-5 ${isAnyActive ? "text-blue-600" : ""}`} />
        <span className="sr-only">Режимы доступности</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-[9999] min-w-[200px] space-y-1">
          <AccessibilityButton variant="full" mode="largeText" className="w-full" />
          <AccessibilityButton variant="full" mode="highContrast" className="w-full" />
          <AccessibilityButton variant="full" mode="speech" className="w-full" />
        </div>
      )}
    </div>
  )
}
