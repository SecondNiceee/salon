"use client"
import { useEffect, useCallback, useRef } from "react"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"

export const useSpeechSynthesis = () => {
  const { isSpeechEnabled } = useAccessibilityStore()
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Получаем текст страницы для озвучки
  const getPageText = useCallback(() => {
    const mainContent = document.querySelector("main") || document.body

    // Выбираем элементы для озвучки (заголовки, параграфы, списки, кнопки)
    const elements = mainContent.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, li, a, button, label, span[role='text'], [aria-label]",
    )

    const textParts: string[] = []

    elements.forEach((el) => {
      // Пропускаем скрытые элементы и элементы только для screen reader
      if (
        el.closest("[aria-hidden='true']") ||
        el.classList.contains("sr-only") ||
        (el as HTMLElement).offsetParent === null
      ) {
        return
      }

      const ariaLabel = el.getAttribute("aria-label")
      const text = ariaLabel || el.textContent?.trim()

      if (text && text.length > 0) {
        textParts.push(text)
      }
    })

    // Убираем дубликаты и объединяем
    return [...new Set(textParts)].join(". ")
  }, [])

  // Озвучиваем текст
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis не поддерживается в этом браузере")
      return
    }

    // Останавливаем предыдущую озвучку
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ru-RU" // Русский язык
    utterance.rate = 0.9 // Скорость (0.1 - 10)
    utterance.pitch = 1 // Высота голоса (0 - 2)
    utterance.volume = 1 // Громкость (0 - 1)

    // Пытаемся найти русский голос
    const voices = window.speechSynthesis.getVoices()
    const russianVoice = voices.find(
      (voice) => voice.lang.startsWith("ru") || voice.name.toLowerCase().includes("russian"),
    )
    if (russianVoice) {
      utterance.voice = russianVoice
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  // Останавливаем озвучку
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Озвучиваем страницу при включении
  useEffect(() => {
    if (isSpeechEnabled) {
      // Небольшая задержка для загрузки голосов
      const timer = setTimeout(() => {
        const text = getPageText()
        if (text) {
          speak(text)
        }
      }, 500)

      return () => {
        clearTimeout(timer)
        stop()
      }
    } else {
      stop()
    }
  }, [isSpeechEnabled, getPageText, speak, stop])

  // Загружаем голоса при монтировании
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Голоса загружаются асинхронно
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  }, [])

  return {
    speak,
    stop,
    speakPage: () => speak(getPageText()),
    isSpeechEnabled,
  }
}
