export interface CityDeclensions {
    nominative: string // именительный - Москва
    genitive: string // родительный - Москвы
    prepositional: string // предложный - в Москве
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
   */
  export function replaceCityInRichText(content: any, city: CityDeclensions | null): any {
    if (!content || !city) return content
  
    // Создаем глубокую копию для избежания мутации
    const processedContent = JSON.parse(JSON.stringify(content))
  
    function processNode(node: any): any {
      if (!node) return node
  
      // Обрабатываем текстовые узлы
      if (node.text && typeof node.text === "string") {
        node.text = replaceCityVariables(node.text, city)
      }
  
      // Обрабатываем поля в блоках
      if (node.fields) {
        Object.keys(node.fields).forEach((key) => {
          const field = node.fields[key]
          if (typeof field === "string") {
            node.fields[key] = replaceCityVariables(field, city)
          } else if (field && typeof field === "object") {
            processNode(field)
          }
        })
      }
  
      // Рекурсивно обрабатываем дочерние узлы
      if (Array.isArray(node.children)) {
        node.children = node.children.map((child: any) => processNode(child))
      }
  
      // Обрабатываем root
      if (node.root && node.root.children) {
        node.root.children = node.root.children.map((child: any) => processNode(child))
      }
  
      return node
    }
  
    return processNode(processedContent)
  }
  