"use client"

import { useCity } from "@/lib/use-city"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type City = {
  name: string
  slug: string
  declensions: {
    nominative: string
  }
}

export function CitySelector() {
  const currentCity = useCity()
  const pathname = usePathname()
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(" ")
      .then((res) => res.json())
      .then((data) => {
        setCities(data.cities || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error loading cities:", err)
        setLoading(false)
      })
  }, [])

  const handleCityChange = (newCitySlug: string) => {
    // Replace city in current path
    const pathParts = pathname.split("/").filter(Boolean)
    pathParts[0] = newCitySlug
    const newPath = "/" + pathParts.join("/")
    router.push(newPath)
  }

  if (loading || cities.length === 0) {
    return null
  }

  return (
    <Select value={currentCity} onValueChange={handleCityChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Выберите город" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.slug} value={city.slug}>
            {city.declensions.nominative}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
