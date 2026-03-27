// scripts/list-categories.ts
// Скрипт для вывода всех категорий и подкатегорий через Payload Local API
// Запуск: pnpm list:categories

import "dotenv/config"
import { getPayload } from "payload"
import configPromise from "../src/payload.config"

const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || "42a7038a6aa3db05199544b1"

// Резолвим Promise от buildConfig и добавляем secret
async function getConfig() {
  const config = await configPromise
  return { ...config, secret: PAYLOAD_SECRET }
}

// ---------------------------------------------------------------------------
// Логирование
// ---------------------------------------------------------------------------
const log = {
  info: (msg: string) => console.log(`[INFO]  ${msg}`),
  success: (msg: string) => console.log(`[OK]    ${msg}`),
  warn: (msg: string) => console.warn(`[WARN]  ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  divider: () => console.log("─".repeat(70)),
  header: (title: string) => {
    console.log("\n" + "═".repeat(70))
    console.log(`  ${title}`)
    console.log("═".repeat(70))
  },
}

// ---------------------------------------------------------------------------
// Типы
// ---------------------------------------------------------------------------

interface Category {
  id: number
  title: string
  value: string
  order?: number
  parent?: Category | number | null
}

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

async function main() {
  log.header("СПИСОК КАТЕГОРИЙ (Payload Local API)")

  // Инициализация Payload
  log.info("Инициализация Payload...")
  const config = await getConfig()
  const payload = await getPayload({ config })
  log.success("Payload инициализирован")

  log.divider()

  // Получить все категории
  log.info("Получение списка категорий...")
  const result = await payload.find({
    collection: "categories",
    limit: 0, // Все записи
    depth: 1,
    overrideAccess: true,
  })

  const categories = result.docs as Category[]
  log.info(`Найдено категорий: ${categories.length}`)

  // Разделяем на родительские и дочерние
  const parentCategories = categories.filter(cat => !cat.parent)
  const childCategories = categories.filter(cat => cat.parent)

  // Сортируем по order
  parentCategories.sort((a, b) => (a.order || 0) - (b.order || 0))

  log.divider()
  console.log("\nКатегории верхнего уровня (parent = null):")
  log.divider()

  for (const parent of parentCategories) {
    console.log(`\n[${parent.id}] ${parent.value}`)
    console.log(`    title: "${parent.title}"`)
    console.log(`    order: ${parent.order || 0}`)

    // Находим подкатегории этой категории
    const children = childCategories.filter(child => {
      const parentId = typeof child.parent === "object" ? child.parent?.id : child.parent
      return parentId === parent.id
    })

    children.sort((a, b) => (a.order || 0) - (b.order || 0))

    if (children.length > 0) {
      console.log(`    Подкатегории: ${children.length}`)
      children.forEach((child, idx) => {
        const prefix = idx === children.length - 1 ? "└──" : "├──"
        console.log(`      ${prefix} [${child.id}] ${child.value} - "${child.title}"`)
      })
    } else {
      console.log("    Подкатегории: 0")
    }
  }

  log.header("ИТОГИ")
  log.info(`Категорий верхнего уровня: ${parentCategories.length}`)
  log.info(`Подкатегорий: ${childCategories.length}`)
  log.info(`Всего: ${categories.length}`)

  process.exit(0)
}

main().catch((err) => {
  log.error(`Критическая ошибка: ${err.message}`)
  console.error(err)
  process.exit(1)
})
