import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCities, getDefaultCity } from "./actions/server/cities/getCities"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin, API, и static files
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const pathSegments = pathname.split("/").filter(Boolean)
  const firstSegment = pathSegments[0]

  try {
    // Получаем все города из Payload
    const cities = await getCities()

    if (!cities || cities.length === 0) {
      console.error("[v0] Middleware: No cities found")
      return NextResponse.next()
    }

    // Получаем список поддерживаемых slugs и алиасы
    const supportedCities = cities.map((city: any) => city.slug)
    const cityAliases: Record<string, string> = {}

    cities.forEach((city: any) => {
      if (city.aliases && Array.isArray(city.aliases)) {
        city.aliases.forEach((alias: any) => {
          if (alias.alias) {
            cityAliases[alias.alias] = city.slug
          }
        })
      }
    })

    // Если первый сегмент - это поддерживаемый город
    if (firstSegment && supportedCities.includes(firstSegment)) {
      // Проверяем алиасы - редирект на canonical city
      if (cityAliases[firstSegment]) {
        const canonicalCity = cityAliases[firstSegment]
        const newPathname = pathname.replace(`/${firstSegment}`, `/${canonicalCity}`)
        return NextResponse.redirect(new URL(newPathname, request.url))
      }
      return NextResponse.next()
    }

    const defaultCity = await getDefaultCity()
    if (defaultCity && defaultCity.slug) {
      const newUrl = new URL(`/${defaultCity.slug}${pathname}`, request.url)
      return NextResponse.redirect(newUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("[v0] Middleware: Error processing cities", error)
    // В случае ошибки просто пропускаем дальше
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.).*)"],
}
