// scripts/delete-filter-configs.ts
// Скрипт для удаления ВСЕХ FilterConfig через Payload Local API
// Запуск: pnpm delete:filters

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

// Статистика
const stats = {
  deleted: 0,
  errors: 0,
}

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now()

  log.header("УДАЛЕНИЕ ВСЕХ FILTER CONFIGS (Payload Local API)")

  // Инициализация Payload
  log.info("Инициализация Payload...")
  const config = await getConfig()
  const payload = await getPayload({ config })
  log.success("Payload инициализирован")

  log.divider()

  // Получить все FilterConfigs
  log.info("Получение списка всех FilterConfigs...")
  const result = await payload.find({
    collection: "filter-configs",
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })

  const configs = result.docs
  log.info(`Найдено FilterConfigs: ${configs.length}`)

  if (configs.length === 0) {
    log.info("Нет FilterConfigs для удаления.")
    log.success("Завершено!")
    process.exit(0)
  }

  log.divider()
  log.info(`Начинаем удаление ${configs.length} записей...`)
  log.divider()

  for (let i = 0; i < configs.length; i++) {
    const doc = configs[i]
    
    // Получить информацию о категории
    let categoryInfo = "без категории"
    if (doc.category) {
      if (typeof doc.category === "number") {
        categoryInfo = `categoryId=${doc.category}`
      } else if (typeof doc.category === "object" && doc.category !== null) {
        const cat = doc.category as { id?: number; value?: string; title?: string }
        categoryInfo = cat.value || cat.title || `categoryId=${cat.id}`
      }
    }

    log.info(`[${i + 1}/${configs.length}] Удаление ID=${doc.id}, категория: ${categoryInfo}`)

    try {
      await payload.delete({
        collection: "filter-configs",
        id: doc.id,
        overrideAccess: true,
      })
      log.success(`Удалён FilterConfig ID=${doc.id} (${categoryInfo})`)
      stats.deleted++
    } catch (err) {
      log.error(`Ошибка удаления ID=${doc.id} (${categoryInfo}): ${(err as Error).message}`)
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
    process.exit(0)
  }
}

main().catch((err) => {
  log.error(`Критическая ошибка: ${err.message}`)
  console.error(err)
  process.exit(1)
})
