// scripts/delete-filter-configs.ts
// Скрипт для удаления ВСЕХ FilterConfig через REST API
// Запуск: pnpm delete:filters

import "dotenv/config"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
const API_KEY = process.env.PAYLOAD_API_KEY

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

// Статистика
const stats = {
  deleted: 0,
  errors: 0,
}

// ---------------------------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------------------------

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { Authorization: `users ${API_KEY}` } : {}),
  }
}

interface FilterConfigDoc {
  id: number
  category?: {
    id: number
    value?: string
    title?: string
  } | number
}

async function fetchAllFilterConfigs(): Promise<FilterConfigDoc[]> {
  const url = `${BASE_URL}/api/filter-configs?limit=100&depth=1`
  log.info(`Получение списка FilterConfigs: GET ${url}`)

  const res = await fetch(url, { headers: headers() })
  if (!res.ok) {
    log.error(`Ошибка получения списка: ${res.status} ${res.statusText}`)
    return []
  }

  const data = await res.json()
  log.info(`Найдено FilterConfigs: ${data.docs?.length ?? 0}`)
  return data.docs || []
}

async function deleteFilterConfig(id: number, categoryInfo: string): Promise<boolean> {
  const url = `${BASE_URL}/api/filter-configs/${id}`
  log.info(`Удаление: DELETE ${url}`)

  const res = await fetch(url, { method: "DELETE", headers: headers() })
  if (!res.ok) {
    const text = await res.text()
    log.error(`Ошибка удаления ID=${id} (${categoryInfo}): ${res.status} — ${text}`)
    return false
  }

  log.success(`Удалён FilterConfig ID=${id} (${categoryInfo})`)
  return true
}

function getCategoryInfo(doc: FilterConfigDoc): string {
  if (!doc.category) return "без категории"
  if (typeof doc.category === "number") return `categoryId=${doc.category}`
  return doc.category.value || doc.category.title || `categoryId=${doc.category.id}`
}

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now()

  log.header("УДАЛЕНИЕ ВСЕХ FILTER CONFIGS")
  log.info(`Сервер: ${BASE_URL}`)
  log.info(`API Key: ${API_KEY ? "установлен" : "НЕ УСТАНОВЛЕН"}`)

  if (!API_KEY) {
    log.warn("PAYLOAD_API_KEY не задан. Запрос может завершиться ошибкой 403.")
  }

  log.divider()

  const configs = await fetchAllFilterConfigs()

  if (configs.length === 0) {
    log.info("Нет FilterConfigs для удаления.")
    log.success("Завершено!")
    return
  }

  log.divider()
  log.info(`Начинаем удаление ${configs.length} записей...`)
  log.divider()

  for (let i = 0; i < configs.length; i++) {
    const doc = configs[i]
    const categoryInfo = getCategoryInfo(doc)
    log.info(`[${i + 1}/${configs.length}] ID=${doc.id}, категория: ${categoryInfo}`)

    const success = await deleteFilterConfig(doc.id, categoryInfo)
    if (success) {
      stats.deleted++
    } else {
      stats.errors++
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)

  log.header("ИТОГИ")
  log.info(`Удалено:  ${stats.deleted}`)
  log.info(`Ошибок:   ${stats.errors}`)
  log.divider()
  log.info(`Время выполнения: ${elapsed} сек.`)

  if (stats.errors > 0) {
    log.error("Завершено с ошибками!")
    process.exit(1)
  } else {
    log.success("Все FilterConfigs успешно удалены!")
  }
}

main().catch((err) => {
  log.error(`Критическая ошибка: ${err.message}`)
  console.error(err)
  process.exit(1)
})
