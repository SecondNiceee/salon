"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export type City = {
  name: string
  slug: string
  declensions: {
    nominative: string
    genitive: string
    prepositional: string
  }
  seoTitle?: string
}

export function useCity(): string | null {
  const params = useParams()
  return (params?.city as string) || null
}

export function useCityData(): City | null {
  const citySlug = useCity()
  const [cityData, setCityData] = useState<City | null>(null)

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => {
        const city = data.cities?.find((c: City) => c.slug === citySlug)
        if (city) {
          setCityData(city)
        }
      })
      .catch((err) => {
        console.error("[v0] Error fetching city data:", err)
      })
  }, [citySlug])

  return cityData
}
  