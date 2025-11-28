export interface CityDeclensions {
  nominative: string // именительный - Москва
  genitive: string // родительный - Москвы
  prepositional: string // предложный - в Москве
}

export function getCityDeclensions(city: string): CityDeclensions {
  // Простая логика склонения (можно расширить при необходимости)
  // Здесь мы предполагаем, что city уже приходит в нужном формате или просто дублируем его,
  // так как полноценное склонение на русском языке требует сложной библиотеки или словаря.
  // В текущей реализации, если city - это просто строка, мы используем её как есть,
  // а предложный падеж формируем добавлением предлога "в ".

  // TODO: Интегрировать библиотеку склонения или словарь городов, если требуется точность.
  // Пока используем упрощенную логику или заглушку, так как ранее логика склонения была на клиенте или в другом месте.

  // Если city уже содержит предлоги (что вряд ли), очищаем
  const cleanCity = city.replace(/^в\s+/i, "")

  return {
    nominative: cleanCity,
    genitive: cleanCity, // Временное упрощение, так как нет словаря
    prepositional: `в ${cleanCity}`,
  }
}

/**
 * Заменяет переменные города в тексте
 * /city - именительный падеж (Москва)
 * /city/r - родительный падеж (Москвы)
 * /city/p - предложный падеж (в Москве)
 */
export function replaceCityVariables(text: string, city: CityDeclensions | null): string {
  if (!city || !text) return text

  return text
    .replace(/\/city\/p/g, city.prepositional)
    .replace(/\/city\/r/g, city.genitive)
    .replace(/\/city/g, city.nominative)
}

/**
 * Заменяет переменные города в Rich Text content
 * Усовершенствована для обработки вложенных объектов и массивов (включая блоки типа IconCardsBlock)
 */
export function replaceCityInRichText(content: any, city: CityDeclensions | null): any {
  if (!content || !city) return content

  // Создаем глубокую копию для избежания мутации
  const processedContent = JSON.parse(JSON.stringify(content))

  const processedNodes = new WeakSet()

  function processNode(node: any): any {
    if (!node || typeof node !== "object") return node

    if (processedNodes.has(node)) {
      return node
    }
    processedNodes.add(node)

    // Обрабатываем текстовые узлы
    if (node.text && typeof node.text === "string") {
      node.text = replaceCityVariables(node.text, city)
    }

    // Обрабатываем fields
    if (node.fields) {
      Object.keys(node.fields).forEach((key) => {
        const field = node.fields[key]
        if (typeof field === "string") {
          node.fields[key] = replaceCityVariables(field, city)
        } else if (Array.isArray(field)) {
          node.fields[key] = field.map((item) => processNode(item))
        } else if (field && typeof field === "object") {
          processNode(field)
        }
      })
    }

    const skipKeys = new Set(["text", "fields", "children", "root"])

    Object.keys(node).forEach((key) => {
      if (skipKeys.has(key)) {
        return // Эти ключи обрабатываются отдельно
      }

      const value = node[key]

      if (typeof value === "string") {
        node[key] = replaceCityVariables(value, city)
      } else if (Array.isArray(value)) {
        node[key] = value.map((item) => {
          if (typeof item === "string") {
            return replaceCityVariables(item, city)
          } else if (item && typeof item === "object") {
            return processNode(item)
          }
          return item
        })
      } else if (value && typeof value === "object") {
        processNode(value)
      }
    })

    // Рекурсивно обрабатываем дочерние узлы (только один раз)
    if (Array.isArray(node.children)) {
      node.children = node.children.map((child: any) => processNode(child))
    }

    // Обрабатываем root (только один раз)
    if (node.root && typeof node.root === "object" && !processedNodes.has(node.root)) {
      processNode(node.root)
    }

    return node
  }

  return processNode(processedContent)
}
