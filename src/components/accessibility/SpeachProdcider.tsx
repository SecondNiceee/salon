"use client"
import { useEffect } from "react"
import type React from "react"

import { usePathname } from "next/navigation"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"

/**
 * Провайдер для автоматической озвучки при смене страницы
 * Добавьте в layout.tsx для включения озвучки на всех страницах
 */
export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const { isSpeechEnabled, speakPage, stop } = useSpeechSynthesis()

  // Озвучиваем при смене страницы
  useEffect(() => {
    if (isSpeechEnabled) {
      // Задержка для загрузки контента страницы
      const timer = setTimeout(() => {
        speakPage()
      }, 800)

      return () => {
        clearTimeout(timer)
        stop()
      }
    }
  }, [pathname, isSpeechEnabled, speakPage, stop])

  return <>{children}</>
}
