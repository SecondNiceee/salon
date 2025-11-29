"use client"

import { useCity } from "@/lib/use-city"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, X, Search } from "lucide-react"

type City = {
  name: string
  slug: string
  declensions: {
    nominative: string
  }
}

export function CitySelector({ className }: { className?: string }) {
  const currentCity = useCity()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [allCities, setAllCities] = useState<City[]>([])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => {
        setAllCities(data.cities || [])
      })
      .catch((err) => {
        console.error("Error loading cities:", err)
      })
  }, [])

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (searchQuery.trim() === "") {
      setCities([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceTimer.current = setTimeout(() => {
      fetch(`/api/cities?search=${encodeURIComponent(searchQuery)}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data.cities || [])
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error searching cities:", err)
          setLoading(false)
        })
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleCityChange = (newCitySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const stringParams = params.toString()
    const pathParts = pathname.split("/").filter(Boolean)

    console.log("[v0] CitySelector.handleCityChange:")
    console.log("[v0] - current pathname:", pathname)
    console.log("[v0] - pathParts before:", pathParts)
    console.log("[v0] - newCitySlug:", newCitySlug)

    pathParts[0] = newCitySlug
    const newPath = "/" + pathParts.join("/") + (stringParams ? "?" + stringParams : "")

    console.log("[v0] - pathParts after:", pathParts)
    console.log("[v0] - newPath:", newPath)

    router.push(newPath)
    setIsOpen(false)
    setSearchQuery("")
  }

  const currentCityName = useMemo(() => {
    const city = allCities.find((c) => c.slug === currentCity)
    return city?.declensions.nominative || currentCity
  }, [currentCity, allCities])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`justify-between bg-white ${className || "w-[180px]"}`}
      >
        <span className="truncate">{currentCityName}</span>
        <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-[280px] bg-white border rounded-md shadow-lg z-[300]">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-1">
            {loading && <div className="px-3 py-2 text-sm text-gray-500">Загрузка...</div>}

            {!loading && searchQuery && cities.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">Города не найдены</div>
            )}

            {!loading && searchQuery && cities.length > 0 && (
              <>
                {cities.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => handleCityChange(city.slug)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-gray-100 transition-colors ${
                      city.slug === currentCity ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {city.declensions.nominative}
                  </button>
                ))}
              </>
            )}

            {!searchQuery && <div className="px-3 py-2 text-sm text-gray-500">Начните вводить название города</div>}
          </div>
        </div>
      )}
    </div>
  )
}
  