import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// These are fallback values if Payload is not available
const FALLBACK_CITIES = ["moscow", "piter"]
const FALLBACK_DEFAULT = "moscow"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin, API, and static files
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

  // Try to fetch cities from Payload
  let supportedCities: string[] = FALLBACK_CITIES
  let cityAliases: Record<string, string> = {}
  let defaultCity = FALLBACK_DEFAULT

  try {
    // Fetch cities from the API route
    const baseUrl = request.nextUrl.origin
    const citiesResponse = await fetch(`${baseUrl}/api/cities`, {
      next: { revalidate: 3600, tags: ["cities"] },
    })

    if (citiesResponse.ok) {
      const citiesData = await citiesResponse.json()
      supportedCities = citiesData.slugs || FALLBACK_CITIES
      cityAliases = citiesData.aliases || {}
      defaultCity = citiesData.defaultCity || FALLBACK_DEFAULT
    }
  } catch (error) {
    console.error("[v0] Middleware: Error fetching cities, using fallback", error)
  }

  // Check if the first segment is a supported city
  if (firstSegment && supportedCities.includes(firstSegment)) {
    // Handle city aliases - redirect to canonical city
    if (cityAliases[firstSegment]) {
      const canonicalCity = cityAliases[firstSegment]
      const newPathname = pathname.replace(`/${firstSegment}`, `/${canonicalCity}`)
      return NextResponse.redirect(new URL(newPathname, request.url))
    }
    return NextResponse.next()
  }

  // Redirect to default city
  const newUrl = new URL(`/${defaultCity}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.).*)"],
}
