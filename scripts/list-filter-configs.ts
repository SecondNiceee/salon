// scripts/list-filter-configs.ts
// Скрипт для вывода всех FilterConfig из базы данных
// Запуск: npx tsx scripts/list-filter-configs.ts

import "dotenv/config"
import { getPayload } from "payload"
import configPromise from "../src/payload.config"

async function main() {
  console.log("═".repeat(70))
  console.log("  СПИСОК ВСЕХ FILTER CONFIGS")
  console.log("═".repeat(70))

  // Инициализация Payload
  console.log("\n[INFO] Инициализация Payload...")
  const config = await configPromise
  const payload = await getPayload({ config })
  console.log("[OK] Payload инициализирован\n")

  // Получаем все FilterConfigs
  const { docs: filterConfigs } = await payload.find({
    collection: "filter-configs",
    limit: 1000,
    depth: 1, // Чтобы получить данные связанной категории
  })

  console.log(`Найдено FilterConfig: ${filterConfigs.length}\n`)
  console.log("─".repeat(70))

  for (const fc of filterConfigs) {
    const category = typeof fc.category === "object" ? fc.category : null
    const categoryName = category?.title || category?.value || fc.category
    
    console.log(`\n📁 Категория: ${categoryName}`)
    console.log(`   ID: ${fc.id}`)
    console.log(`   Включено: ${fc.isEnabled ? "✅ Да" : "❌ Нет"}`)
    
    const filters = fc.filters || []
    console.log(`   Фильтров: ${filters.length}`)
    
    if (filters.length > 0) {
      console.log("\n   Фильтры:")
      for (const filter of filters) {
        const typeLabels: Record<string, string> = {
          checkbox: "Чекбоксы",
          radio: "Радио",
          range: "Ползунок",
        }
        const typeLabel = typeLabels[filter.type || "checkbox"] || filter.type
        const advancedLabel = filter.isAdvanced ? " (доп.)" : ""
        
        console.log(`   ├─ ${filter.label} [key: ${filter.key}] — ${typeLabel}${advancedLabel}`)
        
        if (filter.type === "range") {
          console.log(`   │  └─ Диапазон: ${filter.rangeMin ?? 0} – ${filter.rangeMax ?? 120}, шаг: ${filter.rangeStep ?? 30}, ед.: ${filter.rangeUnit || "-"}`)
        } else {
          const options = filter.options || []
          for (let i = 0; i < options.length; i++) {
            const opt = options[i]
            const isLast = i === options.length - 1
            const prefix = isLast ? "└─" : "├─"
            console.log(`   │  ${prefix} ${opt.label} [${opt.value}]`)
            
            // Подопции
            const children = opt.children || []
            for (let j = 0; j < children.length; j++) {
              const child = children[j]
              const childPrefix = j === children.length - 1 ? "   └─" : "   ├─"
              console.log(`   │     ${childPrefix} ${child.label} [${child.value}]`)
            }
          }
        }
      }
    }
    
    console.log("\n" + "─".repeat(70))
  }

  console.log("\n[OK] Готово!\n")
  process.exit(0)
}

main().catch((err) => {
  console.error("[ERROR]", err)
  process.exit(1)
})
