// scripts/seed-filter-configs.ts
// Скрипт для создания FilterConfig для всех категорий через Payload Local API
// Запуск: pnpm seed:filters

import "dotenv/config"
import { getPayload } from "payload"
import config from "../src/payload.config"

const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || "42a7038a6aa3db05199544b1"

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
  created: 0,
  updated: 0,
  skipped: 0,
  errors: 0,
}

// ---------------------------------------------------------------------------
// Типы
// ---------------------------------------------------------------------------

interface FilterOption {
  value: string
  label: string
}

interface FilterField {
  key: string
  label: string
  type: "checkbox" | "radio"
  isAdvanced: boolean
  options: FilterOption[]
}

interface FilterConfigPayload {
  categoryValue: string // значение (value) категории — используется для поиска ID
  filters: FilterField[]
}

// ---------------------------------------------------------------------------
// Описания фильтров по категориям
// ---------------------------------------------------------------------------

const filterConfigs: FilterConfigPayload[] = [
  // ─── Курсы массажа ───────────────────────────────────────────────────────
  {
    categoryValue: "kursy-massage",
    filters: [
      {
        key: "goal",
        label: "Ваша цель",
        type: "radio",
        isAdvanced: false,
        options: [
          { value: "beginner", label: "Для начинающих (с нуля)" },
          { value: "professional", label: "Для профессионалов (повышение квалификации)" },
        ],
      },
      {
        key: "direction",
        label: "Направление массажа",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "classic", label: "Классический" },
          { value: "sport", label: "Спортивный" },
          { value: "medical", label: "Лечебный (медицинский)" },
          { value: "anticellulite", label: "Антицеллюлитный (косметологический)" },
          { value: "children", label: "Детский (медицинский или профилактический)" },
        ],
      },
      {
        key: "document",
        label: "Документ об окончании",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "diploma", label: "Диплом" },
          { value: "certificate_prof", label: "Удостоверение" },
          { value: "certificate", label: "Сертификат" },
        ],
      },
      {
        key: "education",
        label: "Требования к образованию",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "medical_required", label: "Медицинское образование обязательно (для лечебных курсов)" },
          { value: "no_requirements", label: "Без требований" },
        ],
      },
      {
        key: "format",
        label: "Формат обучения",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "offline", label: "Очный (в группе или индивидуально)" },
          { value: "online", label: "Онлайн / Дистанционный" },
        ],
      },
      {
        key: "extra",
        label: "Дополнительные опции",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "employment_help", label: "Помощь с трудоустройством" },
        ],
      },
    ],
  },

  // ─── Курсы косметологии ──────────────────────────────────────────────────
  {
    categoryValue: "kursy-kosmetologa",
    filters: [
      {
        key: "goal",
        label: "Цель / Уровень подготовки",
        type: "radio",
        isAdvanced: false,
        options: [
          { value: "beginner", label: "Для начинающих (с нуля)" },
          { value: "professional", label: "Для практикующих специалистов" },
        ],
      },
      {
        key: "direction",
        label: "Основное направление",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "aesthetic", label: "Эстетическая косметология" },
          { value: "medical", label: "Медицинская косметология" },
        ],
      },
      {
        key: "education",
        label: "Требования к образованию",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "medical_required", label: "Требуется медицинское образование" },
          { value: "no_requirements", label: "Без требований к образованию" },
        ],
      },
      {
        key: "document",
        label: "Документ по окончании",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "diploma", label: "Диплом" },
          { value: "specialist_cert", label: "Свидетельство специалиста" },
          { value: "certificate_prof", label: "Удостоверение" },
          { value: "certificate", label: "Сертификат" },
        ],
      },
      {
        key: "extra",
        label: "Дополнительные опции",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "employment_help", label: "Помощь с трудоустройством" },
        ],
      },
    ],
  },

  // ─── Курсы тату ──────────────────────────────────────────────────────────
  {
    categoryValue: "kursy-tattoo",
    filters: [
      {
        key: "goal",
        label: "Цель / Уровень подготовки",
        type: "radio",
        isAdvanced: false,
        options: [
          { value: "beginner", label: "Для начинающих (с нуля)" },
          { value: "professional", label: "Повышение квалификации" },
        ],
      },
      {
        key: "direction",
        label: "Направление / Стиль тату",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "realism", label: "Реализм" },
          { value: "linework", label: "Лайнворк / Графика" },
          { value: "watercolor", label: "Акварель" },
          { value: "traditional", label: "Олдскул / Традиционный" },
          { value: "blackwork", label: "Блэкворк / Орнаментал" },
          { value: "microtatoo", label: "Микро-тату / Минимализм" },
          { value: "cover_up", label: "Перекрытие (cover-up)" },
        ],
      },
      {
        key: "document",
        label: "Документ по окончании",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "diploma", label: "Диплом" },
          { value: "certificate_prof", label: "Удостоверение" },
          { value: "certificate", label: "Сертификат" },
        ],
      },
      {
        key: "format",
        label: "Формат обучения",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "offline", label: "Очный (индивидуально или в группе)" },
          { value: "online", label: "Онлайн / Дистанционный" },
        ],
      },
      {
        key: "equipment",
        label: "Оборудование",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "included", label: "Материалы включены в стоимость" },
          { value: "not_included", label: "Материалы не включены" },
        ],
      },
      {
        key: "extra",
        label: "Дополнительные опции",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "employment_help", label: "Помощь с трудоустройством" },
          { value: "portfolio_help", label: "Помощь с портфолио" },
        ],
      },
    ],
  },

  // ─── СПА (spa-main) ──────────────────────────────────────────────────────
  {
    categoryValue: "spa-main",
    filters: [
      {
        key: "procedure_type",
        label: "Тип процедуры",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "massage", label: "Массаж" },
          { value: "wrap", label: "Обертывание (SPA-обертывания)" },
          { value: "scrub", label: "Скрабирование" },
          { value: "ayurveda", label: "Аюрведические процедуры" },
        ],
      },
      {
        key: "goal",
        label: "Основная цель",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "relax", label: "Расслабление и релакс" },
          { value: "stress_relief", label: "Снятие стресса" },
          { value: "body_correction", label: "Коррекция фигуры и детокс" },
          { value: "energy", label: "Восстановление энергии" },
        ],
      },
      {
        key: "audience",
        label: "Рекомендуемая аудитория",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "women", label: "Для женщин" },
          { value: "men", label: "Для мужчин" },
          { value: "couple", label: "Для двоих (для пары)" },
          { value: "gift", label: "В подарок (подарочный сертификат)" },
        ],
      },
      {
        key: "features",
        label: "Особенности",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "medical_specialist", label: "Специалист с медицинским образованием" },
          { value: "premium_products", label: "Используются премиум-средства" },
        ],
      },
    ],
  },

  // ─── Массаж (massage-main) ───────────────────────────────────────────────
  {
    categoryValue: "massage-main",
    filters: [
      {
        key: "massage_type",
        label: "Вид массажа",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "face", label: "Массаж лица" },
          { value: "body", label: "Массаж тела (Классический, Релаксирующий, Спортивный, Лимфодренажный)" },
          { value: "spa_massage", label: "СПА-массаж" },
          { value: "children", label: "Детский массаж (Лечебный / Профилактический)" },
          { value: "hardware", label: "Аппаратный массаж (Вакуумный, Роликовый и др.)" },
          { value: "body_correction", label: "Массаж для коррекции фигуры" },
        ],
      },
      {
        key: "goal",
        label: "Основная цель",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "relax", label: "Расслабление и снятие стресса" },
          { value: "anticellulite", label: "Коррекция фигуры, антицеллюлитный" },
          { value: "recovery", label: "Восстановление после нагрузок" },
          { value: "health", label: "Оздоровление и улучшение тонуса" },
          { value: "rejuvenation", label: "Омоложение и уход за кожей лица" },
        ],
      },
      {
        key: "audience",
        label: "Целевая аудитория / Особенности",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "adults", label: "Для взрослых" },
          { value: "men", label: "Для мужчины" },
          { value: "women", label: "Для женщины" },
          { value: "couple", label: "Для двоих" },
          { value: "children", label: "Детский массаж (Лечебный / Профилактический)" },
          { value: "medical_specialist", label: "Специалист с медицинским образованием" },
        ],
      },
      {
        key: "format",
        label: "Формат услуги",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "single", label: "Разовая процедура" },
          { value: "course", label: "Курс процедур (абонемент)" },
        ],
      },
    ],
  },

  // ─── Подарочные сертификаты (gifts) ─────────────────────────────────────
  {
    categoryValue: "gifts",
    filters: [
      {
        key: "recipient",
        label: "Кому",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "women", label: "Для женщины" },
          { value: "men", label: "Для мужчины" },
          { value: "couple", label: "Для пары" },
          { value: "children", label: "Для ребёнка" },
        ],
      },
      {
        key: "service_type",
        label: "Тип услуги",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "massage", label: "Массаж" },
          { value: "spa", label: "СПА-программа" },
          { value: "cosmetology", label: "Косметология" },
          { value: "tattoo", label: "Тату" },
          { value: "course", label: "Обучающий курс" },
        ],
      },
      {
        key: "format",
        label: "Формат сертификата",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "electronic", label: "Электронный (онлайн-отправка)" },
          { value: "physical", label: "Бумажный (курьерская доставка)" },
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now()

  log.header("СИДИРОВАНИЕ FILTER CONFIGS (Payload Local API)")

  // Инициализация Payload
  log.info("Инициализация Payload...")
  const payload = await getPayload({ config, secret: PAYLOAD_SECRET })
  log.success("Payload инициализирован")
  
  log.info(`Количество категорий для обработки: ${filterConfigs.length}`)

  for (let i = 0; i < filterConfigs.length; i++) {
    const filterConfig = filterConfigs[i]
    log.divider()
    log.info(`[${i + 1}/${filterConfigs.length}] Обработка категории: ${filterConfig.categoryValue}`)

    // Найти категорию по value
    const categoryResult = await payload.find({
      collection: "categories",
      where: { value: { equals: filterConfig.categoryValue } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (!categoryResult.docs || categoryResult.docs.length === 0) {
      log.warn(`Категория не найдена: value="${filterConfig.categoryValue}"`)
      stats.skipped++
      continue
    }

    const category = categoryResult.docs[0]
    log.success(`Категория найдена: ID=${category.id}, title="${category.title || filterConfig.categoryValue}"`)

    // Проверяем существующий FilterConfig
    const existingResult = await payload.find({
      collection: "filter-configs",
      where: { category: { equals: category.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    log.info(`Количество фильтров: ${filterConfig.filters.length}`)
    filterConfig.filters.forEach((f, idx) => {
      log.info(`  [${idx + 1}] ${f.key}: "${f.label}" (${f.type}, ${f.isAdvanced ? "расширенный" : "основной"}, ${f.options.length} опций)`)
    })

    if (existingResult.docs && existingResult.docs.length > 0) {
      // UPDATE
      const existingId = existingResult.docs[0].id
      log.info(`Найден существующий FilterConfig: ID=${existingId}`)
      log.info(`Обновление FilterConfig...`)

      try {
        await payload.update({
          collection: "filter-configs",
          id: existingId,
          data: {
            category: category.id,
            filters: filterConfig.filters,
          },
          overrideAccess: true,
        })
        log.success(`[UPDATE] Обновлён filter-config ID=${existingId} для [${filterConfig.categoryValue}]`)
        stats.updated++
      } catch (err) {
        log.error(`[UPDATE] Ошибка обновления filter-config для [${filterConfig.categoryValue}]: ${(err as Error).message}`)
        stats.errors++
      }
    } else {
      // CREATE
      log.info(`Существующий FilterConfig не найден, создаём новый...`)

      try {
        const created = await payload.create({
          collection: "filter-configs",
          data: {
            category: category.id,
            filters: filterConfig.filters,
          },
          overrideAccess: true,
        })
        log.success(`[CREATE] Создан filter-config ID=${created.id} для [${filterConfig.categoryValue}]`)
        stats.created++
      } catch (err) {
        log.error(`[CREATE] Ошибка создания filter-config для [${filterConfig.categoryValue}]: ${(err as Error).message}`)
        stats.errors++
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)

  log.header("ИТОГИ")
  log.info(`Создано:    ${stats.created}`)
  log.info(`Обновлено:  ${stats.updated}`)
  log.info(`Пропущено:  ${stats.skipped}`)
  log.info(`Ошибок:     ${stats.errors}`)
  log.divider()
  log.info(`Время выполнения: ${elapsed} сек.`)

  if (stats.errors > 0) {
    log.error("Завершено с ошибками!")
    process.exit(1)
  } else {
    log.success("Успешно завершено!")
    process.exit(0)
  }
}

main().catch((err) => {
  log.error(`Критическая ошибка: ${err.message}`)
  console.error(err)
  process.exit(1)
})
