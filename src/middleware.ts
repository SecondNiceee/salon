import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  

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
  console.log(pathname);
  const pathSegments = pathname.split("/").filter(Boolean)
  const firstSegment = pathSegments[0]


  console.log("[v0] Middleware: pathname:", pathname)
  console.log("[v0] Middleware: firstSegment:", firstSegment)

  try {
    const citiesResponse = await fetch(new URL("/api/cities", request.url).toString())

    if (!citiesResponse.ok) {
      console.error("[v0] Middleware: Failed to fetch cities")
      return NextResponse.next()
    }

    const { cities, defaultCity } = await citiesResponse.json()

    console.log("[v0] Middleware: defaultCity:", defaultCity)

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

    console.log("[v0] Middleware: firstSegment in supportedCities?", supportedCities.includes(firstSegment))

    // Если первый сегмент - это поддерживаемый город
    if (firstSegment && supportedCities.includes(firstSegment)) {
      // Проверяем алиасы - редирект на canonical city
      if (cityAliases[firstSegment]) {
        const canonicalCity = cityAliases[firstSegment]
        const newPathname = pathname.replace(`/${firstSegment}`, `/${canonicalCity}`)
        return NextResponse.redirect(new URL(newPathname, request.url))
      }
      console.log("[v0] Middleware: City found, proceeding without redirect")
      return NextResponse.next()
    }

    const targetCity = defaultCity || "moskva"

    console.log("[v0] Middleware: City NOT found, redirecting to:", targetCity)

    // If pathname is just "/" or empty, redirect to city root
    // Otherwise prepend city to the path
    const newPath = pathname === "/" || pathname === "" ? `/${targetCity}` : `/${targetCity}${pathname}`

    const newUrl = new URL(newPath, request.url)
    console.log("[v0] Middleware: Redirecting to:", newUrl.toString())
    return NextResponse.redirect(newUrl)
  } catch (error) {
    console.error("[v0] Middleware: Error processing cities", error)
    return NextResponse.next()
  }
}

// middleware.ts
export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'],
}