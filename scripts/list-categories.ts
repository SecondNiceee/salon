// scripts/list-categories.ts
// Скрипт для вывода всех категорий и подкатегорий через REST API
// Запуск: pnpm list:categories

import "dotenv/config"

const API_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3000"

interface Category {
  id: string
  title: string
  value: string
  order?: number
  parent?: Category | string | null
}

interface CategoriesResponse {
  docs: Category[]
  totalDocs: number
}

async function fetchCategories(): Promise<Category[]> {
  const url = `${API_URL}/api/categories?depth=1&limit=0`

  console.log(`\nЗапрос к: ${url}\n`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`)
  }

  const data: CategoriesResponse = await response.json()
  return data.docs
}

function printCategories(categories: Category[]) {
  // Разделяем на родительские и дочерние
  const parentCategories = categories.filter(cat => !cat.parent)
  const childCategories = categories.filter(cat => cat.parent)
  
  // Сортируем по order
  parentCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
  
  console.log("=" .repeat(60))
  console.log("КАТЕГОРИИ И ПОДКАТЕГОРИИ")
  console.log("=" .repeat(60))
  
  for (const parent of parentCategories) {
    console.log(`\n[${parent.value}] ${parent.title}`)
    console.log(`   ID: ${parent.id}, Order: ${parent.order || 0}`)
    
    // Находим подкатегории этой категории
    const children = childCategories.filter(child => {
      const parentId = typeof child.parent === "object" ? child.parent?.id : child.parent
      return parentId === parent.id
    })
    
    children.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    if (children.length > 0) {
      console.log("   Подкатегории:")
      for (const child of children) {
        console.log(`      - [${child.value}] ${child.title} (order: ${child.order || 0})`)
      }
    } else {
      console.log("   (нет подкатегорий)")
    }
  }
  
  console.log("\n" + "=" .repeat(60))
  console.log(`Всего категорий: ${parentCategories.length}`)
  console.log(`Всего подкатегорий: ${childCategories.length}`)
  console.log("=" .repeat(60))
}

async function main() {
  try {
    console.log("Загрузка категорий...")
    const categories = await fetchCategories()
    printCategories(categories)
  } catch (error) {
    console.error("Ошибка:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
