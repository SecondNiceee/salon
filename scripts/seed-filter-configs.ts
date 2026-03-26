// scripts/seed-filter-configs.ts
// Скрипт для создания FilterConfig для всех категорий через REST API
// Запуск: pnpm seed:filters

import "dotenv/config"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
const API_KEY = process.env.PAYLOAD_API_KEY

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
// Вспомогательные функции
// ---------------------------------------------------------------------------

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { Authorization: `users ${API_KEY}` } : {}),
  }
}

async function fetchCategoryIdByValue(value: string): Promise<number | null> {
  const url = `${BASE_URL}/api/categories?where[value][equals]=${encodeURIComponent(value)}&limit=1&depth=0`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) {
    console.error(`  Ошибка получения категории [${value}]: ${res.status} ${res.statusText}`)
    return null
  }
  const data = await res.json()
  if (!data.docs || data.docs.length === 0) {
    console.warn(`  Категория не найдена: value="${value}"`)
    return null
  }
  return data.docs[0].id as number
}

async function findExistingFilterConfig(categoryId: number): Promise<number | null> {
  const url = `${BASE_URL}/api/filter-configs?where[category][equals]=${categoryId}&limit=1&depth=0`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.docs || data.docs.length === 0) return null
  return data.docs[0].id as number
}

async function upsertFilterConfig(categoryId: number, filters: FilterField[], categoryValue: string): Promise<void> {
  const existingId = await findExistingFilterConfig(categoryId)

  const body = JSON.stringify({ category: categoryId, filters })

  if (existingId) {
    // UPDATE
    const url = `${BASE_URL}/api/filter-configs/${existingId}`
    const res = await fetch(url, { method: "PATCH", headers: headers(), body })
    if (!res.ok) {
      const text = await res.text()
      console.error(`  [PATCH] Ошибка обновления filter-config для [${categoryValue}]: ${res.status} — ${text}`)
    } else {
      console.log(`  [PATCH] Обновлён filter-config ID=${existingId} для [${categoryValue}]`)
    }
  } else {
    // CREATE
    const url = `${BASE_URL}/api/filter-configs`
    const res = await fetch(url, { method: "POST", headers: headers(), body })
    if (!res.ok) {
      const text = await res.text()
      console.error(`  [POST] Ошибка создания filter-config для [${categoryValue}]: ${res.status} — ${text}`)
    } else {
      const created = await res.json()
      console.log(`  [POST] Создан filter-config ID=${created.doc?.id ?? "?"} для [${categoryValue}]`)
    }
  }
}

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

async function main() {
  if (!API_KEY) {
    console.warn("⚠️  PAYLOAD_API_KEY не задан. Запрос может завершиться ошибкой 403.")
  }

  console.log(`\nСервер: ${BASE_URL}`)
  console.log("=".repeat(60))
  console.log("СИДИРОВАНИЕ FILTER CONFIGS")
  console.log("=".repeat(60))

  for (const config of filterConfigs) {
    console.log(`\nКатегория: ${config.categoryValue}`)

    const categoryId = await fetchCategoryIdByValue(config.categoryValue)
    if (!categoryId) {
      console.warn(`  Пропускаем — категория не найдена.`)
      continue
    }
    console.log(`  ID категории: ${categoryId}`)

    await upsertFilterConfig(categoryId, config.filters, config.categoryValue)
  }

  console.log("\n" + "=".repeat(60))
  console.log("Готово!")
  console.log("=".repeat(60))
}

main().catch((err) => {
  console.error("Критическая ошибка:", err)
  process.exit(1)
})
