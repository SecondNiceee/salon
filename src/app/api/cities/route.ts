// src/app/api/cities/route.ts
import { getCities } from "@/actions/server/cities/getCities"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParam = url.searchParams.get("search")?.trim()
    const limitParam = url.searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10

    // Получаем все города
    const cities = await getCities()

    let filteredCities = cities

    if (searchParam) {
      const term = searchParam.toLowerCase()
      filteredCities = cities
        .filter((city: any) => {
          return (
            (city.name && city.name.toLowerCase().includes(term)) ||
            (city.slug && city.slug.toLowerCase().includes(term)) ||
            (city.declensions?.nominative && city.declensions.nominative.toLowerCase().includes(term))
          )
        })
        .slice(0, limit)
    }

    // Получаем город по умолчанию (только если не ищем)
    const defaultCity = !searchParam ? (await getDefaultCity())?.slug || "moskva" : undefined

    return NextResponse.json({
      cities: filteredCities,
      ...(defaultCity !== undefined && { defaultCity }),
    })
  } catch (error) {
    console.error("[v0] Error in /api/cities:", error)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}

// Если у тебя нет этой функции — добавь её или импортируй
async function getDefaultCity() {
  const cities = await getCities()
  return cities.find((city) => city.isDefault) || cities[0] || null
}
