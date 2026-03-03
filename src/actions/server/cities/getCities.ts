"use server"

import config from "@/payload.config"
import { getPayload } from "payload"
import { unstable_cache } from "next/cache"


async function fetchCitiesFromPayload(): Promise<any> {
  try {
    const payload = await getPayload({ config })
    const citiesGlobal = await payload.findGlobal({
      slug: "cities",
    })
    return citiesGlobal.cities;
  } catch (error) {
    console.error("[v0] Error fetching cities from Payload:", error)
    return []
  }
}

// Кешируем города на день
export const getCities = unstable_cache(
  async () => {
    return await fetchCitiesFromPayload()
  },
  ["cities"],
  {
    revalidate: 3600 * 24, // Можно и на день кэшироваь, потому что при изменении городов мы ревалидируем всё
    tags: ["cities"],
  },              
)

export async function getDefaultCity(): Promise<any> {
  const cities = await getCities()
  return cities.find((city:any) => city.isDefault) || cities[0] || null
}

export async function getCityBySlug(slug: string): Promise<any> {
  const cities = await getCities();

  // Проверяем основной slug
  const cityBySlug = cities.find((city:any) => city.slug === slug)
  return cityBySlug || null
}


