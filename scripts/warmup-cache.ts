/**
 * Скрипт для прогрева кэша сайта
 * Запуск: npx ts-node scripts/warmup-cache.ts
 * Или: node --loader ts-node/esm scripts/warmup-cache.ts
 *
 * Переменные окружения:
 * - SITE_URL: базовый URL сайта (по умолчанию http://localhost:3000)
 * - CONCURRENCY: количество параллельных запросов (по умолчанию 5)
 */

const SITE_URL = "https://alexestetica.ru"
const CONCURRENCY = Number(process.env.CONCURRENCY) || 5
const DELAY_BETWEEN_BATCHES = 100 // ms

interface City {
  slug: string
  name: string
}

interface Category {
  slug: string
  name: string
  subCategories?: Category[]
}

interface Product {
  id: number | string
}

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CacheWarmup/1.0",
      },
    })
    if (!response.ok) {
      console.error(`[ERROR] ${url} - ${response.status}`)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(`[ERROR] ${url} - ${error}`)
    return null
  }
}

async function warmupPage(url: string): Promise<{ url: string; status: number; time: number }> {
  const start = Date.now()
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CacheWarmup/1.0",
      },
    })
    const time = Date.now() - start
    return { url, status: response.status, time }
  } catch (error) {
    const time = Date.now() - start
    return { url, status: 0, time }
  }
}

async function processBatch<T, R>(items: T[], processor: (item: T) => Promise<R>, concurrency: number): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)

    if (i + concurrency < items.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
    }
  }

  return results
}

async function main() {
  console.log("=".repeat(60))
  console.log(`🔥 Прогрев кэша для: ${SITE_URL}`)
  console.log(`📊 Параллельность: ${CONCURRENCY}`)
  console.log("=".repeat(60))

  const startTime = Date.now()
  const allUrls: string[] = []

  // 1. Получаем список городов
  console.log("\n📍 Загрузка городов...")
  const citiesData = await fetchJSON<{ cities: City[] }>(`${SITE_URL}/api/cities?limit=1000`)
  const cities = citiesData?.cities || []
  console.log(`   Найдено городов: ${cities.length}`)

  if (cities.length === 0) {
    console.error("❌ Не удалось получить города. Проверьте SITE_URL.")
    process.exit(1)
  }

  // 2. Получаем категории и подкатегории
  
  const subCategories = ["kursy-massage", "kursy-kosmetologa", "kursy-tattoo", "massage", "massage-dlya-dvoih", "anticellulitnyy-massage", "lpg-massage", "abonementy-massage", "cosmetology", "spa", "spa-dlya-dvoih", "tattoo", "podarochnyy-sertifikat"]

  // 3. Получаем продукты (опционально)
  console.log("\n📦 Загрузка продуктов...")
  const productsData = await fetchJSON<{ docs: Product[] }>(`${SITE_URL}/api/products?limit=1000`)
  const products = productsData?.docs || []
  console.log(`   Найдено продуктов: ${products.length}`)

  // 4. Формируем список URL для каждого города
  console.log("\n🔗 Формирование URL...")

  for (const city of cities) {
    const citySlug = city.slug

    // Главная страница города
    allUrls.push(`${SITE_URL}/${citySlug}`)

    // Каталог
    allUrls.push(`${SITE_URL}/${citySlug}/catalog`)

    // Контакты
    allUrls.push(`${SITE_URL}/${citySlug}/contacts`)

    // Страницы подкатегорий
    for (const subSlug of subCategories) {
      allUrls.push(`${SITE_URL}/${citySlug}/${subSlug}`)
    }
  }

  console.log(`Всего URL для прогрева: ${allUrls.length}`)

  // 5. Прогрев кэша
  console.log("\n🚀 Начинаем прогрев кэша...\n")

  let successCount = 0
  let errorCount = 0
  let totalTime = 0

  const results = await processBatch(
    allUrls,
    async (url) => {
      const result = await warmupPage(url)

      if (result.status === 200) {
        successCount++
        console.log(`✅ [${result.time}ms] ${url.replace(SITE_URL, "")}`)
      } else {
        errorCount++
        console.log(`❌ [${result.status}] ${url.replace(SITE_URL, "")}`)
      }

      totalTime += result.time
      return result
    },
    CONCURRENCY,
  )

  // 6. Итоги
  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)
  const avgTime = results.length > 0 ? (totalTime / results.length).toFixed(0) : 0

  console.log("\n" + "=".repeat(60))
  console.log("📊 ИТОГИ ПРОГРЕВА")
  console.log("=".repeat(60))
  console.log(`✅ Успешно: ${successCount}`)
  console.log(`❌ Ошибок: ${errorCount}`)
  console.log(`⏱️  Общее время: ${duration}s`)
  console.log(`📈 Среднее время ответа: ${avgTime}ms`)
  console.log("=".repeat(60))
}

main().catch(console.error)
