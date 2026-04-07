// scripts/restore-filter-configs.ts
// Скрипт для восстановления всех FilterConfig
// Запуск: npx tsx scripts/restore-filter-configs.ts

import "dotenv/config"
import { getPayload } from "payload"
import configPromise from "../src/payload.config"

const log = {
  info: (msg: string) => console.log(`[INFO]  ${msg}`),
  success: (msg: string) => console.log(`[OK]    ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  divider: () => console.log("─".repeat(70)),
}

interface FilterOption {
  value: string
  label: string
  subOptions?: { value: string; label: string }[]
}

interface FilterField {
  key: string
  label: string
  type: "checkbox" | "radio" | "range"
  isAdvanced: boolean
  options?: FilterOption[]
  rangeMin?: number
  rangeMax?: number
  rangeStep?: number
  rangeUnit?: string
  rangeDefaultLabel?: string
}

interface FilterConfigData {
  categoryId: number
  filters: FilterField[]
}

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ФИЛЬТРЫ ПО КАТЕГОРИЯМ
// ─────────────────────────────────────────────────────────────────────────────

const allFilterConfigs: FilterConfigData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // Обучение массажу (ID: 8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 8,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Обучение Косметологии (ID: 9)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 9,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Обучение Тату и Татуаж (ID: 10)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 10,
    filters: [
      {
        key: "direction",
        label: "Направление / Стиль тату",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "classic_tatu", label: "Классическая татуировка (Тату-мастер, Мини-тату)" },
          { value: "permanent_makiazh", label: "Перманентный макияж (татуаж)" },
        ],
      },
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
        key: "document",
        label: "Документ по окончании",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "tatu_sertificate", label: "Свидетельство специалиста" },
          { value: "certificate_prof_tatu", label: "Удостоверение повышения квалификации" },
        ],
      },
      {
        key: "key_skill",
        label: "Ключевой навык",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "tatu_key", label: "Тату" },
          { value: "tatuash_key", label: "татуаж" },
        ],
      },
      {
        key: "tatu_skill",
        label: "Техника для тату",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "excise", label: "Работа с эскизами" },
          { value: "contur", label: "Контур" },
          { value: "shading", label: "Закрас/Штриховка" },
          { value: "hygiene", label: "Гигиена и стерильность" },
        ],
      },
      {
        key: "tatuash_technick",
        label: "Техника для татуажа",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "eyebrows", label: "Брови" },
          { value: "libs", label: "Губы" },
          { value: "eyes", label: "Веки" },
          { value: "correction", label: "Удаление/коррекция" },
        ],
      },
      {
        key: "tatu_education_form",
        label: "Формат обучения",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "individual_face_to_face", label: "Очно индивидуально " },
          { value: "group_face_to_face", label: "Очно в группе" },
        ],
      },
      {
        key: "extra",
        label: "Дополнительные опции",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "installment_payment", label: "Рассрочка оплаты" },
          { value: "portfolio_help", label: "Помощь с портфолио" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Спа (ID: 11)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 11,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Массаж (ID: 12)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 12,
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
          { value: "men", label: "Для мужчины" },
          { value: "women", label: "Для женщины" },
          { value: "couple", label: "Для двоих (взрослый)" },
          { value: "children", label: "Детский массаж" },
          { value: "medical_specialist", label: "Лечебный/Профилактический" },
          { value: "higher_education", label: "Специалист с медицинским образованием" },
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Подарочные сертификаты (ID: 13)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 13,
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
          { value: "for_duration", label: "На продолжительность" },
          { value: "money", label: "Сертификат на сумму (номинал)" },
        ],
      },
      {
        key: "money_diapozon",
        label: "Диапазон номинала",
        type: "range",
        isAdvanced: true,
        rangeMin: 2000,
        rangeMax: 10000,
        rangeStep: 500,
        rangeUnit: "₽",
        rangeDefaultLabel: "Любой номинал",
      },
      {
        key: "duration_diapozon",
        label: "Диапозон продолжительности",
        type: "range",
        isAdvanced: true,
        rangeMin: 0,
        rangeMax: 2,
        rangeStep: 0.5,
        rangeUnit: "ч",
        rangeDefaultLabel: "Любая продолжительность",
      },
      {
        key: "sertification_type",
        label: "Вид сертификата",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "distation", label: "Электронный сертифика" },
          { value: "phisical", label: "Физический сертификат" },
        ],
      },
      {
        key: "delivery_method",
        label: "Способ доставки",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "courier", label: "Курьером" },
          { value: "online", label: "Онлайн (электронный)" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Косметология (ID: 14)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 14,
    filters: [
      {
        key: "procedure_type",
        label: "Тип процедуры",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "facial_care", label: "Уход за лицом" },
          { value: "injection", label: "Инъекционная косметология" },
          { value: "hardware", label: "Аппаратная косметология" },
          { value: "facial_cleansing", label: "Чистка лица" },
          { value: "peeling", label: "Пилинг" },
          { value: "facial_massage", label: "Массаж лица и тела" },
          { value: "epilation", label: "Эпиляция" },
        ],
      },
      {
        key: "zone",
        label: "Зона воздействия",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "face", label: "Лицо" },
          { value: "neck_decollete", label: "Шея и декольте" },
          { value: "body", label: "Тело" },
          { value: "any", label: "Любая" },
        ],
      },
      {
        key: "price_range",
        label: "Цена (₽)",
        type: "radio",
        isAdvanced: false,
        options: [
          { value: "under_3000", label: "до 3 000" },
          { value: "3000_6000", label: "3 000 – 6 000" },
          { value: "6000_10000", label: "6 000 – 10 000" },
          { value: "over_10000", label: "более 10 000" },
        ],
      },
      {
        key: "specialist",
        label: "Специалист",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "esthetician", label: "Косметолог-эстетист" },
          { value: "medical_cosmetologist", label: "Врач-косметолог (медицинское образование)" },
          { value: "dermatologist", label: "Дерматолог" },
        ],
      },
      {
        key: "duration",
        label: "Длительность процедуры",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "under_30", label: "До 30 мин" },
          { value: "30_60", label: "30 – 60 мин" },
          { value: "60_90", label: "60 – 90 мин" },
          { value: "over_90", label: "Более 90 мин" },
        ],
      },
      {
        key: "extra",
        label: "Дополнительные опции",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "discount", label: "Есть акция / скидка" },
          { value: "online_booking", label: "Можно записаться онлайн" },
          { value: "high_rating", label: "Рейтинг услуги от 4+" },
          { value: "premium_products", label: "Использование премиальных препаратов" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Тату (ID: 16)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: 16,
    filters: [
      {
        key: "body_part",
        label: "Часть тела",
        type: "radio",
        isAdvanced: false,
        options: [
          {
            value: "head_and_neck",
            label: "Голова и шея",
            subOptions: [
              { value: "face_only", label: "Лицо" },
              { value: "skull_only", label: "Череп / волосистая часть" },
              { value: "neck_only", label: "Шея (спереди, сбоку, сзади)" },
              { value: "behind_the_ears", label: "За ушами / область за ухом" },
            ],
          },
          {
            value: "hands",
            label: "Руки",
            subOptions: [
              { value: "shouldre_only", label: "Плечо (дельта)" },
              { value: "forearm_only", label: "Предплечье (внешняя / внутренняя сторона)" },
              { value: "elbow_only", label: "Локоть / подлокотная зона" },
              { value: "brush_only", label: "Кисть (тыльная сторона, пальцы)" },
              { value: "full_sleeve", label: "Полный рукав (full sleeve)" },
              { value: "half_sleeve", label: "Половина рукава (half sleeve)" },
            ],
          },
          {
            value: "torso",
            label: "Торс",
            subOptions: [
              { value: "chest_only", label: "Грудная клетка" },
              { value: "Ribs_side_part", label: "Ребра / боковая часть" },
              { value: "stomach_only", label: "Живот / пресс" },
              { value: "lower_back", label: "Поясница (нижняя часть спины)" },
              { value: "back", label: "Спина (вся зона или части: лопатки, центр)" },
            ],
          },
          {
            value: "legs",
            label: "Ноги",
            subOptions: [
              { value: "hip_only", label: "Бедро (переднее, боковое, заднее)" },
              { value: "lower_leg", label: "Голень (икры)" },
              { value: "knee_only", label: "Колено / подколенная область" },
              { value: "ankle", label: "Щиколотка / лодыжка" },
              { value: "feet_only", label: "Стопа (верх, пальцы)" },
            ],
          },
          {
            value: "intimate",
            label: "Интимные и сложные зоны",
            subOptions: [
              { value: "bikini_only", label: "Лобковая зона / бикини" },
              { value: "under_breast", label: "Подгрудная область (под грудью)" },
              { value: "inner_thigh", label: "Внутренняя поверхность бедра" },
            ],
          },
        ],
      },
      {
        key: "level",
        label: "Уровень подготовки",
        type: "radio",
        isAdvanced: false,
        options: [
          { value: "beginners", label: "Для начинающих (с нуля)" },
          { value: "advanced", label: "Повышение квалификации" },
        ],
      },
      {
        key: "document_type",
        label: "Тип документа",
        type: "checkbox",
        isAdvanced: false,
        options: [
          { value: "certificate", label: "Свидетельство специалиста" },
          { value: "advanced_cert", label: "Удостоверение повышения квалификации" },
        ],
      },
      {
        key: "skills_tattoo",
        label: "Ключевой навык/техника (тату)",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "sketches", label: "Работа с эскизами" },
          { value: "outline", label: "Контур" },
          { value: "fill_shading", label: "Закрас / Штриховка" },
          { value: "hygiene", label: "Гигиена и стерильность" },
        ],
      },
      {
        key: "skills_makeup",
        label: "Ключевой навык/техника (татуаж)",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "eyebrows", label: "Брови" },
          { value: "lips", label: "Губы" },
          { value: "eyelids", label: "Веки" },
          { value: "removal_correction", label: "Удаление / коррекция" },
        ],
      },
      {
        key: "format",
        label: "Формат обучения",
        type: "radio",
        isAdvanced: true,
        options: [
          { value: "individual", label: "Очно индивидуально" },
          { value: "group", label: "Очно в группе" },
        ],
      },
      {
        key: "extra_options",
        label: "Дополнительные опции",
        type: "checkbox",
        isAdvanced: true,
        options: [
          { value: "portfolio_help", label: "Помощь с портфолио" },
          { value: "payment_plan", label: "Рассрочка оплаты" },
        ],
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n" + "═".repeat(70))
  console.log("  ВОССТАНОВЛЕНИЕ FilterConfigs")
  console.log("═".repeat(70) + "\n")

  const payload = await getPayload({ config: configPromise })

  for (const config of allFilterConfigs) {
    log.divider()
    log.info(`Обработка категории ID: ${config.categoryId}`)

    try {
      // Проверяем, существует ли уже FilterConfig для этой категории
      const existing = await payload.find({
        collection: "filter-configs",
        where: { category: { equals: config.categoryId } },
        limit: 1,
      })

      // Формируем данные фильтров для Payload
      const filtersData = config.filters.map((f) => {
        const base: Record<string, unknown> = {
          key: f.key,
          label: f.label,
          type: f.type,
          isAdvanced: f.isAdvanced,
        }

        if (f.type === "range") {
          base.rangeMin = f.rangeMin
          base.rangeMax = f.rangeMax
          base.rangeStep = f.rangeStep
          base.rangeUnit = f.rangeUnit
          base.rangeDefaultLabel = f.rangeDefaultLabel
        } else if (f.options) {
          base.options = f.options.map((opt) => ({
            value: opt.value,
            label: opt.label,
            subOptions: opt.subOptions?.map((sub) => ({
              value: sub.value,
              label: sub.label,
            })),
          }))
        }

        return base
      })

      if (existing.docs.length > 0) {
        // Обновляем существующий
        await payload.update({
          collection: "filter-configs",
          id: existing.docs[0].id,
          data: {
            category: config.categoryId,
            enabled: true,
            filters: filtersData,
          },
        })
        log.success(`Обновлён FilterConfig для категории ${config.categoryId}`)
      } else {
        // Создаём новый
        await payload.create({
          collection: "filter-configs",
          data: {
            category: config.categoryId,
            enabled: true,
            filters: filtersData,
          },
        })
        log.success(`Создан FilterConfig для категории ${config.categoryId}`)
      }
    } catch (err) {
      log.error(`Ошибка для категории ${config.categoryId}: ${err}`)
    }
  }

  log.divider()
  console.log("\n[OK] Готово!\n")
  process.exit(0)
}

main().catch((err) => {
  console.error("Критическая ошибка:", err)
  process.exit(1)
})
