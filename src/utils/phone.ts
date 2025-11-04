/**
 * Утилиты для работы с номерами телефонов
 */

/**
 * Форматирует номер телефона в маску +7 (XXX) XXX-XX-XX
 */
export const formatPhoneNumber = (value: string): string => {
  // Удаляем всё, кроме цифр
  const digitsOnly = value.replace(/\D/g, "")

  // Если нет цифр — возвращаем пустую строку
  if (!digitsOnly) {
    return ""
  }

  // Нормализуем номер (заменяем 8 на 7, добавляем 7 если нет)
  let normalized = digitsOnly
  if (normalized.startsWith("8")) {
    normalized = "7" + normalized.slice(1)
  } else if (!normalized.startsWith("7")) {
    normalized = "7" + normalized
  }

  // Ограничиваем до 11 цифр
  normalized = normalized.slice(0, 11)

  // Форматируем по частям
  let formatted = "+7"

  if (normalized.length > 1) {
    const area = normalized.slice(1, 4)
    formatted += ` (${area}`

    if (normalized.length > 4) {
      formatted += ") "
      const middle = normalized.slice(4, 7)
      formatted += middle

      if (normalized.length > 7) {
        formatted += "-"
        const part1 = normalized.slice(7, 9)
        formatted += part1

        if (normalized.length > 9) {
          formatted += "-"
          const part2 = normalized.slice(9, 11)
          formatted += part2
        }
      }
    }
  }

  return formatted
}

/**
 * Валидирует номер телефона
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || phone.trim() === "") {
    return { isValid: false, error: "Номер телефона обязателен" }
  }

  // Удаляем все символы кроме цифр для проверки
  const digitsOnly = phone.replace(/\D/g, "")

  // Проверяем длину (должно быть 11 цифр)
  if (digitsOnly.length !== 11) {
    return { isValid: false, error: "Номер должен содержать 11 цифр" }
  }

  // Проверяем, что начинается с 7 или 8
  if (!digitsOnly.startsWith("7") && !digitsOnly.startsWith("8")) {
    return { isValid: false, error: "Номер должен начинаться с 7 или 8" }
  }

  // Проверяем код оператора (не может начинаться с 0 или 1)
  const operatorCode = digitsOnly.slice(1, 4)
  if (operatorCode.startsWith("0") || operatorCode.startsWith("1")) {
    return { isValid: false, error: "Неверный код оператора" }
  }

  const hasCorrectStructure = phone.startsWith("+7") && digitsOnly.length === 11
  if (!hasCorrectStructure) {
    return { isValid: false, error: "Неверный формат номера" }
  }

  return { isValid: true }
}

export const normalizePhone = (phone: string): string => {
  if (!phone) return ""

  // Удаляем все символы кроме цифр
  const digitsOnly = phone.replace(/\D/g, "")

  // Если номер начинается с 7, заменяем на 8
  if (digitsOnly.startsWith("7") && digitsOnly.length === 11) {
    return "8" + digitsOnly.slice(1)
  }

  // Если номер начинается с 8, возвращаем как есть
  if (digitsOnly.startsWith("8") && digitsOnly.length === 11) {
    return digitsOnly
  }

  return digitsOnly
}
