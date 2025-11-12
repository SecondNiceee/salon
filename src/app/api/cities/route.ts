import { getCities, getDefaultCity, getCitySlugs } from "@/actions/server/cities/getCities"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cities = await getCities()
    const defaultCity = await getDefaultCity()
    const slugs = await getCitySlugs()

    return NextResponse.json({
      cities,
      defaultCity: defaultCity?.slug || "moscow",
      slugs
    })
  } catch (error) {
    console.error("[v0] Error in /api/cities:", error)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}
