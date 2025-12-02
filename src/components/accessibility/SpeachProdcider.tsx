"use client"
import { useEffect, useCallback } from "react"
import type React from "react"

import { usePathname } from "next/navigation"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"

/**
 * Провайдер для автоматической озвучки при смене страницы
 * и озвучки текста по клику когда включен режим озвучки
 */
export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const { isSpeechEnabled, speakPage, stop, speak } = useSpeechSynthesis()

  const getTextFromElement = useCallback((element: HTMLElement): string => {
    // Проверяем aria-label
    const ariaLabel = element.getAttribute("aria-label")
    if (ariaLabel) return ariaLabel

    // Получаем текстовое содержимое
    const text = element.innerText || element.textContent || ""
    return text.trim()
  }, [])

  useEffect(() => {
    if (!isSpeechEnabled) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Пропускаем кнопки управления озвучкой, dropdown и все элементы accessibility
      if (
        target.closest("[data-speech-control]") ||
        target.closest(".accessibility-dropdown") ||
        target.closest('[title="Режимы доступности"]') ||
        target.closest("button")?.querySelector(".lucide-eye")
      ) {
        return
      }

      // Получаем текст из кликнутого элемента
      let textToSpeak = getTextFromElement(target)

      // Если текст пустой, пробуем получить из родительского элемента
      if (!textToSpeak && target.parentElement) {
        textToSpeak = getTextFromElement(target.parentElement)
      }

      // Озвучиваем если есть текст
      if (textToSpeak && textToSpeak.length > 0) {
        stop() // Останавливаем предыдущую озвучку
        speak(textToSpeak)
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [isSpeechEnabled, speak, stop, getTextFromElement])

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
